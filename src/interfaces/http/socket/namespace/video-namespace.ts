import * as mediasoup from 'mediasoup'
import fs from 'node:fs'
import path from 'node:path'
import type { Server, Socket } from 'socket.io'
import { ROLE } from '../../../../domain/administrator/entities/interfaces/adminitrator.type'

let worker: mediasoup.types.Worker
let router: mediasoup.types.Router

// Estrutura para gerenciar salas de entrevista
interface InterviewRoom {
	interviewId: string
	doctorId: string
	patientId: string
	doctorSocketId?: string
	patientSocketId?: string
	producers: Map<string, mediasoup.types.Producer[]> // socketId -> producers
	consumers: Map<string, mediasoup.types.Consumer[]> // socketId -> consumers
	producerTransports: Map<string, mediasoup.types.WebRtcTransport> // socketId -> transport
	consumerTransports: Map<string, mediasoup.types.WebRtcTransport> // socketId -> transport
	isRecording: boolean
	ffmpegProcess?: any
	recordingStartTime?: Date
	recordingPath?: string
}

// Map para gerenciar todas as salas de entrevista
const interviewRooms = new Map<string, InterviewRoom>()

// Map para mapear socketId -> interviewId para lookup rápido
const socketToRoom = new Map<string, string>()

// Criar worker do Mediasoup
const createWorker = async () => {
	worker = await mediasoup.createWorker({
		logLevel: 'warn', // Mudado de debug para warn para reduzir logs
		logTags: ['info', 'ice', 'dtls', 'rtp', 'srtp', 'rtcp'],
		rtcMinPort: 10000,
		rtcMaxPort: 10100,
	})

	worker.on('died', (error) => {
		console.error('Mediasoup worker morreu:', error)
		setTimeout(() => process.exit(1), 2000)
	})

	return worker
}

// Criar transport WebRTC
const createWebRtcTransport = async () => {
	const transport = await router.createWebRtcTransport({
		listenIps: [
			{
				ip: '0.0.0.0',
				announcedIp: process.env.MEDIASOUP_ANNOUNCED_IP || '127.0.0.1',
			},
		],
		enableUdp: true,
		enableTcp: true,
		preferUdp: true,
		initialAvailableOutgoingBitrate: 1000000,
		appData: {},
	})

	transport.on('dtlsstatechange', (dtlsState) => {
		if (dtlsState === 'closed') {
			console.log('Transport DTLS closed')
			transport.close()
		}
	})

	transport.on('@close', () => {
		console.log('Transport fechado')
	})

	return transport
}

// Criar ou obter sala de entrevista
const getOrCreateRoom = (
	interviewId: string,
	patientId: string,
	doctorId: string,
): InterviewRoom => {
	let room = interviewRooms.get(interviewId)

	if (!room) {
		room = {
			interviewId,
			doctorId,
			patientId,
			producers: new Map(),
			consumers: new Map(),
			producerTransports: new Map(),
			consumerTransports: new Map(),
			isRecording: false,
		}

		interviewRooms.set(interviewId, room)
		console.log(`Nova sala de entrevista criada: ${interviewId}`)
	}

	return room
}

// Iniciar gravação da sala
const startRecording = async (room: InterviewRoom) => {
	if (room.isRecording) {
		console.log(`Gravação já está ativa para a sala: ${room.interviewId}`)
		return
	}

	// Criar diretório de gravações se não existir
	const recordingsDir = path.join(process.cwd(), 'recordings')
	if (!fs.existsSync(recordingsDir)) {
		fs.mkdirSync(recordingsDir, { recursive: true })
	}

	const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
	const filename = `interview_${room.interviewId}_${timestamp}.mp4`
	room.recordingPath = path.join(recordingsDir, filename)
	room.recordingStartTime = new Date()

	// Para demonstração, apenas marcar como recording ativo
	// Em produção, você implementaria a gravação real usando FFmpeg ou outra solução
	room.isRecording = true
	console.log(`Gravação marcada como iniciada para sala ${room.interviewId}`)
}

// Parar gravação da sala
const stopRecording = async (room: InterviewRoom) => {
	if (!room.isRecording) {
		console.log(`Nenhuma gravação ativa para a sala: ${room.interviewId}`)
		return null
	}

	const duration = room.recordingStartTime
		? Date.now() - room.recordingStartTime.getTime()
		: 0

	room.isRecording = false
	console.log(
		`Gravação parada para sala ${room.interviewId}. Duração: ${Math.round(duration / 1000)}s`,
	)

	return {
		path: room.recordingPath,
		duration: Math.round(duration / 1000),
		startTime: room.recordingStartTime,
		endTime: new Date(),
	}
}

