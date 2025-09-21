import { type Either, success } from '@/domain/core/either'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

interface CreateTriageUseCaseRequest {
	clientId: string
	nurseName: string
	notes?: string
	vitalSigns: {
		systolicBP: number
		diastolicBP: number
		heartRate: number
		temperature: number
		respiratoryRate: number
		oxygenSaturation: number
		weight?: number
		height?: number
	}
}

type CreateTriageUseCaseResponse = Either<null, { triage: Triage }>

export class CreateTriageUseCase {
	constructor(private readonly triagesRepository: TriagesRepository) {}

	async execute({
		clientId,
		nurseName,
		notes,
		vitalSigns,
	}: CreateTriageUseCaseRequest): Promise<CreateTriageUseCaseResponse> {
		const clientEntityId = new UniqueEntityID(clientId)

		const vitalSignsVO = VitalSigns.create(vitalSigns)

		const triage = Triage.create({
			clientId: clientEntityId,
			nurseName,
			notes,
			vitalSigns: vitalSignsVO,
		})

		await this.triagesRepository.create(triage)

		return success({
			triage,
		})
	}
}
