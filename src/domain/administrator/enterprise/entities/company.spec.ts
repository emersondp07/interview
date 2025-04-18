import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Company } from './company'
import { ROLE } from './interfaces/adminitrator.type'
import { DOCUMENT_TYPE } from './interfaces/client.type'

describe('Company Entity', () => {
	it('Should be able', () => {
		const company = Company.create({
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
		})

		expect(company.id).toBeInstanceOf(UniqueEntityID)
		expect(company.role).toBe(ROLE.COMPANY)
		expect(company.createdAt).toBeInstanceOf(Date)
	})

	it('Should be able', async () => {
		const company = Company.create({
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: 'company.x@gmail.com',
			password: 'c123',
			phone: '11 99999-9999',
		})

		const oldUpdatedAt = company.updatedAt

		await delay(10)

		company.changeEmail('company.y@gmail.com')
		company.changePassword('d123')
		company.changePhone('11 98765-4321')

		expect(company.email).toEqual('company.y@gmail.com')
		expect(company.password).toEqual('d123')
		expect(company.phone).toEqual('11 98765-4321')
		expect(company.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able', async () => {
		const company = Company.create({
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: 'company.x@gmail.com',
			password: 'c123',
			phone: '11 99999-9999',
		})

		const oldUpdatedAt = company.updatedAt

		await delay(10)

		company.delete()

		expect(company.deletedAt).toBeInstanceOf(Date)
		expect(company.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
