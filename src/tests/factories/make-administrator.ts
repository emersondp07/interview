import { Administrator } from '@/domain/administrator/entities/administrator'
import type { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { AdministratorProps } from '@domain/administrator/entities/interfaces/adminitrator.type'
import { faker } from '@faker-js/faker'

export function makeAdministrator(
	override: Partial<AdministratorProps>,
	id?: UniqueEntityID,
) {
	const administrator = Administrator.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			...override,
		},
		id,
	)

	return administrator
}
