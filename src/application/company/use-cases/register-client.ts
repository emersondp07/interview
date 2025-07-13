import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { Client } from '@/domain/client/entities/client'
import type { DOCUMENT_TYPE } from '@/domain/client/entities/interfaces/client.type'
import type { ClientsRepository } from '@/domain/company/repositories/clients-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { STATUS_INTERVIEW } from '@/domain/interviewer/entities/interfaces/interview.type'
import { Interview } from '@/domain/interviewer/entities/interview'
import type { InterviewsRepository } from '@/domain/interviewer/repositories/interviews-repository'

interface RegisterClientUseCaseRequest {
	name: string
	documentType: DOCUMENT_TYPE
	document: string
	birthDate: Date
	phone: string
	email: string
	companyId: string
}

type RegisterClientUseCaseResponse = Either<
	ResourceNotFoundError,
	{ client: Client }
>

export class RegisterClientUseCase {
	constructor(
		private clientsRepository: ClientsRepository,
		private companiesRepository: CompaniesRepository,
		private interviewsRepository: InterviewsRepository,
	) {}

	async execute({
		name,
		documentType,
		document,
		birthDate,
		phone,
		email,
		companyId,
	}: RegisterClientUseCaseRequest): Promise<RegisterClientUseCaseResponse> {
		const companyExists = await this.companiesRepository.findById(companyId)

		if (!companyExists) {
			return failed(new ResourceNotFoundError())
		}

		const client = Client.create({
			name,
			documentType,
			document,
			birthDate,
			phone,
			email,
			companyId: companyExists.id,
		})

		const interview = Interview.create({
			clientId: client.id,
			companyId: companyExists.id,
			status: STATUS_INTERVIEW.SCHEDULED,
		})

		await this.clientsRepository.create(client)
		await this.interviewsRepository.create(interview)

		return success({
			client,
		})
	}
}
