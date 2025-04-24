import { UniqueEntityID } from '@/core/entities/unique-entity'
import { faker } from '@faker-js/faker'
import { Question } from './question'

describe('Question Entity', () => {
	it('Should be able', () => {
		const question = Question.create({
			text: faker.lorem.sentence(),
			mandatory: true,
			companyId: new UniqueEntityID(),
		})

		expect(question.id).toBeTruthy()
		expect(question.text).toBeTruthy()
		expect(question.mandatory).toBeTruthy()
		expect(question.companyId).toBeInstanceOf(UniqueEntityID)
		expect(question.createdAt).toBeInstanceOf(Date)
	})

	it('Should be able', async () => {
		const question = Question.create({
			text: faker.lorem.sentence(),
			mandatory: true,
			companyId: new UniqueEntityID(),
		})

		question.createAnswer(new UniqueEntityID())

		expect(question.updatedAt).toBeInstanceOf(Date)
		expect(question.answerId).toBeInstanceOf(UniqueEntityID)
	})
})
