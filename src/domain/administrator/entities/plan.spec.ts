import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { Plan } from './plan'

describe('Plan Entity', () => {
	it('Should be able to create a plan with valid data', () => {
		const plan = Plan.create({
			name: 'Plan Name',
			price: '10',
			interviewLimit: faker.number.int({ min: 1, max: 100 }),
			description: faker.lorem.paragraph(),
			stripeProductId: faker.string.uuid(),
		})

		expect(plan.id).toBeInstanceOf(UniqueEntityID)
		expect(plan.createdAt).toBeInstanceOf(Date)
		expect(plan.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the datas of a plan', async () => {
		const plan = Plan.create({
			name: 'Plan Name',
			price: '10',
			interviewLimit: 10,
			description: 'Plan Description',
			stripeProductId: faker.string.uuid(),
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
