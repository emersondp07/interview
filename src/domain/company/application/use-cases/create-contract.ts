import { type Either, failed, success } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import type { ContractsRepository } from '../../../interviewer/application/repositories/contracts-repository'
import { Contract } from '../../enterprise/entities/contract'

interface CreateContractUseCaseRequest {
	title: string
	description: string
	imageId: string
	companyId: string
}

type CreateContractUseCaseResponse = Either<
	NotAllowedError,
	{ contract: Contract }
>

export class CreateContractUseCase {
	constructor(
		private contractsRepository: ContractsRepository,
		private companiesRepository: CompaniesRepository,
	) {}

	async execute({
		title,
		description,
		imageId,
		companyId,
	}: CreateContractUseCaseRequest): Promise<CreateContractUseCaseResponse> {
		const company = await this.companiesRepository.findById(companyId)

		if (!company) {
			return failed(new NotAllowedError())
		}

		const contract = Contract.create({
			title,
			description,
			imageId,
			companyId: company.id,
		})

		await this.contractsRepository.create(contract)

		return success({
			contract,
		})
	}
}
