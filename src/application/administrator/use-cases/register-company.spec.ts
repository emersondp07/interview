import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import { makePlan } from '@/tests/factories/make-plan'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryPlansRepository } from '@/tests/repositories/in-memory-plans-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { InMemoryStripeCustomersService } from '@/tests/repositories/in-memory-stripe-customers-service'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterCompanyUseCase } from './register-company'

let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryPlansRepository: InMemoryPlansRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let inMemoryStripeCustomersService: InMemoryStripeCustomersService
let sut: RegisterCompanyUseCase

describe('Create Contract', () => {
	beforeEach(() => {
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemoryPlansRepository = new InMemoryPlansRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()
		inMemoryStripeCustomersService = new InMemoryStripeCustomersService()

		sut = new RegisterCompanyUseCase(
			inMemoryCompaniesRepository,
			inMemoryPlansRepository,
			inMemorySignaturesRepository,
			inMemoryStripeCustomersService,
		)
	})

	it('Should be able to register a company', async () => {
		const plan = makePlan()

		inMemoryPlansRepository.create(plan)

		const result = await sut.execute({
			corporateReason: faker.person.fullName(),
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
			planId: plan.id.toString(),
		})

		expect(inMemoryCompaniesRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
	})

	it('Should not be able to register company if plan is not exist', async () => {
		const plan = makePlan()

		const result = await sut.execute({
			corporateReason: faker.person.fullName(),
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
			planId: plan.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
