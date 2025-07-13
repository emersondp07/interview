import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { GetCompanyUseCase } from './get-company'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: GetCompanyUseCase

describe('Get Company', () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()

		sut = new GetCompanyUseCase(inMemoryCompaniesRepository)
	})

	it('Should be able to get a company', async () => {
		const company = makeCompany({
			cnpj: '12.345.678/0001-90',
		})

		await inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			companyId: company.id.toString(),
		})

		expect(result.value?.company).toEqual(company)
		expect(result.value?.company?.id).toEqual(company.id)
	})
})
