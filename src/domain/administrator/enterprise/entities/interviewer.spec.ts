import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { ROLE } from './interfaces/adminitrator.type'
import { Interviewer } from './interviewer'

describe('Interviewer Entity', () => {
	it('Should be able create a interviewer with valid data', () => {
		const interviewer = Interviewer.create({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
			companyId: new UniqueEntityID(),
		})

		expect(interviewer.id).toBeInstanceOf(UniqueEntityID)
		expect(interviewer.role).toBe(ROLE.INTERVIEWER)
		expect(interviewer.createdAt).toBeInstanceOf(Date)
	})

	it('Should be able', async () => {
		const interviewer = Interviewer.create({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: 'abc123',
			companyId: new UniqueEntityID(),
		})

		const oldUpdatedAt = interviewer.updatedAt

		await delay(10)

		interviewer.changeEmail('company02@gmail.com')
		interviewer.changePassword('abc1234')
		interviewer.changeName('Joe Doe')

		expect(interviewer.email).toEqual('company02@gmail.com')
		expect(interviewer.password).toEqual('abc1234')
		expect(interviewer.name).toEqual('Joe Doe')
		expect(interviewer.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able', async () => {
		const interviewer = Interviewer.create({
			name: faker.person.fullName(),
			email: faker.internet.email(),
			password: 'abc123',
			companyId: new UniqueEntityID(),
		})

		const oldUpdatedAt = interviewer.updatedAt

		await delay(10)
		interviewer.delete()

		expect(interviewer.deletedAt).toBeInstanceOf(Date)
		expect(interviewer.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})
})
