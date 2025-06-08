import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Administrator } from './administrator'
import { ROLE } from './interfaces/adminitrator.type'

describe('Administrator Entity', () => {
	it('Should be able to create an administrator with valid data', () => {
		const administrator = Administrator.create({
			name: 'John Doe',
			email: faker.internet.email(),
			password: faker.internet.password(),
		})

		expect(administrator.role).toBe(ROLE.ADMIN)
		expect(administrator.id).toBeInstanceOf(UniqueEntityID)
		expect(administrator.createdAt).toBeInstanceOf(Date)
		expect(administrator.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the datas of an administrator', async () => {
		const administrator = Administrator.create({
			name: 'John Doe',
			email: 'john.doe@gmail.com',
			password: faker.internet.password(),
		})

		const oldUpdatedAt = administrator.updatedAt

		await delay(10)

		administrator.changeName('John Smith')
		administrator.changeEmail('john.smith@gmail.com')
		const newPassword = faker.internet.password()
		administrator.changePassword(newPassword)

		expect(administrator.name).toBe('John Smith')
		expect(administrator.email).toBe('john.smith@gmail.com')
		expect(administrator.password).toBe(newPassword)
		expect(administrator.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})
})
