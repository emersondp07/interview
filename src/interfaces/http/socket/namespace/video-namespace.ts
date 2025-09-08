import { EndInterviewUseCase } from '@/application/video/use-cases/end-interview'
import { HandleDisconnectUseCase } from '@/application/video/use-cases/handle-disconnect'
import { JoinInterviewRoomUseCase } from '@/application/video/use-cases/join-interview-room'
import { ManageMediaStreamsUseCase } from '@/application/video/use-cases/manage-media-streams'
import { InMemoryVideoSessionRepository } from '@/infra/video/in-memory-video-session-repository'
import { MediaSoupService } from '@/infra/video/mediasoup-service'
import { RecordingService } from '@/infra/video/recording-service'
import type { Server, Socket } from 'socket.io'

// Registrar namespace de vídeo
export async function registerVideoNamespace(io: Server) {
	console.log('Iniciando servidor de vídeo...')

	// Inicializar serviços
	const mediaSoupService = MediaSoupService.getInstance()
	const recordingService = RecordingService.getInstance()
	const videoSessionRepository = new InMemoryVideoSessionRepository()

	// Inicializar use cases
	const joinInterviewRoomUseCase = new JoinInterviewRoomUseCase(
		videoSessionRepository,
		recordingService,
	)
	const manageMediaStreamsUseCase = new ManageMediaStreamsUseCase(
		videoSessionRepository,
		mediaSoupService,
	)
	const endInterviewUseCase = new EndInterviewUseCase(
		videoSessionRepository,
		recordingService,
	)
	const handleDisconnectUseCase = new HandleDisconnectUseCase(
		videoSessionRepository,
		recordingService,
	)

	try {
		await mediaSoupService.initialize()
		console.log('MediaSoup inicializado com sucesso')
	} catch (error) {
		console.error('Erro ao inicializar MediaSoup:', error)
		throw error
	}

	const nsp = io.of('/video')

	nsp.on('connection', async (socket: Socket) => {
		console.log('Novo cliente conectado:', socket.id)

		// Entrar na sala de entrevista
		socket.on(
			'join-interview',
			async ({ interviewId, patientId, doctorId, role }, callback) => {
				const result = await joinInterviewRoomUseCase.execute({
					interviewId,
					patientId,
					doctorId,
					role,
					socketId: socket.id,
				})

				if (!result.success) {
					return callback({ error: result.error })
				}

				// Fazer socket entrar na sala do Socket.IO
				socket.join(interviewId)

				callback({
					success: true,
					socketId: socket.id,
					roomInfo: result.roomInfo,
				})

				// Notificar o outro participante se já estiver conectado
				const otherSocketId = result.room?.getOtherSocketId(socket.id)
				if (otherSocketId) {
					socket.to(otherSocketId).emit('participant-joined', {
						role,
						socketId: socket.id,
					})
					console.log(`Notificando ${otherSocketId} sobre entrada de ${role}`)
				}
			},
		)

		// Envia rtpCapabilities do router
		socket.on('getRtpCapabilities', (callback) => {
			console.log('getRtpCapabilities solicitado por:', socket.id)
			const rtpCapabilities = mediaSoupService.getRtpCapabilities()
			console.log('Enviando rtpCapabilities:', Object.keys(rtpCapabilities))
			callback({ rtpCapabilities })
		})

		// Criação de transport
		socket.on('createWebRtcTransport', async ({ sender }, callback) => {
			const result = await manageMediaStreamsUseCase.createWebRtcTransport({
				socketId: socket.id,
				sender,
			})

			if (!result.success) {
				return callback({ params: { error: result.error } })
			}

			callback({ params: result.params })
		})

		// Conectar transport do producer
		socket.on('transport-connect', async ({ dtlsParameters }) => {
			await manageMediaStreamsUseCase.connectProducerTransport(
				socket.id,
				dtlsParameters,
			)
		})

		// Conectar transport do consumer
		socket.on('transport-recv-connect', async ({ dtlsParameters }) => {
			await manageMediaStreamsUseCase.connectConsumerTransport(
				socket.id,
				dtlsParameters,
			)
		})

		// Produzir track (audio/video)
		socket.on(
			'transport-produce',
			async ({ kind, rtpParameters }, callback) => {
				const result = await manageMediaStreamsUseCase.produceMedia({
					socketId: socket.id,
					kind,
					rtpParameters,
				})

				if (!result.success) {
					return callback({ error: result.error })
				}

				// Notificar o outro participante se já estiver conectado
				const roomId = videoSessionRepository.getSocketRoom(socket.id)
				const room = roomId
					? videoSessionRepository.findById(roomId)
					: undefined
				const otherSocketId = room?.getOtherSocketId(socket.id)

				if (otherSocketId) {
					console.log(
						`Notificando ${otherSocketId} sobre novo producer ${result.producerId}`,
					)
					socket.to(otherSocketId).emit('producer-ready', {
						producerId: result.producerId,
						socketId: socket.id,
						kind: kind,
					})
				}

				callback({ id: result.producerId })
			},
		)

		// Pausar producer
		socket.on('producer-pause', async ({ producerId }) => {
			const success = await manageMediaStreamsUseCase.pauseProducer(
				socket.id,
				producerId,
			)

			if (success) {
				// Notificar o outro participante
				const roomId = videoSessionRepository.getSocketRoom(socket.id)
				const room = roomId
					? videoSessionRepository.findById(roomId)
					: undefined
				const otherSocketId = room?.getOtherSocketId(socket.id)

				if (otherSocketId) {
					const producers = room?.getProducers(socket.id) || []
					const producer = producers.find((p) => p.id === producerId)

					socket.to(otherSocketId).emit('producer-paused', {
						producerId,
						socketId: socket.id,
						kind: producer?.kind,
					})
				}
			}
		})

		// Retomar producer
		socket.on('producer-resume', async ({ producerId }) => {
			const success = await manageMediaStreamsUseCase.resumeProducer(
				socket.id,
				producerId,
			)

			if (success) {
				// Notificar o outro participante
				const roomId = videoSessionRepository.getSocketRoom(socket.id)
				const room = roomId
					? videoSessionRepository.findById(roomId)
					: undefined
				const otherSocketId = room?.getOtherSocketId(socket.id)

				if (otherSocketId) {
					const producers = room?.getProducers(socket.id) || []
					const producer = producers.find((p) => p.id === producerId)

					socket.to(otherSocketId).emit('producer-resumed', {
						producerId,
						socketId: socket.id,
						kind: producer?.kind,
					})
				}
			}
		})

		// Consumir produtor
		socket.on('consume', async ({ rtpCapabilities }, callback) => {
			const result = await manageMediaStreamsUseCase.consumeMedia({
				socketId: socket.id,
				rtpCapabilities,
			})

			callback(result.consumers)
		})

		// Resume do consumer
		socket.on('consumer-resume', async ({ consumerId }) => {
			await manageMediaStreamsUseCase.resumeConsumer(socket.id, consumerId)
		})

		// Encerrar entrevista
		socket.on('end-interview', async (callback) => {
			const result = await endInterviewUseCase.execute({ socketId: socket.id })

			if (!result.success) {
				return callback({ error: result.error })
			}

			// Notificar o outro participante
			const roomId = videoSessionRepository.getSocketRoom(socket.id)
			const room = roomId ? videoSessionRepository.findById(roomId) : undefined
			const otherSocketId = room?.getOtherSocketId(socket.id)

			if (otherSocketId) {
				socket.to(otherSocketId).emit('interview-ended', {
					endedBy: socket.id,
					recordingInfo: result.recordingInfo,
				})
			}

			callback({ success: true, recordingInfo: result.recordingInfo })
		})

		// Evento de desconexão
		socket.on('disconnect', async () => {
			const result = await handleDisconnectUseCase.execute({
				socketId: socket.id,
			})

			// Notificar o outro participante se existir
			if (result.otherSocketId) {
				socket.to(result.otherSocketId).emit('participant-disconnected', {
					socketId: socket.id,
				})
			}
		})

		// Eventos adicionais para debug
		socket.on('error', (error) => {
			console.error('Socket error:', socket.id, error)
		})

		// Enviar confirmação de conexão
		socket.emit('connection-success', {
			socketId: socket.id,
			serverTime: new Date().toISOString(),
		})
	})

	console.log('Namespace /video registrado com sucesso')
}
