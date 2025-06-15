import { app, httpServer, start } from '@/infra/http/server'
import { createAndAuthenticateCompany } from '@/tests/factories/create-and-authenticate-company'
import { io as Client, type Socket } from 'socket.io-client'

describe('Interview Namespace (e2e)', () => {
	let clientSocket: Socket

	beforeAll(async () => {
		await start()

		const { token } = await createAndAuthenticateCompany(app)

		const port = (httpServer.address() as any).port
		clientSocket = Client(`http://localhost:${port}/interview`, {
			auth: {
				token: `Bearer ${token}`,
			},
		})

		await new Promise<void>((resolve) => {
			clientSocket.on('connect', () => resolve())
		})
	})

	afterAll(async () => {
		if (clientSocket.connected) {
			clientSocket.disconnect()
		}

		await app.close()
		httpServer.close()
	})

	it('should connect to interview namespace', async () => {
		expect(clientSocket.connected).toBe(true)
	})

	it('should handle "list-client" event', async () => {
		clientSocket.emit('list-client', { page: 1 })

		clientSocket.on('list-client:response', (response) => {
			expect(response).toBeDefined()
			expect(Array.isArray(response)).toBe(true)
		})
	})

	it('should handle "join-queue" event', async () => {
		clientSocket.emit('join-queue', { document: '1234567890' })

		clientSocket.on('join-queue:response', (response) => {
			expect(response).toBeDefined()
			expect(response.message).toBe('Client added to the waiting queue')
		})
	})

	it('should handle "start-interview" event', async () => {
		clientSocket.emit('start-interview', {
			clientId: 'teste',
			interviewId: 'teste',
		})

		clientSocket.on('start-interview:response', (response) => {
			expect(response).toBeDefined()
			expect(response.message).toBe('Interview started successfully')
			expect(response.interview).toBeDefined()
		})
	})

	it('should handle "send-contract" event', async () => {
		clientSocket.emit('send-contract', {
			clientId: 'teste',
			interviewId: 'teste',
		})

		clientSocket.on('send-contract:response', (response) => {
			expect(response).toBeDefined()
			expect(response.message).toBe('Contract sent successfully')
			expect(response.interview).toBeDefined()
		})
	})

	it('should handle "finish-interview" event', async () => {
		clientSocket.emit('finish-interview', {
			clientId: 'teste',
			interviewId: 'teste',
		})

		clientSocket.on('finish-interview:response', (response) => {
			expect(response).toBeDefined()
			expect(response.message).toBe('Interview finished successfully')
		})
	})

	it('should detect disconnect event', async () => {
		clientSocket.on('disconnect', () => {})
		clientSocket.disconnect()
	})
})
