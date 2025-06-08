import type { Server, Socket } from 'socket.io'

export function registerInterviewNamespace(io: Server) {
	const nsp = io.of('/interview')

	nsp.on('connection', (socket: Socket) => {
		console.log('[interview] cliente conectado:', socket.id)

		socket.on('list', async (_, callback) => {})

		socket.on('send', async (payload, callback) => {})

		socket.on('disconnect', () => {
			console.log('[chat] desconectou:', socket.id)
		})
	})
}
