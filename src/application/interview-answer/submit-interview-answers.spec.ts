import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InMemoryInterviewAnswersRepository } from '@/tests/repositories/in-memory-interview-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SubmitInterviewAnswersUseCase } from './submit-interview-answers'

let inMemoryInterviewAnswersRepository: InMemoryInterviewAnswersRepository
let sut: SubmitInterviewAnswersUseCase

describe('Submit Interview Answers Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewAnswersRepository =
			new InMemoryInterviewAnswersRepository()
		sut = new SubmitInterviewAnswersUseCase(inMemoryInterviewAnswersRepository)
	})

	it('should be able to submit interview answers', async () => {
		const clientId = new UniqueEntityID().toString()
		const questionId1 = new UniqueEntityID().toString()
		const questionId2 = new UniqueEntityID().toString()

		const result = await sut.execute({
			clientId,
			answers: [
				{
					questionId: questionId1,
					selectedOption: 'Muito bem',
				},
				{
					questionId: questionId2,
					selectedOption: 'Sim',
				},
			],
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewAnswers: expect.arrayContaining([
				expect.objectContaining({
					selectedOption: 'Muito bem',
				}),
				expect.objectContaining({
					selectedOption: 'Sim',
				}),
			]),
		})
		expect(inMemoryInterviewAnswersRepository.items).toHaveLength(2)
	})

	it('should be able to submit empty answers array', async () => {
		const clientId = new UniqueEntityID().toString()

		const result = await sut.execute({
			clientId,
			answers: [],
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewAnswers: [],
		})
		expect(inMemoryInterviewAnswersRepository.items).toHaveLength(0)
	})
})
