import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Client } from './client'
import { ROLE } from './interfaces/adminitrator.type'
import { DOCUMENT_TYPE } from './interfaces/client.type'

describe('Client Entity', () => {
	it('Should be able', () => {
		const client = Client.create({
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
		})

		expect(client.id).toBeInstanceOf(UniqueEntityID)
		expect(client.role).toBe(ROLE.CLIENT)
		expect(client.createdAt).toBeInstanceOf(Date)
		expect(client.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able', async () => {
		const client = Client.create({
			name: 'John Doe',
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: '11 91234-5678',
			email: 'john.doe@gmail.com',
		})

		const oldUpdatedAt = client.updatedAt

		await delay(10)

		client.changeName('John Smith')
		client.changePhone('11 98765-4321')
		client.changeEmail('john.smith@gmail.com')

		expect(client.name).toBe('John Smith')
		expect(client.phone).toBe('11 98765-4321')
		expect(client.email).toBe('john.smith@gmail.com')
		expect(client.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able', async () => {
		const client = Client.create({
			name: 'John Doe',
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: '11 91234-5678',
			email: 'john.doe@gmail.com',
		})

		const oldUpdatedAt = client.updatedAt

		await delay(10)

		client.delete()

		expect(client.deletedAt).toBeInstanceOf(Date)
		expect(client.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
