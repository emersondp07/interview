import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewQuestion } from '@/tests/factories/make-interview-question'
import { InMemoryInterviewQuestionsRepository } from '@/tests/repositories/in-memory-interview-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateInterviewQuestionUseCase } from './update-interview-question'

let inMemoryInterviewQuestionsRepository: InMemoryInterviewQuestionsRepository
let sut: UpdateInterviewQuestionUseCase

describe('Update Interview Question Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewQuestionsRepository =
			new InMemoryInterviewQuestionsRepository()
		sut = new UpdateInterviewQuestionUseCase(
			inMemoryInterviewQuestionsRepository,
		)
	})

	it('should be able to update an interview question', async () => {
		const interviewQuestion = makeInterviewQuestion({
			question: 'Old question',
			options: ['Old option 1', 'Old option 2'],
		})

		await inMemoryInterviewQuestionsRepository.create(interviewQuestion)

		const result = await sut.execute({
			questionId: interviewQuestion.id.toString(),
			question: 'New question',
			options: ['New option 1', 'New option 2', 'New option 3'],
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestion: expect.objectContaining({
				question: 'New question',
				options: ['New option 1', 'New option 2', 'New option 3'],
			}),
		})
	})

	it('should be able to toggle required field', async () => {
		const interviewQuestion = makeInterviewQuestion({
			required: true,
		})

		await inMemoryInterviewQuestionsRepository.create(interviewQuestion)

		const result = await sut.execute({
			questionId: interviewQuestion.id.toString(),
			required: false,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestion: expect.objectContaining({
				required: false,
			}),
		})
	})

	it('should return error when interview question does not exist', async () => {
		const result = await sut.execute({
			questionId: 'invalid-id',
			question: 'New question',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
