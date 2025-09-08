import { ROLE } from '@/domain/administrator/entities/interfaces/adminitrator.type'
import type { InterviewRoom } from '@/domain/video/entities/interview-room'
import type { IVideoSessionRepository } from '@/domain/video/repositories/video-session-repository'
import type { IRecordingService } from '@/infra/video/interfaces/recording-service'

interface JoinInterviewRoomRequest {
	interviewId: string
	patientId: string
	doctorId: string
	role: ROLE
	socketId: string
}

interface JoinInterviewRoomResponse {
	success: boolean
	error?: string
	room?: InterviewRoom
	socketId?: string
	roomInfo?: {
		interviewId: string
		isRecording: boolean
		participantCount: number
	}
}

export class JoinInterviewRoomUseCase {
	constructor(
		private readonly videoSessionRepository: IVideoSessionRepository,
		private readonly recordingService: IRecordingService,
	) {}

	async execute({
		interviewId,
		patientId,
		doctorId,
		role,
		socketId,
	}: JoinInterviewRoomRequest): Promise<JoinInterviewRoomResponse> {
		try {
			console.log(
				`Tentativa de entrada na sala - ID: ${interviewId}, Role: ${role}, Socket: ${socketId}`,
			)

			// Buscar ou criar sala
			let room = this.videoSessionRepository.findById(interviewId)
			if (!room) {
				room = this.videoSessionRepository.create(
					interviewId,
					patientId,
					doctorId,
				)
			}

			// Verificar se o usuário tem permissão para entrar na sala
			const isAuthorized =
				(role === ROLE.INTERVIEWER && doctorId === room.doctorId) ||
				(role === ROLE.CLIENT && patientId === room.patientId)

			if (!isAuthorized) {
				console.log(`Acesso negado para ${role} na sala ${interviewId}`)
				return { success: false, error: 'Não autorizado para esta entrevista' }
			}

			// Verificar se o role já está ocupado
			if (
				role === ROLE.INTERVIEWER &&
				room.doctorSocketId &&
				room.doctorSocketId !== socketId
			) {
				console.log(`Doutor já conectado na sala ${interviewId}`)
				return {
					success: false,
					error: 'Doutor já está conectado nesta entrevista',
				}
			}

			if (
				role === ROLE.CLIENT &&
				room.patientSocketId &&
				room.patientSocketId !== socketId
			) {
				console.log(`Paciente já conectado na sala ${interviewId}`)
				return {
					success: false,
					error: 'Paciente já está conectado nesta entrevista',
				}
			}

			// Associar socket à sala
			this.videoSessionRepository.setSocketRoom(socketId, interviewId)

			// Registrar socket na sala baseado no role
			if (role === ROLE.INTERVIEWER) {
				room.setDoctorSocket(socketId)
			} else {
				room.setPatientSocket(socketId)
			}

			// Salvar alterações
			this.videoSessionRepository.save(room)

			console.log(`${role} entrou na sala ${interviewId}: ${socketId}`)

			// Iniciar gravação automaticamente quando o doutor entrar
			if (role === ROLE.INTERVIEWER && !room.isRecording) {
				await this.recordingService.startRecording(room)
			}

			const participantCount = room.getParticipantCount()

			return {
				success: true,
				room,
				socketId,
				roomInfo: {
					interviewId: room.interviewId,
					isRecording: room.isRecording,
					participantCount,
				},
			}
		} catch (error) {
			console.error('Erro ao entrar na sala:', error)
			return { success: false, error: 'Erro ao entrar na sala de entrevista' }
		}
	}
}
