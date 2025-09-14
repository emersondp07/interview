import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { makeInvoice } from '@/tests/factories/make-invoice'
import { makeSignature } from '@/tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { PaidInvoiceUseCase } from './paid-invoice'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: PaidInvoiceUseCase

describe('Paid Invoice', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new PaidInvoiceUseCase(
			inMemoryInvoicesRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to mark an invoice as paid', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})
		const signature = makeSignature({
			companyId: company.id,
		})
		const invoice = makeInvoice({
			signatureId: signature.id,
		})

		company.addSignature(signature)

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)
		inMemoryInvoicesRepository.create(invoice)

		const result = await sut.execute({
			customerId: company.stripeCustomerId ?? '',
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.invoice.paymentDate).toBeInstanceOf(Date)
		}
		expect(inMemoryInvoicesRepository.items[0].paymentDate).toBeInstanceOf(Date)
	})

	it('Should not be able to mark an invoice as paid if company does not exist', async () => {
		const result = await sut.execute({
			customerId: faker.string.uuid(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should not be able to mark an invoice as paid if company has no signature', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})

		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			customerId: company.stripeCustomerId ?? '',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should not be able to mark an invoice as paid if invoice does not exist', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})
		const signature = makeSignature({
			companyId: company.id,
		})

		company.addSignature(signature)

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		const result = await sut.execute({
			customerId: company.stripeCustomerId ?? '',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
