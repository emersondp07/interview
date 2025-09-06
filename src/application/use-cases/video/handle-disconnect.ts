import type { VideoSessionRepository } from '@/domain/video/repositories/video-session-repository'
import type { RecordingService } from '@/infra/video/recording-service'

interface HandleDisconnectRequest {
	socketId: string
}

interface HandleDisconnectResponse {
	roomCleaned: boolean
	otherSocketId?: string
}

export class HandleDisconnectUseCase {
	constructor(
		private videoSessionRepository: VideoSessionRepository,
		private recordingService: RecordingService,
	) {}

	async execute({
		socketId,
	}: HandleDisconnectRequest): Promise<HandleDisconnectResponse> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			console.log('Socket desconectou sem estar em sala:', socketId)
			return { roomCleaned: false }
		}

		console.log('Cliente desconectou:', socketId, 'da sala:', roomId)
		const room = this.videoSessionRepository.findById(roomId)

		if (!room) {
			console.log('Sala não encontrada:', roomId)
			this.videoSessionRepository.clearSocketRoom(socketId)
			return { roomCleaned: false }
		}

		// Obter o outro participante antes de limpar
		const otherSocketId = room.getOtherSocketId(socketId)

		// Limpar todos os recursos do socket que desconectou
		room.clearSocket(socketId)

		// Salvar alterações na sala
		this.videoSessionRepository.save(room)

		// Limpar mapeamento socket -> sala
		this.videoSessionRepository.clearSocketRoom(socketId)

		// Se não há mais participantes, parar gravação e limpar sala
		if (room.hasNoParticipants()) {
			console.log('Limpando sala sem participantes:', roomId)
			if (room.isRecording) {
				await this.recordingService.stopRecording(room)
			}
			this.videoSessionRepository.delete(roomId)
			console.log(`Sala ${roomId} removida - sem participantes`)
			return { roomCleaned: true }
		}

		console.log(`Notificado ${otherSocketId} sobre desconexão de ${socketId}`)

		return { roomCleaned: false, otherSocketId }
	}
}
