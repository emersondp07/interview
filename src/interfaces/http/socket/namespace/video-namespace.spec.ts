import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import { env } from '@/infra/config'
import { app, start } from '@/infra/http/server'
import { createAndAuthenticateForVideo } from '@/tests/factories/create-and-authenticate-for-video'
import { io as Client, type Socket } from 'socket.io-client'

describe.skip('Video Namespace (e2e)', () => {
	let clientSocket: Socket
	let interviewerSocket: Socket
	let interviewId: string
	let clientId: string
	let interviewerId: string
	let doctorId: string
	let patientId: string

	beforeAll(async () => {
		await start()

		const {
			tokenClient,
			tokenInterviewer,
			interviewId: testInterviewId,
			clientId: testClientId,
			interviewerId: testInterviewerId,
			doctorId: testDoctorId,
			patientId: testPatientId,
		} = await createAndAuthenticateForVideo(app)

		interviewId = testInterviewId
		clientId = testClientId
		interviewerId = testInterviewerId
		doctorId = testDoctorId
		patientId = testPatientId

		// Create client socket without authentication (video namespace doesn't require auth in current impl)
		clientSocket = Client(`http://localhost:${env.PORT}/video`, {
			withCredentials: true,
		})

		// Create interviewer socket
		interviewerSocket = Client(`http://localhost:${env.PORT}/video`, {
			withCredentials: true,
		})

		await new Promise<void>((resolve) => {
			let connected = 0
			const onConnect = () => {
				connected++
				if (connected === 2) resolve()
			}

			clientSocket.on('connect', onConnect)
			interviewerSocket.on('connect', onConnect)
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
	})

	it('should connect to video namespace', async () => {
		expect(clientSocket.connected).toBe(true)
		expect(interviewerSocket.connected).toBe(true)
	})

	it('should receive connection success event', async () => {
		const clientConnectionSuccess = new Promise((resolve) => {
			clientSocket.once('connection-success', resolve)
		})

		const interviewerConnectionSuccess = new Promise((resolve) => {
			interviewerSocket.once('connection-success', resolve)
		})

		const [clientSuccess, interviewerSuccess] = await Promise.all([
			clientConnectionSuccess,
			interviewerConnectionSuccess,
		])

		expect(clientSuccess).toMatchObject({
			socketId: expect.any(String),
			serverTime: expect.any(String),
		})

		expect(interviewerSuccess).toMatchObject({
			socketId: expect.any(String),
			serverTime: expect.any(String),
		})
	})

	it('should get RTP capabilities', async () => {
		const response = await new Promise((resolve, reject) => {
			interviewerSocket.emit('getRtpCapabilities', (response: any) => {
				if (response.error) {
					reject(response.error)
				} else {
					resolve(response)
				}
			})
		})

		expect(response).toMatchObject({
			rtpCapabilities: expect.objectContaining({
				codecs: expect.any(Array),
				headerExtensions: expect.any(Array),
			}),
		})
	})

	it('should allow interviewer to join interview room', async () => {
		const response = await new Promise((resolve, reject) => {
			interviewerSocket.emit(
				'join-interview',
				{
					interviewId,
					patientId,
					doctorId,
					role: ROLE.INTERVIEWER,
				},
				(response: any) => {
					if (response.error) {
						reject(response.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		expect(response).toMatchObject({
			success: true,
			socketId: expect.any(String),
			roomInfo: {
				interviewId,
				isRecording: true, // Should start recording when interviewer joins
				participantCount: 1,
			},
		})
	})

	it('should allow client to join interview room', async () => {
		const response = await new Promise((resolve, reject) => {
			clientSocket.emit(
				'join-interview',
				{
					interviewId,
					patientId,
					doctorId,
					role: ROLE.CLIENT,
				},
				(response: any) => {
					if (response.error) {
						reject(response.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		expect(response).toMatchObject({
			success: true,
			socketId: expect.any(String),
			roomInfo: {
				interviewId,
				isRecording: true,
				participantCount: 2,
			},
		})
	})

	it('should notify other participant when someone joins', async () => {
		// Create new sockets for this test to avoid interference
		const newInterviewerSocket = Client(`http://localhost:${env.PORT}/video`)
		const newClientSocket = Client(`http://localhost:${env.PORT}/video`)

		await new Promise<void>((resolve) => {
			let connected = 0
			const onConnect = () => {
				connected++
				if (connected === 2) resolve()
			}

			newInterviewerSocket.on('connect', onConnect)
			newClientSocket.on('connect', onConnect)
		})

		const testInterviewId = 'test-interview-notification'

		// Setup listener for participant joined event
		const participantJoinedPromise = new Promise((resolve) => {
			newInterviewerSocket.once('participant-joined', resolve)
		})

		// Interviewer joins first
		await new Promise((resolve, reject) => {
			newInterviewerSocket.emit(
				'join-interview',
				{
					interviewId: testInterviewId,
					patientId,
					doctorId,
					role: ROLE.INTERVIEWER,
				},
				(response: any) => {
					if (response.error) {
						reject(response.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		// Client joins second (should trigger notification)
		await new Promise((resolve, reject) => {
			newClientSocket.emit(
				'join-interview',
				{
					interviewId: testInterviewId,
					patientId,
					doctorId,
					role: ROLE.CLIENT,
				},
				(response: any) => {
					if (response.error) {
						reject(response.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		// Wait for notification
		const notification = await participantJoinedPromise

		expect(notification).toMatchObject({
			role: ROLE.CLIENT,
			socketId: expect.any(String),
		})

		// Clean up
		newInterviewerSocket.disconnect()
		newClientSocket.disconnect()
	})

	it('should create WebRTC transport for producer', async () => {
		const response = await new Promise((resolve, reject) => {
			interviewerSocket.emit(
				'createWebRtcTransport',
				{ sender: true },
				(response: any) => {
					if (response.params?.error) {
						reject(response.params.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		expect(response).toMatchObject({
			params: {
				id: expect.any(String),
				iceParameters: expect.any(Object),
				iceCandidates: expect.any(Array),
				dtlsParameters: expect.any(Object),
			},
		})
	})

	it('should create WebRTC transport for consumer', async () => {
		const response = await new Promise((resolve, reject) => {
			clientSocket.emit(
				'createWebRtcTransport',
				{ sender: false },
				(response: any) => {
					if (response.params?.error) {
						reject(response.params.error)
					} else {
						resolve(response)
					}
				},
			)
		})

		expect(response).toMatchObject({
			params: {
				id: expect.any(String),
				iceParameters: expect.any(Object),
				iceCandidates: expect.any(Array),
				dtlsParameters: expect.any(Object),
			},
		})
	})

	it('should handle consume request with no producers', async () => {
		const mockRtpCapabilities = {
			codecs: [
				{
					mimeType: 'video/VP8',
					kind: 'video',
					clockRate: 90000,
					channels: 1,
				},
			],
			headerExtensions: [],
		}

		const response = await new Promise((resolve) => {
			clientSocket.emit(
				'consume',
				{ rtpCapabilities: mockRtpCapabilities },
				resolve,
			)
		})

		// Should return empty array when no producers available
		expect(Array.isArray(response)).toBe(true)
		expect(response).toEqual([])
	})

	it('should end interview successfully', async () => {
		const response = await new Promise((resolve, reject) => {
			interviewerSocket.emit('end-interview', (response: any) => {
				if (response.error) {
					reject(response.error)
				} else {
					resolve(response)
				}
			})
		})

		expect(response).toMatchObject({
			success: true,
			recordingInfo: expect.objectContaining({
				duration: expect.any(Number),
				endTime: expect.any(String),
			}),
		})
	})

	it('should handle participant disconnect', async () => {
		// Create new sockets for this test
		const testInterviewerSocket = Client(`http://localhost:${env.PORT}/video`)
		const testClientSocket = Client(`http://localhost:${env.PORT}/video`)

		await new Promise<void>((resolve) => {
			let connected = 0
			const onConnect = () => {
				connected++
				if (connected === 2) resolve()
			}

			testInterviewerSocket.on('connect', onConnect)
			testClientSocket.on('connect', onConnect)
		})

		const testInterviewId = 'test-interview-disconnect'

		// Both join the room
		await Promise.all([
			new Promise((resolve, reject) => {
				testInterviewerSocket.emit(
					'join-interview',
					{
						interviewId: testInterviewId,
						patientId,
						doctorId,
						role: ROLE.INTERVIEWER,
					},
					(response: any) => {
						if (response.error) reject(response.error)
						else resolve(response)
					},
				)
			}),
			new Promise((resolve, reject) => {
				testClientSocket.emit(
					'join-interview',
					{
						interviewId: testInterviewId,
						patientId,
						doctorId,
						role: ROLE.CLIENT,
					},
					(response: any) => {
						if (response.error) reject(response.error)
						else resolve(response)
					},
				)
			}),
		])

		// Setup listener for disconnect notification
		const disconnectPromise = new Promise((resolve) => {
			testClientSocket.once('participant-disconnected', resolve)
		})

		// Interviewer disconnects
		testInterviewerSocket.disconnect()

		// Wait for notification
		const disconnectNotification = await disconnectPromise

		expect(disconnectNotification).toMatchObject({
			socketId: expect.any(String),
		})

		// Clean up
		testClientSocket.disconnect()
	})

	it('should not allow unauthorized access to room', async () => {
		const unauthorizedSocket = Client(`http://localhost:${env.PORT}/video`)

		await new Promise<void>((resolve) => {
			unauthorizedSocket.on('connect', resolve)
		})

		const response = await new Promise((resolve) => {
			unauthorizedSocket.emit(
				'join-interview',
				{
					interviewId,
					patientId: 'wrong-patient-id',
					doctorId: 'wrong-doctor-id',
					role: ROLE.CLIENT,
				},
				resolve,
			)
		})

		expect(response).toMatchObject({
			error: 'Não autorizado para esta entrevista',
		})

		unauthorizedSocket.disconnect()
	})

	it('should not allow multiple doctors in same room', async () => {
		const secondInterviewerSocket = Client(`http://localhost:${env.PORT}/video`)

		await new Promise<void>((resolve) => {
			secondInterviewerSocket.on('connect', resolve)
		})

		const testInterviewId = 'test-multiple-doctors'

		// First doctor joins
		await new Promise((resolve, reject) => {
			interviewerSocket.emit(
				'join-interview',
				{
					interviewId: testInterviewId,
					patientId,
					doctorId,
					role: ROLE.INTERVIEWER,
				},
				(response: any) => {
					if (response.error) reject(response.error)
					else resolve(response)
				},
			)
		})

		// Second doctor tries to join
		const response = await new Promise((resolve) => {
			secondInterviewerSocket.emit(
				'join-interview',
				{
					interviewId: testInterviewId,
					patientId,
					doctorId,
					role: ROLE.INTERVIEWER,
				},
				resolve,
			)
		})

		expect(response).toMatchObject({
			error: 'Doutor já está conectado nesta entrevista',
		})

		secondInterviewerSocket.disconnect()
	})
})
