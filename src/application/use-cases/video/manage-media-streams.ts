import type * as mediasoup from 'mediasoup'
import type { VideoSessionRepository } from '../../../domain/video/repositories/video-session-repository'
import { MediaSoupService } from '../../../infra/video/mediasoup-service'

interface CreateTransportRequest {
	socketId: string
	sender: boolean
}

interface CreateTransportResponse {
	success: boolean
	error?: string
	params?: {
		id: string
		iceParameters: mediasoup.types.IceParameters
		iceCandidates: mediasoup.types.IceCandidate[]
		dtlsParameters: mediasoup.types.DtlsParameters
	}
}

interface ProduceMediaRequest {
	socketId: string
	kind: mediasoup.types.MediaKind
	rtpParameters: mediasoup.types.RtpParameters
}

interface ProduceMediaResponse {
	success: boolean
	error?: string
	producerId?: string
}

interface ConsumeMediaRequest {
	socketId: string
	rtpCapabilities: mediasoup.types.RtpCapabilities
}

interface ConsumeMediaResponse {
	consumers: Array<{
		params: {
			id: string
			producerId: string
			kind: mediasoup.types.MediaKind
			rtpParameters: mediasoup.types.RtpParameters
		}
	}>
}

export class ManageMediaStreamsUseCase {
	constructor(
		private videoSessionRepository: VideoSessionRepository,
		private mediaSoupService: MediaSoupService,
	) {}

