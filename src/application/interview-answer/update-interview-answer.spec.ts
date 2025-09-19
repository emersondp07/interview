import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewAnswer } from '@/tests/factories/make-interview-answer'
import { InMemoryInterviewAnswersRepository } from '@/tests/repositories/in-memory-interview-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { UpdateInterviewAnswerUseCase } from './update-interview-answer'

let inMemoryInterviewAnswersRepository: InMemoryInterviewAnswersRepository
let sut: UpdateInterviewAnswerUseCase

describe('Update Interview Answer Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewAnswersRepository =
			new InMemoryInterviewAnswersRepository()
		sut = new UpdateInterviewAnswerUseCase(inMemoryInterviewAnswersRepository)
	})

	it('should be able to update an interview answer', async () => {
		const interviewAnswer = makeInterviewAnswer({
			selectedOption: 'Old answer',
		})

		await inMemoryInterviewAnswersRepository.create(interviewAnswer)

		const result = await sut.execute({
			interviewAnswerId: interviewAnswer.id.toString(),
			selectedOption: 'New answer',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewAnswer: expect.objectContaining({
				selectedOption: 'New answer',
			}),
		})
	})

	it('should return error when interview answer does not exist', async () => {
		const result = await sut.execute({
			interviewAnswerId: 'invalid-id',
			selectedOption: 'New answer',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
