import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { ResourceNotFoundError } from '../../../../core/errors/errors/resource-not-found-error'
import { makeSignature } from '../../../../tests/factories/make-signature'
import { STATUS_PAYMENT } from '../../enterprise/entities/interfaces/invoice.type'
import { CreateInvoiceUseCase } from './create-invoice'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: CreateInvoiceUseCase

describe('Create Invoice', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new CreateInvoiceUseCase(
			inMemoryInvoicesRepository,
			inMemorySignaturesRepository,
		)
	})

	it('Should be able to create an invoice', async () => {
		const signature = makeSignature()

		inMemorySignaturesRepository.create(signature)

		const result = await sut.execute({
			mounth: 'January',
			value: '100',
			status: STATUS_PAYMENT.OPEN,
			signatureId: signature.id.toString(),
		})

		expect(inMemoryInvoicesRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
		expect(inMemoryInvoicesRepository.items[0].signatureId).toEqual(
			signature.id,
		)
	})

	it('Should not be able to create an invoice if signature is not exist', async () => {
		const signature = makeSignature()

		const result = await sut.execute({
			mounth: 'January',
			value: '100',
			status: STATUS_PAYMENT.OPEN,
			signatureId: signature.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
