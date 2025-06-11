import { httpServer, start } from '@/infra/http/server'
import { io as Client, type Socket } from 'socket.io-client'

describe('Interview Namespace Socket.IO', () => {
	let clientSocket: Socket

	beforeAll(async () => {
		await start()

		const port = (httpServer.address() as any).port
		clientSocket = Client(`http://localhost:${port}/interview`, {
			auth: {
				token: 'Bearer ',
			},
		})

		await new Promise<void>((resolve) => {
			clientSocket.on('connect', () => resolve())
		})
	})

	afterAll(() => {
		if (clientSocket.connected) {
			clientSocket.disconnect()
		}
		httpServer.close()
	})

	it('should connect to interview namespace', () => {
		expect(clientSocket.connected).toBe(true)
	})

	it('should handle "list" event', async () => {
		clientSocket.emit('list', 'world')
	})

	it('should handle "send" event', async () => {
		clientSocket.emit('send', { message: 'teste' }, (response: any) => {
			expect(response).toBeDefined()
		})
	})

	it('should detect disconnect event', async () => {
		clientSocket.on('disconnect', () => {})
	})
})
