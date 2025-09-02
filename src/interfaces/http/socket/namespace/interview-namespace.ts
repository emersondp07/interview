import type { Server, Socket } from 'socket.io'
import { getClientByDocument } from '../../controllers/client/get-client-by-document'
import { fetchClientsOnline } from '../../controllers/interviewer/fetch-clients-online'
import { finishInterview } from '../../controllers/interviewer/finish-interview'
import { sendContract } from '../../controllers/interviewer/send-contract'
import { startInterview } from '../../controllers/interviewer/start-interview'
import { verifyJwtSocket } from '../../middlewares/verify-jwt-socket'

// export const onlineInterviewers: Map<string, Socket> = new Map()
export const onlineClients: Map<string, Socket> = new Map()
// export const onlineCompanies: Map<string, Socket> = new Map()
export const waitingQueue: Map<string, Socket> = new Map()

export async function registerInterviewNamespace(io: Server) {
	const nsp = io.of('/interview')

	nsp.use((socket, next) => {
		verifyJwtSocket(socket, next)
	})

	nsp.on('connection', (socket: Socket) => {
		socket.on('join-queue', async (data) => {
			await getClientByDocument(data, socket)
		})

		socket.on('list-client', async (data) => {
			await fetchClientsOnline(data, socket)
		})

		socket.on('start-interview', async (data) => {
			await startInterview(data, socket)
		})

		socket.on('send-contract', async (data) => {
			await sendContract(data, socket)
		})

		socket.on('finish-interview', async (data) => {
			await finishInterview(data, socket)
		})

		socket.on('disconnect', (data) => {
			socket.emit('disconnect:response', {
				message: 'You have been disconnected',
				data,
			})

			const clientId = socket.data.clientId

			if (clientId) {
				const clientInQueue = waitingQueue.get(clientId)
				if (clientInQueue) {
					waitingQueue.delete(clientId)
				}

				const clientInOnline = onlineClients.get(clientId)
				if (clientInOnline) {
					onlineClients.delete(clientId)
				}
			}
		})
	})
}
