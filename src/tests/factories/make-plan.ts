import type { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { PlanProps } from '@domain/administrator/entities/interfaces/plan.type'
import { Plan } from '@domain/administrator/entities/plan'
import { faker } from '@faker-js/faker'

export function makePlan(override?: Partial<PlanProps>, id?: UniqueEntityID) {
	const plan = Plan.create(
		{
			name: 'Plan Name',
			price: '10',
			interviewLimit: faker.number.int({ min: 1, max: 100 }),
			description: faker.lorem.paragraph(),
			stripeProductId: faker.string.uuid(),
			...override,
		},
		id,
	)

	return plan
}
