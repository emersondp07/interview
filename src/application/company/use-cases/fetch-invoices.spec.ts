import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { makeInvoice } from '@/tests/factories/make-invoice'
import { makeSignature } from '@/tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { faker } from '@faker-js/faker'
import { FetchInvoicesUseCase } from './fetch-invoices'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: FetchInvoicesUseCase

describe('Fetch Invoices', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()
		sut = new FetchInvoicesUseCase(
			inMemoryInvoicesRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to fetch invoices', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		await inMemoryInvoicesRepository.create(
			makeInvoice({
				signatureId: signature.id,
			}),
		)
		await inMemoryInvoicesRepository.create(
			makeInvoice({
				signatureId: signature.id,
			}),
		)
		await inMemoryInvoicesRepository.create(
			makeInvoice({
				signatureId: signature.id,
			}),
		)

		const result = await sut.execute({
			page: 1,
			companyId: company.id.toString(),
		})

		if (result.isSuccess()) {
			expect(result.isSuccess()).toBe(true)
			expect(result.value?.invoices).toHaveLength(3)
		}
	})

	it('Should be able to fetch paginated invoices', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)
		for (let i = 1; i <= 22; i++) {
			await inMemoryInvoicesRepository.create(
				makeInvoice({
					signatureId: signature.id,
				}),
			)
		}

		const result = await sut.execute({
			page: 2,
			companyId: company.id.toString(),
		})

		if (result.isSuccess()) {
			expect(result.value?.invoices).toHaveLength(10)
		}
	})

	it('Should not be able to fetch invoices from non-existing company', async () => {
		const result = await sut.execute({
			page: 1,
			companyId: faker.string.uuid(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
