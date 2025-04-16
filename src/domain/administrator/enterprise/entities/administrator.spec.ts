import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Administrator } from './administrator'
import { ROLE } from './interfaces/adminitrator.type'

describe('Administrator Entity', () => {
	it('Should be able create an administrator with valid data', () => {
		const administrator = Administrator.create({
			name: 'John Doe',
			email: faker.internet.email(),
			password: faker.internet.password(),
			role: ROLE.ADMIN,
		})

		expect(administrator.name).toBe('John Doe')
		expect(administrator.createdAt).toBeInstanceOf(Date)
		expect(administrator.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the name of an administrator', async () => {
		const administrator = Administrator.create({
			name: 'John Smith',
			email: faker.internet.email(),
			password: faker.internet.password(),
			role: ROLE.ADMIN,
		})

		const oldUpdatedAt = administrator.updatedAt

		await delay(10)

		administrator.changeName('John Doe')

		expect(administrator.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})
})
