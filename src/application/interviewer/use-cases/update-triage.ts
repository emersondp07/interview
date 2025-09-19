import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import type { Triage } from '@/domain/interviewer/entities/triage'
import type { TriagesRepository } from '@/domain/interviewer/repositories/triages-repository'

interface UpdateTriageUseCaseRequest {
	triageId: string
	nurseName?: string
	notes?: string
	vitalSigns?: {
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

type UpdateTriageUseCaseResponse = Either<
	ResourceNotFoundError,
	{ triage: Triage }
>

export class UpdateTriageUseCase {
	constructor(private readonly triagesRepository: TriagesRepository) {}

	async execute({
		triageId,
		nurseName,
		notes,
		vitalSigns,
	}: UpdateTriageUseCaseRequest): Promise<UpdateTriageUseCaseResponse> {
		const triage = await this.triagesRepository.findById(triageId)

		if (!triage) {
			return failed(new ResourceNotFoundError())
		}

		if (nurseName) {
			triage.changeNurseName(nurseName)
		}

		if (notes !== undefined) {
			triage.updateNotes(notes)
		}

		if (vitalSigns) {
			const vitalSignsVO = VitalSigns.create(vitalSigns)
			triage.updateVitalSigns(vitalSignsVO)
		}

		await this.triagesRepository.update(triage)

		return success({
			triage,
		})
	}
}
