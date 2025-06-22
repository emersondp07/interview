import type { Server, Socket } from 'socket.io'
import { getClientByDocument } from '../../controllers/client/get-client-by-document'
import { fetchClientsOnline } from '../../controllers/interviewer/fetch-clients-online'
import { finishInterview } from '../../controllers/interviewer/finish-interview'
import { sendContract } from '../../controllers/interviewer/send-contract'
import { startInterview } from '../../controllers/interviewer/start-interview'
import { verifyJwtSocket } from '../../middlewares/verify-jwt-socket'

export const waitingQueue: Map<string, Socket> = new Map()

export function registerInterviewNamespace(io: Server) {
	const nsp = io.of('/interview')

	nsp.use((socket, next) => {
		verifyJwtSocket(socket, next)
	})

	nsp.on('connection', (socket: Socket) => {
		socket.on('list-client', async (data, socket) => {
			await fetchClientsOnline(data, socket)
		})

		socket.on('join-queue', async (data, socket) => {
			await getClientByDocument(data, socket)
		})

		socket.on('start-interview', async (data, socket) => {
			await startInterview(data, socket)
		})

		socket.on('send-contract', async (data, socket) => {
			await sendContract(data, socket)
		})

		socket.on('finish-interview', async (data, socket) => {
			await finishInterview(data, socket)
		})
	})
}
