import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewQuestion } from '@/tests/factories/make-interview-question'
import { InMemoryInterviewQuestionsRepository } from '@/tests/repositories/in-memory-interview-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { DeleteInterviewQuestionUseCase } from './delete-interview-question'

let inMemoryInterviewQuestionsRepository: InMemoryInterviewQuestionsRepository
let sut: DeleteInterviewQuestionUseCase

describe('Delete Interview Question Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewQuestionsRepository =
			new InMemoryInterviewQuestionsRepository()
		sut = new DeleteInterviewQuestionUseCase(
			inMemoryInterviewQuestionsRepository,
		)
	})

	it('should be able to delete an interview question', async () => {
		const interviewQuestion = makeInterviewQuestion()

		await inMemoryInterviewQuestionsRepository.create(interviewQuestion)

		const result = await sut.execute({
			interviewQuestionId: interviewQuestion.id.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(
			inMemoryInterviewQuestionsRepository.items[0].deletedAt,
		).toBeInstanceOf(Date)
	})

	it('should return error when interview question does not exist', async () => {
		const result = await sut.execute({
			interviewQuestionId: 'invalid-id',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
