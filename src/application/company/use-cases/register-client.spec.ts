import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { DOCUMENT_TYPE } from '@/domain/client/entities/interfaces/client.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { RegisterClientUseCase } from './register-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let sut: RegisterClientUseCase

describe('Register Client', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		sut = new RegisterClientUseCase(
			inMemoryClientsRepository,
			inMemoryCompaniesRepository,
			inMemoryInterviewsRepository,
		)
	})

	it('Should be able to register a client', async () => {
		const company = makeCompany()

		inMemoryCompaniesRepository.create(company)

		const result = await sut.execute({
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
		})

		expect(inMemoryClientsRepository.items).toHaveLength(1)
		expect(result.isSuccess()).toBe(true)
	})

	it('Should not be able to register client from another company', async () => {
		const company = makeCompany()

		const result = await sut.execute({
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			companyId: company.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
