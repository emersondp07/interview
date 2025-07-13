import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryContractsRepository } from '@/tests/repositories/in-memory-contract-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateContractUseCase } from './create-contract'

let inMemoryContractsRepository: InMemoryContractsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: CreateContractUseCase

describe('Create Contract', () => {
	beforeEach(() => {
		inMemoryContractsRepository = new InMemoryContractsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

		sut = new CreateContractUseCase(
			inMemoryContractsRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to create contract', async () => {
		const company = makeCompany()

		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			title: 'Example Contract',
			description: 'Example description',
			imageUrl: 'url de imagem salva',
			companyId: company.id.toString(),
		})

		expect(inMemoryContractsRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
	})

	it('Should not be able to create contract', async () => {
		const company = makeCompany()

		const result = await sut.execute({
			title: 'Example Contract',
			description: 'Example description',
			imageUrl: 'url de imagem salva',
			companyId: company.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
