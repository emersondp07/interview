import type { IVideoSessionRepository } from '@/domain/video/repositories/video-session-repository'
import type { IRecordingService } from '@/infra/video/interfaces/recording-service'

interface HandleDisconnectRequest {
	socketId: string
}

interface HandleDisconnectResponse {
	roomCleaned: boolean
	otherSocketId?: string
}

export class HandleDisconnectUseCase {
	constructor(
		private readonly videoSessionRepository: IVideoSessionRepository,
		private readonly recordingService: IRecordingService,
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

		const otherSocketId = room.getOtherSocketId(socketId)

		room.clearSocket(socketId)

		this.videoSessionRepository.save(room)

		this.videoSessionRepository.clearSocketRoom(socketId)

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