// Registrar namespace de vídeo
export async function registerVideoNamespace(io: Server) {
	console.log('Iniciando servidor de vídeo...')

	try {
		worker = await createWorker()
		console.log('Worker criado com sucesso')

		router = await worker.createRouter({
			mediaCodecs: [
				{
					kind: 'audio',
					mimeType: 'audio/opus',
					clockRate: 48000,
					channels: 2,
				},
				{
					kind: 'video',
					mimeType: 'video/VP8',
					clockRate: 90000,
					parameters: {
						'x-google-start-bitrate': 1000,
					},
				},
				{
					kind: 'video',
					mimeType: 'video/H264',
					clockRate: 90000,
					parameters: {
						'packetization-mode': 1,
						'profile-level-id': '42e01f',
						'level-asymmetry-allowed': 1,
					},
				},
			],
		})

		console.log('Router criado com sucesso')
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
				try {
					console.log(
						`Tentativa de entrada na sala - ID: ${interviewId}, Role: ${role}, Socket: ${socket.id}`,
					)

					const room = getOrCreateRoom(interviewId, patientId, doctorId)

					// Verificar se o usuário tem permissão para entrar na sala
					const isAuthorized =
						(role === ROLE.INTERVIEWER && doctorId === room.doctorId) ||
						(role === ROLE.CLIENT && patientId === room.patientId)

					if (!isAuthorized) {
						console.log(`Acesso negado para ${role} na sala ${interviewId}`)
						return callback({ error: 'Não autorizado para esta entrevista' })
					}

					// Verificar se o role já está ocupado
					if (
						role === ROLE.INTERVIEWER &&
						room.doctorSocketId &&
						room.doctorSocketId !== socket.id
					) {
						console.log(`Doutor já conectado na sala ${interviewId}`)
						return callback({
							error: 'Doutor já está conectado nesta entrevista',
						})
					}

					if (
						role === ROLE.CLIENT &&
						room.patientSocketId &&
						room.patientSocketId !== socket.id
					) {
						console.log(`Paciente já conectado na sala ${interviewId}`)
						return callback({
							error: 'Paciente já está conectado nesta entrevista',
						})
					}

					// Associar socket à sala
					socketToRoom.set(socket.id, interviewId)
					socket.join(interviewId)

					// Registrar socket na sala baseado no role
					if (role === ROLE.INTERVIEWER) {
						room.doctorSocketId = socket.id
					} else {
						room.patientSocketId = socket.id
					}

					// Inicializar arrays para este socket se não existirem
					if (!room.producers.has(socket.id)) {
						room.producers.set(socket.id, [])
					}
					if (!room.consumers.has(socket.id)) {
						room.consumers.set(socket.id, [])
					}

					console.log(`${role} entrou na sala ${interviewId}: ${socket.id}`)

					// Iniciar gravação automaticamente quando o doutor entrar
					if (role === ROLE.INTERVIEWER && !room.isRecording) {
						await startRecording(room)
					}

					const participantCount =
						(room.doctorSocketId ? 1 : 0) + (room.patientSocketId ? 1 : 0)

					callback({
						success: true,
						socketId: socket.id,
						roomInfo: {
							interviewId: room.interviewId,
							isRecording: room.isRecording,
							participantCount,
						},
					})

					// Notificar o outro participante se já estiver conectado
					const otherSocketId =
						role === ROLE.INTERVIEWER
							? room.patientSocketId
							: room.doctorSocketId
					if (otherSocketId) {
						socket.to(otherSocketId).emit('participant-joined', {
							role,
							socketId: socket.id,
						})
						console.log(`Notificando ${otherSocketId} sobre entrada de ${role}`)
					}
				} catch (error) {
					console.error('Erro ao entrar na sala:', error)
					callback({ error: 'Erro ao entrar na sala de entrevista' })
				}
			},
		)

		// Envia rtpCapabilities do router
		socket.on('getRtpCapabilities', (callback) => {
			console.log('getRtpCapabilities solicitado por:', socket.id)
			const rtpCapabilities = router.rtpCapabilities
			console.log('Enviando rtpCapabilities:', Object.keys(rtpCapabilities))
			callback({ rtpCapabilities })
		})

		// Criação de transport
		socket.on('createWebRtcTransport', async ({ sender }, callback) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) {
				console.log('Socket não está em nenhuma sala:', socket.id)
				return callback({
					params: { error: 'Socket não está em nenhuma sala' },
				})
			}

			const room = interviewRooms.get(roomId)
			if (!room) {
				console.log('Sala não encontrada:', roomId)
				return callback({
					params: { error: 'Sala não encontrada' },
				})
			}

			try {
				console.log(`Criando transport para ${socket.id}, sender: ${sender}`)
				const transport = await createWebRtcTransport()

				if (sender) {
					room.producerTransports.set(socket.id, transport)
					console.log(`Producer transport criado para ${socket.id}`)
				} else {
					room.consumerTransports.set(socket.id, transport)
					console.log(`Consumer transport criado para ${socket.id}`)
				}

				// Adicionar listeners para debug
				transport.on('dtlsstatechange', (dtlsState) => {
					console.log(`Transport ${transport.id} DTLS state: ${dtlsState}`)
				})

				transport.on('icestatechange', (iceState) => {
					console.log(`Transport ${transport.id} ICE state: ${iceState}`)
				})

				callback({
					params: {
						id: transport.id,
						iceParameters: transport.iceParameters,
						iceCandidates: transport.iceCandidates,
						dtlsParameters: transport.dtlsParameters,
					},
				})
			} catch (err) {
				console.error('Erro ao criar transport:', err)
				callback({ params: { error: err } })
			}
		})

		// Conectar transport do producer
		socket.on('transport-connect', async ({ dtlsParameters }) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) {
				console.log(
					'Socket não está em sala para transport-connect:',
					socket.id,
				)
				return
			}

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}
			console.log('Conectando transport producer para:', socket.id)

			const transport = room.producerTransports.get(socket.id)
			if (!transport) {
				console.error('Producer transport não encontrado para:', socket.id)
				return
			}

			try {
				await transport.connect({ dtlsParameters })
				console.log('Producer transport conectado com sucesso para:', socket.id)
			} catch (error) {
				console.error('Erro ao conectar producer transport:', error)
			}
		})

		// Conectar transport do consumer
		socket.on('transport-recv-connect', async ({ dtlsParameters }) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) return

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			console.log('Conectando transport consumer para:', socket.id)

			const transport = room.consumerTransports.get(socket.id)
			if (!transport) {
				console.error('Consumer transport não encontrado para:', socket.id)
				return
			}

			try {
				await transport.connect({ dtlsParameters })
				console.log('Consumer transport conectado com sucesso para:', socket.id)
			} catch (error) {
				console.error('Erro ao conectar consumer transport:', error)
			}
		})

		// Produzir track (audio/video)
		socket.on(
			'transport-produce',
			async ({ kind, rtpParameters }, callback) => {
				const roomId = socketToRoom.get(socket.id)
				if (!roomId) {
					return callback({ error: 'Socket não está em nenhuma sala' })
				}

				const room = interviewRooms.get(roomId)

				if (!room) {
					console.log('Não foi achado sala para esse rromId:', roomId)
					return
				}

				const transport = room.producerTransports.get(socket.id)

				if (!transport) {
					console.error('Producer transport não existe para:', socket.id)
					return callback({ error: 'Producer transport não existe' })
				}

				try {
					console.log(`Criando producer ${kind} para ${socket.id}`)
					const producer = await transport.produce({ kind, rtpParameters })

					// Adicionar producer ao array do socket na sala
					const socketProducers = room.producers.get(socket.id) || []
					socketProducers.push(producer)
					room.producers.set(socket.id, socketProducers)

					console.log(
						`Producer criado: ${producer.id} (${kind}) para socket: ${socket.id} na sala: ${roomId}`,
					)

					// Configurar eventos do producer
					producer.on('transportclose', () => {
						console.log('Producer transport fechado:', producer.id)
						const currentProducers = room.producers.get(socket.id) || []
						const updatedProducers = currentProducers.filter(
							(p) => p.id !== producer.id,
						)
						room.producers.set(socket.id, updatedProducers)
					})

					// Notificar o outro participante se já estiver conectado
					const otherSocketId =
						socket.id === room.doctorSocketId
							? room.patientSocketId
							: room.doctorSocketId

					if (otherSocketId) {
						console.log(
							`Notificando ${otherSocketId} sobre novo producer ${producer.id}`,
						)
						socket.to(otherSocketId).emit('producer-ready', {
							producerId: producer.id,
							socketId: socket.id,
							kind: kind,
						})
					}

					callback({ id: producer.id })
				} catch (error) {
					console.error('Erro ao criar producer:', error)
					callback({ error: error })
				}
			},
		)

		// Pausar producer
		socket.on('producer-pause', async ({ producerId }) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) return

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			console.log(`Pausando producer: ${producerId} para socket: ${socket.id}`)

			const socketProducers = room.producers.get(socket.id) || []
			const producer = socketProducers.find((p) => p.id === producerId)

			if (producer) {
				try {
					await producer.pause()

					// Notificar o outro participante
					const otherSocketId =
						socket.id === room.doctorSocketId
							? room.patientSocketId
							: room.doctorSocketId
					if (otherSocketId) {
						socket.to(otherSocketId).emit('producer-paused', {
							producerId,
							socketId: socket.id,
							kind: producer.kind,
						})
					}

					console.log(`Producer pausado: ${producerId}`)
				} catch (error) {
					console.error('Erro ao pausar producer:', error)
				}
			}
		})

		// Retomar producer
		socket.on('producer-resume', async ({ producerId }) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) return

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			console.log(`Retomando producer: ${producerId} para socket: ${socket.id}`)

			const socketProducers = room.producers.get(socket.id) || []
			const producer = socketProducers.find((p) => p.id === producerId)

			if (producer) {
				try {
					await producer.resume()

					// Notificar o outro participante
					const otherSocketId =
						socket.id === room.doctorSocketId
							? room.patientSocketId
							: room.doctorSocketId
					if (otherSocketId) {
						socket.to(otherSocketId).emit('producer-resumed', {
							producerId,
							socketId: socket.id,
							kind: producer.kind,
						})
					}

					console.log(`Producer retomado: ${producerId}`)
				} catch (error) {
					console.error('Erro ao retomar producer:', error)
				}
			}
		})

		// Consumir produtor
		socket.on('consume', async ({ rtpCapabilities }, callback) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) {
				console.log('Socket não está em sala para consume:', socket.id)
				return callback([])
			}

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			const transport = room.consumerTransports.get(socket.id)

			if (!transport) {
				console.error('Consumer transport não existe para:', socket.id)
				return callback([])
			}

			console.log(`Processando solicitação de consume para ${socket.id}`)

			const consumableProducers: any[] = []

			// Consumir apenas producers do outro participante na sala
			const otherSocketId =
				socket.id === room.doctorSocketId
					? room.patientSocketId
					: room.doctorSocketId

			if (!otherSocketId) {
				console.log('Nenhum outro participante na sala ainda')
				return callback([]) // Nenhum outro participante ainda
			}

			const otherProducers = room.producers.get(otherSocketId) || []
			console.log(
				`Tentando consumir ${otherProducers.length} producers de ${otherSocketId}`,
			)

			for (const producer of otherProducers) {
				console.log(`Verificando producer ${producer.id} (${producer.kind})`)

				if (!router.canConsume({ producerId: producer.id, rtpCapabilities })) {
					console.log(`Não pode consumir producer ${producer.id}`)
					continue
				}

				try {
					const consumer = await transport.consume({
						producerId: producer.id,
						rtpCapabilities,
						paused: true, // Sempre iniciar pausado
					})

					// Adicionar consumer ao array do socket na sala
					const socketConsumers = room.consumers.get(socket.id) || []
					socketConsumers.push(consumer)
					room.consumers.set(socket.id, socketConsumers)

					// Configurar eventos do consumer
					consumer.on('transportclose', () => {
						console.log('Consumer transport fechado:', consumer.id)
						const currentConsumers = room.consumers.get(socket.id) || []
						const updatedConsumers = currentConsumers.filter(
							(c) => c.id !== consumer.id,
						)
						room.consumers.set(socket.id, updatedConsumers)
						consumer.close()
					})

					consumer.on('producerclose', () => {
						console.log('Producer fechado, fechando consumer:', consumer.id)
						const currentConsumers = room.consumers.get(socket.id) || []
						const updatedConsumers = currentConsumers.filter(
							(c) => c.id !== consumer.id,
						)
						room.consumers.set(socket.id, updatedConsumers)
						consumer.close()
					})

					consumableProducers.push({
						params: {
							id: consumer.id,
							producerId: producer.id,
							kind: consumer.kind,
							rtpParameters: consumer.rtpParameters,
						},
					})

					console.log(
						`Consumer criado: ${consumer.id} para producer: ${producer.id} (${producer.kind}) na sala: ${roomId}`,
					)
				} catch (error) {
					console.error(
						`Erro ao criar consumer para producer ${producer.id}:`,
						error,
					)
				}
			}

			console.log(
				`Retornando ${consumableProducers.length} consumers para ${socket.id}`,
			)
			callback(consumableProducers)
		})

		// Resume do consumer
		socket.on('consumer-resume', async ({ consumerId }) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) return

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			const socketConsumers = room.consumers.get(socket.id) || []
			const consumer = socketConsumers.find((c) => c.id === consumerId)

			if (consumer) {
				try {
					await consumer.resume()
					console.log('Consumer resumido:', consumerId)
				} catch (error) {
					console.error('Erro ao resumir consumer:', error)
				}
			} else {
				console.error('Consumer não encontrado:', consumerId)
			}
		})

		// Encerrar entrevista
		socket.on('end-interview', async (callback) => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) return callback({ error: 'Socket não está em nenhuma sala' })

			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			console.log(
				`Encerrando entrevista ${roomId} por solicitação do socket: ${socket.id}`,
			)

			// Parar gravação se estiver ativa
			let recordingInfo = null
			if (room.isRecording) {
				recordingInfo = await stopRecording(room)
			}

			// Notificar o outro participante
			const otherSocketId =
				socket.id === room.doctorSocketId
					? room.patientSocketId
					: room.doctorSocketId
			if (otherSocketId) {
				socket.to(otherSocketId).emit('interview-ended', {
					endedBy: socket.id,
					recordingInfo,
				})
			}

			callback({ success: true, recordingInfo })
		})

		// Evento de desconexão
		socket.on('disconnect', () => {
			const roomId = socketToRoom.get(socket.id)
			if (!roomId) {
				console.log('Socket desconectou sem estar em sala:', socket.id)
				return
			}

			console.log('Cliente desconectou:', socket.id, 'da sala:', roomId)
			const room = interviewRooms.get(roomId)

			if (!room) {
				console.log('Não foi achado sala para esse rromId:', roomId)
				return
			}

			// Fechar todos os producers do socket
			const socketProducers = room.producers.get(socket.id) || []
			socketProducers.forEach((producer) => {
				console.log('Fechando producer:', producer.id)
				producer.close()
			})

			// Fechar todos os consumers do socket
			const socketConsumers = room.consumers.get(socket.id) || []
			socketConsumers.forEach((consumer) => {
				console.log('Fechando consumer:', consumer.id)
				consumer.close()
			})

			// Fechar transports
			const producerTransport = room.producerTransports.get(socket.id)
			if (producerTransport) {
				console.log('Fechando producer transport para:', socket.id)
				producerTransport.close()
			}

			const consumerTransport = room.consumerTransports.get(socket.id)
			if (consumerTransport) {
				console.log('Fechando consumer transport para:', socket.id)
				consumerTransport.close()
			}

			// Limpar referências na sala
			room.producers.delete(socket.id)
			room.consumers.delete(socket.id)
			room.producerTransports.delete(socket.id)
			room.consumerTransports.delete(socket.id)

			// Atualizar referências de socket na sala
			if (room.doctorSocketId === socket.id) {
				room.doctorSocketId = undefined
			}
			if (room.patientSocketId === socket.id) {
				room.patientSocketId = undefined
			}

			// Notificar o outro participante
			const otherSocketId = room.doctorSocketId || room.patientSocketId
			if (otherSocketId) {
				socket.to(otherSocketId).emit('participant-disconnected', {
					socketId: socket.id,
				})
				console.log(
					`Notificado ${otherSocketId} sobre desconexão de ${socket.id}`,
				)
			} else {
				// Se não há mais participantes, parar gravação e limpar sala
				console.log('Limpando sala sem participantes:', roomId)
				if (room.isRecording) {
					stopRecording(room)
				}
				interviewRooms.delete(roomId)
				console.log(`Sala ${roomId} removida - sem participantes`)
			}

			socketToRoom.delete(socket.id)
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