	async createWebRtcTransport({ socketId, sender }: CreateTransportRequest): Promise<CreateTransportResponse> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			console.log('Socket não está em nenhuma sala:', socketId)
			return { success: false, error: 'Socket não está em nenhuma sala' }
		}

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return { success: false, error: 'Sala não encontrada' }
		}

		try {
			console.log(`Criando transport para ${socketId}, sender: ${sender}`)
			const transport = await this.mediaSoupService.createWebRtcTransport()

			if (sender) {
				room.setProducerTransport(socketId, transport)
				console.log(`Producer transport criado para ${socketId}`)
			} else {
				room.setConsumerTransport(socketId, transport)
				console.log(`Consumer transport criado para ${socketId}`)
			}

			// Adicionar listeners para debug
			transport.on('dtlsstatechange', (dtlsState) => {
				console.log(`Transport ${transport.id} DTLS state: ${dtlsState}`)
			})

			transport.on('icestatechange', (iceState) => {
				console.log(`Transport ${transport.id} ICE state: ${iceState}`)
			})

			this.videoSessionRepository.save(room)

			return {
				success: true,
				params: {
					id: transport.id,
					iceParameters: transport.iceParameters,
					iceCandidates: transport.iceCandidates,
					dtlsParameters: transport.dtlsParameters,
				},
			}
		} catch (err) {
			console.error('Erro ao criar transport:', err)
			return { success: false, error: 'Erro ao criar transport' }
		}
	}

	async connectProducerTransport(socketId: string, dtlsParameters: mediasoup.types.DtlsParameters): Promise<boolean> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			console.log('Socket não está em sala para transport-connect:', socketId)
			return false
		}

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return false
		}

		console.log('Conectando transport producer para:', socketId)

		const transport = room.getProducerTransport(socketId)
		if (!transport) {
			console.error('Producer transport não encontrado para:', socketId)
			return false
		}

		try {
			await transport.connect({ dtlsParameters })
			console.log('Producer transport conectado com sucesso para:', socketId)
			return true
		} catch (error) {
			console.error('Erro ao conectar producer transport:', error)
			return false
		}
	}

	async connectConsumerTransport(socketId: string, dtlsParameters: mediasoup.types.DtlsParameters): Promise<boolean> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) return false

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return false
		}

		console.log('Conectando transport consumer para:', socketId)

		const transport = room.getConsumerTransport(socketId)
		if (!transport) {
			console.error('Consumer transport não encontrado para:', socketId)
			return false
		}

		try {
			await transport.connect({ dtlsParameters })
			console.log('Consumer transport conectado com sucesso para:', socketId)
			return true
		} catch (error) {
			console.error('Erro ao conectar consumer transport:', error)
			return false
		}
	}

	async produceMedia({ socketId, kind, rtpParameters }: ProduceMediaRequest): Promise<ProduceMediaResponse> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			return { success: false, error: 'Socket não está em nenhuma sala' }
		}

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return { success: false, error: 'Sala não encontrada' }
		}

		const transport = room.getProducerTransport(socketId)
		if (!transport) {
			console.error('Producer transport não existe para:', socketId)
			return { success: false, error: 'Producer transport não existe' }
		}

		try {
			console.log(`Criando producer ${kind} para ${socketId}`)
			const producer = await transport.produce({ kind, rtpParameters })

			room.addProducer(socketId, producer)

			console.log(
				`Producer criado: ${producer.id} (${kind}) para socket: ${socketId} na sala: ${roomId}`,
			)

			// Configurar eventos do producer
			producer.on('transportclose', () => {
				console.log('Producer transport fechado:', producer.id)
				room.removeProducer(socketId, producer.id)
			})

			this.videoSessionRepository.save(room)

			return { success: true, producerId: producer.id }
		} catch (error) {
			console.error('Erro ao criar producer:', error)
			return { success: false, error: 'Erro ao criar producer' }
		}
	}

	async consumeMedia({ socketId, rtpCapabilities }: ConsumeMediaRequest): Promise<ConsumeMediaResponse> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			console.log('Socket não está em sala para consume:', socketId)
			return { consumers: [] }
		}

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return { consumers: [] }
		}

		const transport = room.getConsumerTransport(socketId)
		if (!transport) {
			console.error('Consumer transport não existe para:', socketId)
			return { consumers: [] }
		}

		console.log(`Processando solicitação de consume para ${socketId}`)

		const consumableProducers: any[] = []

		// Consumir apenas producers do outro participante na sala
		const otherSocketId = room.getOtherSocketId(socketId)

		if (!otherSocketId) {
			console.log('Nenhum outro participante na sala ainda')
			return { consumers: [] }
		}

		const otherProducers = room.getProducers(otherSocketId)
		console.log(`Tentando consumir ${otherProducers.length} producers de ${otherSocketId}`)

		for (const producer of otherProducers) {
			console.log(`Verificando producer ${producer.id} (${producer.kind})`)

			if (!this.mediaSoupService.canConsume(producer.id, rtpCapabilities)) {
				console.log(`Não pode consumir producer ${producer.id}`)
				continue
			}

			try {
				const consumer = await transport.consume({
					producerId: producer.id,
					rtpCapabilities,
					paused: true, // Sempre iniciar pausado
				})

				room.addConsumer(socketId, consumer)

				// Configurar eventos do consumer
				consumer.on('transportclose', () => {
					console.log('Consumer transport fechado:', consumer.id)
					room.removeConsumer(socketId, consumer.id)
					consumer.close()
				})

				consumer.on('producerclose', () => {
					console.log('Producer fechado, fechando consumer:', consumer.id)
					room.removeConsumer(socketId, consumer.id)
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
				console.error(`Erro ao criar consumer para producer ${producer.id}:`, error)
			}
		}

		this.videoSessionRepository.save(room)

		console.log(`Retornando ${consumableProducers.length} consumers para ${socketId}`)
		return { consumers: consumableProducers }
	}

	async resumeConsumer(socketId: string, consumerId: string): Promise<boolean> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) return false

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return false
		}

		const consumers = room.getConsumers(socketId)
		const consumer = consumers.find(c => c.id === consumerId)

		if (consumer) {
			try {
				await consumer.resume()
				console.log('Consumer resumido:', consumerId)
				return true
			} catch (error) {
				console.error('Erro ao resumir consumer:', error)
				return false
			}
		} else {
			console.error('Consumer não encontrado:', consumerId)
			return false
		}
	}

	async pauseProducer(socketId: string, producerId: string): Promise<boolean> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) return false

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return false
		}

		console.log(`Pausando producer: ${producerId} para socket: ${socketId}`)

		const producers = room.getProducers(socketId)
		const producer = producers.find(p => p.id === producerId)

		if (producer) {
			try {
				await producer.pause()
				console.log(`Producer pausado: ${producerId}`)
				return true
			} catch (error) {
				console.error('Erro ao pausar producer:', error)
				return false
			}
		}

		return false
	}

	async resumeProducer(socketId: string, producerId: string): Promise<boolean> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) return false

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return false
		}

		console.log(`Retomando producer: ${producerId} para socket: ${socketId}`)

		const producers = room.getProducers(socketId)
		const producer = producers.find(p => p.id === producerId)

		if (producer) {
			try {
				await producer.resume()
				console.log(`Producer retomado: ${producerId}`)
				return true
			} catch (error) {
				console.error('Erro ao retomar producer:', error)
				return false
			}
		}

		return false
	}
}