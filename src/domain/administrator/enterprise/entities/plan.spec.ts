import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Plan } from './plan'

describe('Plan Entity', () => {
	it('Should be able', () => {
		const plan = Plan.create({
			name: 'Plan Name',
			price: '10',
			interviewLimit: faker.number.int({ min: 1, max: 100 }),
			description: faker.lorem.paragraph(),
		})

		expect(plan.id).toBeInstanceOf(UniqueEntityID)
		expect(plan.createdAt).toBeInstanceOf(Date)
		expect(plan.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able', async () => {
		const plan = Plan.create({
			name: 'Plan Name',
			price: '10',
			interviewLimit: 10,
			description: 'Plan Description',
		})

		const oldUpdatedAt = plan.updatedAt

		await delay(10)

		plan.changeName('New Plan Name')
		plan.changePrice('20')
		plan.changeInterviewLimit(20)
		plan.changeDescription('New Plan Description')

		expect(plan.name).toEqual('New Plan Name')
		expect(plan.price).toEqual('20')
		expect(plan.interviewLimit).toEqual(20)
		expect(plan.description).toEqual('New Plan Description')
		expect(plan.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
