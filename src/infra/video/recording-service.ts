import fs from 'node:fs'
import path from 'node:path'
import type { InterviewRoom } from '../../domain/video/entities/interview-room'
import type { IRecordingService } from './interfaces/recording-service'

export type RecordingInfo = {
	duration: number
	startTime?: Date
	endTime: Date
	path?: string
}

export class RecordingService implements IRecordingService {
	private static instance: RecordingService

	private constructor() {}

	static getInstance(): RecordingService {
		if (!RecordingService.instance) {
			RecordingService.instance = new RecordingService()
		}
		return RecordingService.instance
	}

	async startRecording(room: InterviewRoom): Promise<void> {
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
		const recordingPath = path.join(recordingsDir, filename)

		room.startRecording(recordingPath)

		// Para demonstração, apenas marcar como recording ativo
		// Em produção, você implementaria a gravação real usando FFmpeg ou outra solução
		console.log(`Gravação iniciada para sala ${room.interviewId}`)
	}

	async stopRecording(room: InterviewRoom): Promise<{
		path?: string
		duration: number
		startTime?: Date
		endTime: Date
	} | null> {
		if (!room.isRecording) {
			console.log(`Nenhuma gravação ativa para a sala: ${room.interviewId}`)
			return null
		}

		const recordingInfo = room.stopRecording()

		console.log(
			`Gravação parada para sala ${room.interviewId}. Duração: ${recordingInfo.duration}s`,
		)

		return recordingInfo
	}
}
