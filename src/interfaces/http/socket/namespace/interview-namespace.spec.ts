import { env } from '@/infra/config'
import { app, start } from '@/infra/http/server'
import { createAndAuthenticateClientInterviewer } from '@/tests/factories/create-and-authenticate-client-interviewer'
import {
	getUniqueTestPort,
	releaseTestPort,
} from '@/tests/utils/test-port-generator'
import { io as Client, type Socket } from 'socket.io-client'

describe('Interview Namespace (e2e)', () => {
	let clientSocket: Socket
	let interviewerSocket: Socket
	let idClient: string
	let idInterview: string
	let clientDocument: string
	let testPort: number

	beforeAll(async () => {
		testPort = getUniqueTestPort()
		await start(testPort)

		const { tokenClient, tokenInterviewer, document, clientId, interviewId } =
			await createAndAuthenticateClientInterviewer(app)

		clientSocket = Client(`http://localhost:${testPort}/interview`, {
			withCredentials: true,
			extraHeaders: {
				cookie: `token=${tokenClient}`,
			},
		})

		interviewerSocket = Client(`http://localhost:${testPort}/interview`, {
			withCredentials: true,
			extraHeaders: {
				cookie: `token=${tokenInterviewer}`,
			},
		})

		idClient = clientId
		idInterview = interviewId
		clientDocument = document

		await new Promise<void>((resolve) => {
			clientSocket.on('connect', () => resolve())
		})

		await new Promise<void>((resolve) => {
			interviewerSocket.on('connect', () => resolve())
		})
	}, 30000)

	afterAll(async () => {
		if (clientSocket?.connected) {
			clientSocket.disconnect()
		}
		if (interviewerSocket?.connected) {
			interviewerSocket.disconnect()
		}

		await app.close()

		// Liberar a porta para outros testes
		releaseTestPort(testPort)
	})

	it('should connect to interview namespace', async () => {
		expect(clientSocket.connected).toBe(true)
	})

	it('should handle "join-queue" event', async () => {
		clientSocket.emit('join-queue', { document: clientDocument })

		const response = await new Promise((resolve) => {
			clientSocket.once('join-queue:response', resolve)
		})

		expect(response).toMatchObject({
			message: 'Client added to the waiting queue',
		})
	})

	it('should handle "list-client" event', async () => {
		interviewerSocket.emit('list-client', { page: 1 })

		const response = await new Promise((resolve) => {
			interviewerSocket.once('list-client:response', resolve)
		})

		expect(response).toBeDefined()
		expect(Array.isArray(response)).toBe(true)
	})

	it('should handle "start-interview" event', async () => {
		interviewerSocket.emit('start-interview', {
			clientId: idClient,
			interviewId: idInterview,
		})

		const response = await new Promise((resolve) => {
			interviewerSocket.once('start-interview:response', resolve)
		})

		expect(response).toBeDefined()
		expect(response).toMatchObject({
			message: 'Interview started successfully',
			interview: {
				interview: {
					_id: {
						value: expect.any(String),
					},
					props: {
						clientId: {
							value: idClient,
						},
						companyId: {
							value: expect.any(String),
						},
						createdAt: expect.any(String),
						status: expect.any(String),
						updatedAt: expect.any(String),
					},
				},
			},
		})
	})

	it('should handle "send-contract" event', async () => {
		interviewerSocket.emit('send-contract', {
			clientId: idClient,
			interviewId: idInterview,
		})

		const response = await new Promise((resolve) => {
			interviewerSocket.once('send-contract:response', resolve)
		})

		expect(response).toBeDefined()
	})

	it('should handle "finish-interview" event', async () => {
		interviewerSocket.emit('finish-interview', {
			clientId: idClient,
			interviewId: idInterview,
		})

		const response = await new Promise((resolve) => {
			interviewerSocket.once('finish-interview:response', resolve)
		})

		expect(response).toBeDefined()
	})

	it('should detect disconnect event', async () => {
		clientSocket.on('disconnect', () => {})
		clientSocket.disconnect()
	})
})
