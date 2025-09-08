import type { InterviewRoom } from '../entities/interview-room'

export interface IVideoSessionRepository {
	create(
		interviewId: string,
		patientId: string,
		doctorId: string,
	): InterviewRoom
	findById(interviewId: string): InterviewRoom | undefined
	save(room: InterviewRoom): void
	delete(interviewId: string): void
	getSocketRoom(socketId: string): string | undefined
	setSocketRoom(socketId: string, interviewId: string): void
	clearSocketRoom(socketId: string): void
}
