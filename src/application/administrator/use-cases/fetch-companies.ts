import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Company } from '@/domain/company/entities/company'
import { type Either, success } from '@/domain/core/either'

interface FetchCompaniesUseCaseRequest {
	page: number
}

type FetchCompaniesUseCaseResponse = Either<
	null,
	{ companies: Company[] | null }
>

export class FetchCompaniesUseCase {
	constructor(private companiesRepository: CompaniesRepository) {}

	async execute({
		page,
	}: FetchCompaniesUseCaseRequest): Promise<FetchCompaniesUseCaseResponse> {
		const companies = await this.companiesRepository.findAll({ page })

		return success({ companies })
	}
}
