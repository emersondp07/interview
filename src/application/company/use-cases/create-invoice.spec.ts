import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInvoicesRepository } from '@/tests/repositories/in-memory-invoices-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'
import { UniqueEntityID } from '../../../domain/core/entities/unique-entity'
import { makeSignature } from '../../../tests/factories/make-signature'
import { InMemorySignaturesRepository } from '../../../tests/repositories/in-memory-signatures-repository'
import { CreateInvoiceUseCase } from './create-invoice'

let inMemoryInvoicesRepository: InMemoryInvoicesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: CreateInvoiceUseCase

describe('Create Invoice', () => {
	beforeEach(() => {
		inMemoryInvoicesRepository = new InMemoryInvoicesRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new CreateInvoiceUseCase(
			inMemoryInvoicesRepository,
			inMemoryCompaniesRepository,
		)
	})

	it('Should be able to create an invoice', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			planId: new UniqueEntityID(company.planId),
			companyId: company.id,
		})

		company.addSignature(signature)

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		const result = await sut.execute({
			mounth: 'January',
			value: '100',
			companyId: company.id.toString(),
			stripeInvoiceId: faker.string.uuid(),
		})

		expect(inMemoryInvoicesRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
	})

	it('Should not be able to create an invoice if signature is not exist', async () => {
		const company = makeCompany()

		const result = await sut.execute({
			mounth: 'January',
			value: '100',
			companyId: company.id.toString(),
			stripeInvoiceId: faker.string.uuid(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
