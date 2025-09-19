import type { InterviewRoomProps } from '@/domain/video/entities/interview-room'
import { InterviewRoom } from '@/domain/video/entities/interview-room'
import { faker } from '@faker-js/faker'

export function makeInterviewRoom(
	override?: Partial<InterviewRoomProps>,
): InterviewRoom {
	const interviewId = faker.string.uuid()
	const patientId = faker.string.uuid()
	const doctorId = faker.string.uuid()

	if (override) {
		const room = new InterviewRoom({
			interviewId: override.interviewId || interviewId,
			doctorId: override.doctorId || doctorId,
			patientId: override.patientId || patientId,
			producers: override.producers || new Map(),
			consumers: override.consumers || new Map(),
			producerTransports: override.producerTransports || new Map(),
			consumerTransports: override.consumerTransports || new Map(),
			isRecording: override.isRecording || false,
			doctorSocketId: override.doctorSocketId,
			patientSocketId: override.patientSocketId,
			ffmpegProcess: override.ffmpegProcess,
			recordingStartTime: override.recordingStartTime,
			recordingPath: override.recordingPath,
		})
		return room
	}

	return InterviewRoom.create(interviewId, patientId, doctorId)
}
