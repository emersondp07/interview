import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import { Contract } from '@/domain/company/entities/contract'
import { type Either, failed, success } from '@/domain/core/either'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import type { ContractsRepository } from '@/domain/interviewer/repositories/contracts-repository'

interface CreateContractUseCaseRequest {
	title: string
	description: string
	imageUrl: string
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
		imageUrl,
		companyId,
	}: CreateContractUseCaseRequest): Promise<CreateContractUseCaseResponse> {
		const company = await this.companiesRepository.findById(companyId)

		if (!company) {
			return failed(new NotAllowedError())
		}

		const contract = Contract.create({
			title,
			description,
			imageUrl,
			companyId: company.id,
		})

		await this.contractsRepository.create(contract)

		return success({
			contract,
		})
	}
}
