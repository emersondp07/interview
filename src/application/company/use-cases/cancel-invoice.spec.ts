import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInvoice } from '@/tests/factories/make-invoice'
import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { CancelInvoiceUseCase } from './cancel-invoice'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let sut: CancelInvoiceUseCase

describe('Cancel Invoice', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()

		sut = new CancelInvoiceUseCase(inMemoryInvoicesRepository)
	})

	// it('Should be able to cancel invoice', async () => {
	// 	const invoice = makeInvoice()

	// 	await inMemoryInvoicesRepository.create(invoice)

	// 	await sut.execute({
	// 		invoiceId: invoice.id.toString(),
	// 		signatureId: invoice.signatureId.toString(),
	// 	})

	// 	expect(inMemoryInvoicesRepository.items).toHaveLength(0)
	// })

	it('Should not be able to cancel a invoice if is not exist', async () => {
		const invoice = makeInvoice(
			{
				signatureId: new UniqueEntityID('signature-1'),
			},
			new UniqueEntityID('invoice-1'),
		)

		await inMemoryInvoicesRepository.create(invoice)

		const result = await sut.execute({
			invoiceId: 'invoice-2',
			signatureId: 'signature-1',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	// it('Should not be able to cancel a invoice from another signature', async () => {
	// 	const invoice = makeInvoice(
	// 		{
	// 			signatureId: new UniqueEntityID('signature-1'),
	// 		},
	// 		new UniqueEntityID('invoice-1'),
	// 	)

	// 	await inMemoryInvoicesRepository.create(invoice)

	// 	const result = await sut.execute({
	// 		invoiceId: 'invoice-1',
	// 		signatureId: 'signature-2',
	// 	})

	// 	expect(result.isFailed()).toBe(true)
	// 	expect(result.value).toBeInstanceOf(NotAllowedError)
	// })
})
