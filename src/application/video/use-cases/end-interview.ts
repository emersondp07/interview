import type { VideoSessionRepository } from '@/domain/video/repositories/video-session-repository'
import type { RecordingService } from '@/infra/video/recording-service'

interface EndInterviewRequest {
	socketId: string
}

interface EndInterviewResponse {
	success: boolean
	error?: string
	recordingInfo?: {
		path?: string
		duration: number
		startTime?: Date
		endTime: Date
	} | null
}

export class EndInterviewUseCase {
	constructor(
		private videoSessionRepository: VideoSessionRepository,
		private recordingService: RecordingService,
	) {}

	async execute({
		socketId,
	}: EndInterviewRequest): Promise<EndInterviewResponse> {
		const roomId = this.videoSessionRepository.getSocketRoom(socketId)
		if (!roomId) {
			return { success: false, error: 'Socket não está em nenhuma sala' }
		}

		const room = this.videoSessionRepository.findById(roomId)
		if (!room) {
			console.log('Sala não encontrada:', roomId)
			return { success: false, error: 'Sala não encontrada' }
		}

		console.log(
			`Encerrando entrevista ${roomId} por solicitação do socket: ${socketId}`,
		)

		// Parar gravação se estiver ativa
		let recordingInfo = null
		if (room.isRecording) {
			recordingInfo = await this.recordingService.stopRecording(room)
		}

		return { success: true, recordingInfo }
	}
}
