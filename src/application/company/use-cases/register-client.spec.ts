import {
	DOCUMENT_TYPE,
	GENDER,
} from '@/domain/client/entities/interfaces/client.type'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeCompany } from '@/tests/factories/make-company'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInterviewsRepository } from '@/tests/repositories/in-memory-interviews-repository'
import { InMemoryResendEmailsService } from '@/tests/repositories/in-memory-resend-emails-service'
import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'
import { RegisterClientUseCase } from './register-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemoryInterviewsRepository: InMemoryInterviewsRepository
let inMemoryResendEmailsService: InMemoryResendEmailsService
let sut: RegisterClientUseCase

describe('Register Client', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemoryInterviewsRepository = new InMemoryInterviewsRepository()
		inMemoryResendEmailsService = new InMemoryResendEmailsService()

		sut = new RegisterClientUseCase(
			inMemoryClientsRepository,
			inMemoryCompaniesRepository,
			inMemoryInterviewsRepository,
			inMemoryResendEmailsService,
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
			age: faker.number.int({ min: 18, max: 65 }),
			gender: faker.helpers.arrayElement(Object.values(GENDER)),
			allergies: faker.lorem.sentence(),
			emergencyContact: faker.person.fullName(),
			emergencyPhone: faker.phone.number(),
			medicalHistory: faker.lorem.paragraph(),
			medications: faker.lorem.sentence(),
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
			age: faker.number.int({ min: 18, max: 65 }),
			gender: faker.helpers.arrayElement(Object.values(GENDER)),
			allergies: faker.lorem.sentence(),
			emergencyContact: faker.person.fullName(),
			emergencyPhone: faker.phone.number(),
			medicalHistory: faker.lorem.paragraph(),
			medications: faker.lorem.sentence(),
			companyId: company.id.toString(),
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
