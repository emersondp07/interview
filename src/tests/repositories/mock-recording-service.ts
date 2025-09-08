import type { InterviewRoom } from '../../domain/video/entities/interview-room'
import type { IRecordingService } from '../../infra/video/interfaces/recording-service'

export class MockRecordingService implements IRecordingService {
	public recordingStartedCalls: InterviewRoom[] = []
	public recordingStoppedCalls: InterviewRoom[] = []

	async startRecording(room: InterviewRoom): Promise<void> {
		this.recordingStartedCalls.push(room)

		if (room.isRecording) {
			console.log(`Gravação já está ativa para a sala: ${room.interviewId}`)
			return
		}

		const recordingPath = `/mock/recordings/interview_${room.interviewId}_${new Date().toISOString()}.mp4`
		room.startRecording(recordingPath)
		console.log(`Mock: Gravação iniciada para sala ${room.interviewId}`)
	}

	async stopRecording(
		room: InterviewRoom,
	): Promise<{
		path?: string
		duration: number
		startTime?: Date
		endTime: Date
	} | null> {
		this.recordingStoppedCalls.push(room)

		if (!room.isRecording) {
			console.log(`Nenhuma gravação ativa para a sala: ${room.interviewId}`)
			return null
		}

		const recordingInfo = room.stopRecording()
		console.log(
			`Mock: Gravação parada para sala ${room.interviewId}. Duração: ${recordingInfo.duration}s`,
		)
		return recordingInfo
	}

	// Helper methods for testing
	clear(): void {
		this.recordingStartedCalls = []
		this.recordingStoppedCalls = []
	}
}
