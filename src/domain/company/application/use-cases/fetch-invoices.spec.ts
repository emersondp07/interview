import { makeInvoice } from '@/tests/factories/make-invoice'
import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { FetchInvoicesUseCase } from './fetch-invoices'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let sut: FetchInvoicesUseCase

describe('Fetch Invoices', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()
		sut = new FetchInvoicesUseCase(inMemoryInvoicesRepository)
	})

	it('Should be able to fetch invoices', async () => {
		await inMemoryInvoicesRepository.create(makeInvoice())
		await inMemoryInvoicesRepository.create(makeInvoice())
		await inMemoryInvoicesRepository.create(makeInvoice())

		const result = await sut.execute({
			page: 1,
		})

		expect(result.value?.invoices).toHaveLength(3)
	})

	it('Should be able to fetch paginated invoices', async () => {
		for (let i = 1; i <= 22; i++) {
			await inMemoryInvoicesRepository.create(makeInvoice())
		}

		const result = await sut.execute({
			page: 2,
		})

		expect(result.value?.invoices).toHaveLength(10)
	})
})
