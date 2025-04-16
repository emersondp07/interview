import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { Answer } from './answer'

describe('Answer Entity', () => {
	it('Should be able create an administrator with valid data', () => {
		const answer = Answer.create({
			intervirewId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			answerText: faker.lorem.sentence(),
		})

		expect(answer.intervirewId).toBeInstanceOf(UniqueEntityID)
		expect(answer.questionId).toBeInstanceOf(UniqueEntityID)
		expect(answer.createdAt).toBeInstanceOf(Date)
		expect(answer.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the name of an administrator', async () => {
		const answer = Answer.create({
			intervirewId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			answerText: faker.lorem.sentence(),
		})

		const oldUpdatedAt = answer.updatedAt

		await delay(10)

		answer.changeText(faker.lorem.sentence())

		expect(answer.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
