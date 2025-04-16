import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Company } from './company'
import { DOCUMENT_TYPE } from './interfaces/client.type'

describe('Company Entity', () => {
	it('Should be able create a company with valid data', () => {
		const company = Company.create({
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
		})

		expect(company.id).toBeInstanceOf(UniqueEntityID)
		expect(company.createdAt).toBeInstanceOf(Date)
	})

	it('Should be able to change company email', async () => {
		const company = Company.create({
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
		})

		const oldUpdatedAt = company.updatedAt

		await delay(10)

		company.changeEmail('company02@gmail.com')

		expect(company.email).toEqual('company02@gmail.com')
		expect(company.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
