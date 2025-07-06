import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { FetchCompaniesUseCase } from './fetch-companies'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let sut: FetchCompaniesUseCase

describe('Fetch Companies', () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		sut = new FetchCompaniesUseCase(inMemoryCompaniesRepository)
	})

	it('Should be able to fetch companies', async () => {
		await inMemoryCompaniesRepository.create(makeCompany())
		await inMemoryCompaniesRepository.create(makeCompany())
		await inMemoryCompaniesRepository.create(makeCompany())

		const result = await sut.execute({
			page: 1,
		})

		expect(result.value?.companies).toHaveLength(3)
	})

	it('Should be able to fetch paginated companies', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryCompaniesRepository.create(makeCompany())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.value?.companies).toHaveLength(10)
	})
})
