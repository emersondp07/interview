import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { ROLE } from '../../administrator/entities/interfaces/adminitrator.type'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { Client } from './client'
import { DOCUMENT_TYPE, GENDER } from './interfaces/client.type'

describe('Client Entity', () => {
	it('Should be able to create a client with valid data', () => {
		const client = Client.create({
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
			companyId: new UniqueEntityID(),
		})

		expect(client.id).toBeInstanceOf(UniqueEntityID)
		expect(client.role).toBe(ROLE.CLIENT)
		expect(client.document).toBe('12345678909')
		expect(client.birthDate).toBeInstanceOf(Date)
		expect(client.createdAt).toBeInstanceOf(Date)
		expect(client.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the datas of a client', async () => {
		const client = Client.create({
			name: 'John Doe',
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: '11 91234-5678',
			email: 'john.doe@gmail.com',
			age: 30,
			gender: GENDER.FEM,
			allergies: 'None',
			emergencyContact: 'Jane Doe',
			emergencyPhone: '11 91234-5678',
			medicalHistory: 'No known conditions',
			medications: 'None',
			companyId: new UniqueEntityID(),
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

	it('Should be able to delete a client', async () => {
		const client = Client.create({
			name: 'John Doe',
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: '11 91234-5678',
			email: 'john.doe@gmail.com',
			age: 30,
			gender: GENDER.FEM,
			allergies: 'None',
			emergencyContact: 'Jane Doe',
			emergencyPhone: '11 91234-5678',
			medicalHistory: 'No known conditions',
			medications: 'None',
			companyId: new UniqueEntityID(),
		})

		const oldUpdatedAt = client.updatedAt

		await delay(10)

		client.delete()

		expect(client.deletedAt).toBeInstanceOf(Date)
		expect(client.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
