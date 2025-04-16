import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Client } from './client'
import { DOCUMENT_TYPE } from './interfaces/client.type'

describe('Client Entity', () => {
	it('Should be able create an client with valid data', () => {
		const client = Client.create({
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			address: faker.location.streetAddress(),
		})

		expect(client.id).toBeInstanceOf(UniqueEntityID)
		expect(client.createdAt).toBeInstanceOf(Date)
		expect(client.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the name of a client', async () => {
		const client = Client.create({
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			address: faker.location.streetAddress(),
		})

		const oldUpdatedAt = client.updatedAt

		await delay(10)

		client.changeName(faker.person.fullName())

		expect(client.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
