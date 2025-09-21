import { Client } from '@/domain/client/entities/client'
import {
	type ClientProps,
	DOCUMENT_TYPE,
	GENDER,
} from '@/domain/client/entities/interfaces/client.type'
import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { faker } from '@faker-js/faker'

export function makeClient(
	override?: Partial<ClientProps>,
	id?: UniqueEntityID,
) {
	const company = Client.create(
		{
			name: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CPF,
			document: faker.string.numeric(11),
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			age: faker.number.int({ min: 18, max: 65 }),
			gender: faker.helpers.arrayElement(Object.values(GENDER)),
			allergies: faker.lorem.sentence(),
			emergencyContact: faker.person.fullName(),
			emergencyPhone: faker.phone.number(),
			medications: faker.lorem.sentence(),
			companyId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return company
}
