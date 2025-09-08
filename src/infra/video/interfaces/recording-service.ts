import type { InterviewRoom } from '@/domain/video/entities/interview-room'
import type { RecordingInfo } from '../recording-service'

export interface IRecordingService {
	startRecording(room: InterviewRoom): Promise<void>
	stopRecording(room: InterviewRoom): Promise<RecordingInfo | null>
}
