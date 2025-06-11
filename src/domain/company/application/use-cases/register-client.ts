import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import { Client } from '../../../client/enterprise/entities/client'
import type { DOCUMENT_TYPE } from '../../../client/enterprise/entities/interfaces/client.type'
import type { InterviewsRepository } from '../../../interviewer/application/repositories/interviews-repository'
import { STATUS_INTERVIEW } from '../../../interviewer/enterprise/entities/interfaces/interview.type'
import { Interview } from '../../../interviewer/enterprise/entities/interview'
import type { ClientsRepository } from '../repositories/clients-repository'

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
