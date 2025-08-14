import { makeClient } from '@/tests/factories/make-client'
import { makeCompany } from '@/tests/factories/make-company'
import { makeSignature } from '@/tests/factories/make-signature'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { FetchClientsUseCase } from './fetch-clients'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: FetchClientsUseCase

describe('Fetch Interviewers', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new FetchClientsUseCase(inMemoryClientsRepository)
	})

	it('Should be able to fetch clients', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		await inMemoryClientsRepository.create(
			makeClient({
				companyId: company.id,
			}),
		)
		await inMemoryClientsRepository.create(
			makeClient({
				companyId: company.id,
			}),
		)
		await inMemoryClientsRepository.create(
			makeClient({
				companyId: company.id,
			}),
		)

		const result = await sut.execute({
			companyId: company.id.toString(),
			page: 1,
		})

		expect(result.value?.clients).toHaveLength(3)
	})

	it('Should be able to fetch paginated interviewers', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)
		for (let i = 1; i <= 22; i++) {
			await inMemoryClientsRepository.create(
				makeClient({
					companyId: company.id,
				}),
			)
		}

		const result = await sut.execute({
			companyId: company.id.toString(),
			page: 2,
		})

		expect(result.value?.clients).toHaveLength(10)
	})
})
