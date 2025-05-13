import { type Either, failed, success } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import { Client } from '../../../client/enterprise/entities/client'
import type { DOCUMENT_TYPE } from '../../../client/enterprise/entities/interfaces/client.type'
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

		await this.clientsRepository.create(client)

		return success({
			client,
		})
	}
}
