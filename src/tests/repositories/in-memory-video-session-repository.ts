import { InterviewRoom } from '../../domain/video/entities/interview-room'
import type { VideoSessionRepository } from '../../domain/video/repositories/video-session-repository'

export class InMemoryVideoSessionRepository implements VideoSessionRepository {
	private rooms = new Map<string, InterviewRoom>()
	private socketToRoom = new Map<string, string>()

	create(interviewId: string, patientId: string, doctorId: string): InterviewRoom {
		const room = InterviewRoom.create(interviewId, patientId, doctorId)
		this.rooms.set(interviewId, room)
		return room
	}

	findById(interviewId: string): InterviewRoom | undefined {
		return this.rooms.get(interviewId)
	}

	save(room: InterviewRoom): void {
		this.rooms.set(room.interviewId, room)
	}

	delete(interviewId: string): void {
		this.rooms.delete(interviewId)
	}

	getSocketRoom(socketId: string): string | undefined {
		return this.socketToRoom.get(socketId)
	}

	setSocketRoom(socketId: string, interviewId: string): void {
		this.socketToRoom.set(socketId, interviewId)
	}

	clearSocketRoom(socketId: string): void {
		this.socketToRoom.delete(socketId)
	}

	// Helper methods for testing
	clear(): void {
		this.rooms.clear()
		this.socketToRoom.clear()
	}

	getRooms(): Map<string, InterviewRoom> {
		return new Map(this.rooms)
	}

	getSocketMappings(): Map<string, string> {
		return new Map(this.socketToRoom)
	}
}