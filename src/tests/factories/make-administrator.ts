import type { UniqueEntityID } from '@/core/entities/unique-entity'
import type { AdministratorProps } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { faker } from '@faker-js/faker'
import { Administrator } from '../../domain/administrator/enterprise/entities/administrator'

export function makeAdministrator(
	override: Partial<AdministratorProps> = {},
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
