import { type Either, success } from '@/domain/core/either'
import type { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

interface FetchTriageByAppointmentUseCaseRequest {
	appointmentId: string
}

type FetchTriageByAppointmentUseCaseResponse = Either<
	null,
	{ triage: Triage | null }
>

export class FetchTriageByAppointmentUseCase {
	constructor(private readonly triagesRepository: TriagesRepository) {}

	async execute({
		appointmentId,
	}: FetchTriageByAppointmentUseCaseRequest): Promise<FetchTriageByAppointmentUseCaseResponse> {
		const triage =
			await this.triagesRepository.findByAppointmentId(appointmentId)

		return success({
			triage,
		})
	}
}
