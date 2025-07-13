import { Client } from '@/domain/client/entities/client'
import {
	type ClientProps,
	DOCUMENT_TYPE,
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
			document: '12345678909',
			birthDate: new Date('1990-01-01'),
			phone: faker.phone.number(),
			email: faker.internet.email(),
			companyId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return company
}
