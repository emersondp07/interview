import { STATUS_SIGNATURE } from '@/domain/company/entities/interfaces/signature.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { makeSignature } from '@/tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryResendEmailsService } from '@/tests/repositories/in-memory-resend-emails-service'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { ActiveSignatureUseCase } from './active-signature'

let inMemorySignaturesRepository: InMemorySignaturesRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryResendEmailsService: InMemoryResendEmailsService
let sut: ActiveSignatureUseCase

describe('Active Signature', () => {
	beforeEach(() => {
		inMemorySignaturesRepository = new InMemorySignaturesRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemoryResendEmailsService = new InMemoryResendEmailsService()

		sut = new ActiveSignatureUseCase(
			inMemorySignaturesRepository,
			inMemoryCompaniesRepository,
			inMemoryResendEmailsService,
		)
	})

	it('Should be able to activate a signature', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})
		const signature = makeSignature({
			companyId: company.id,
		})

		company.addSignature(signature)

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		const subscriptionId = faker.string.uuid()
		const stripeSubscriptionStatus = 'active'

		const result = await sut.execute({
			companyId: company.stripeCustomerId ?? '',
			subscriptionId,
			stripeSubscriptionStatus,
		})

		expect(result.isSuccess()).toBe(true)
		if (result.isSuccess()) {
			expect(result.value.signature.stripeSubscriptionId).toBe(subscriptionId)
			expect(result.value.signature.status).toBe(STATUS_SIGNATURE.ACTIVE)
		}
		expect(inMemoryResendEmailsService.items).toHaveLength(1)
	})

	it('Should not be able to activate a signature if company does not exist', async () => {
		const result = await sut.execute({
			companyId: faker.string.uuid(),
			subscriptionId: faker.string.uuid(),
			stripeSubscriptionStatus: 'active',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should not be able to activate a signature if company has no signature', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})

		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			companyId: company.stripeCustomerId ?? '',
			subscriptionId: faker.string.uuid(),
			stripeSubscriptionStatus: 'active',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should not be able to activate a signature if signature does not exist in repository', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
		})
		const signature = makeSignature({
			companyId: company.id,
		})

		company.addSignature(signature)
		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			companyId: company.stripeCustomerId ?? '',
			subscriptionId: faker.string.uuid(),
			stripeSubscriptionStatus: 'active',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})

	it('Should send email notification when signature is activated', async () => {
		const company = makeCompany({
			stripeCustomerId: faker.string.uuid(),
			email: 'test@example.com',
			corporateReason: 'Test Company',
		})
		const signature = makeSignature({
			companyId: company.id,
		})

		company.addSignature(signature)

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		await sut.execute({
			companyId: company.stripeCustomerId ?? '',
			subscriptionId: faker.string.uuid(),
			stripeSubscriptionStatus: 'active',
		})

		expect(inMemoryResendEmailsService.items).toHaveLength(1)
	})
})
