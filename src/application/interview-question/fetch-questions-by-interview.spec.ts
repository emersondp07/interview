import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { makeInterviewQuestion } from '@/tests/factories/make-interview-question'
import { InMemoryInterviewQuestionsRepository } from '@/tests/repositories/in-memory-interview-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchQuestionsByInterviewUseCase } from './fetch-questions-by-interview'

let inMemoryInterviewQuestionsRepository: InMemoryInterviewQuestionsRepository
let sut: FetchQuestionsByInterviewUseCase

describe('Fetch Questions By Interview Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewQuestionsRepository =
			new InMemoryInterviewQuestionsRepository()
		sut = new FetchQuestionsByInterviewUseCase(
			inMemoryInterviewQuestionsRepository,
		)
	})

	it('should be able to fetch questions by interview', async () => {
		const interviewId = new UniqueEntityID('interview-1')
		const anotherInterviewId = new UniqueEntityID('interview-2')

		const question1 = makeInterviewQuestion({ interviewId })
		const question2 = makeInterviewQuestion({ interviewId })
		const question3 = makeInterviewQuestion({ interviewId: anotherInterviewId })

		await inMemoryInterviewQuestionsRepository.create(question1)
		await inMemoryInterviewQuestionsRepository.create(question2)
		await inMemoryInterviewQuestionsRepository.create(question3)

		const result = await sut.execute({
			interviewId: interviewId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestions: expect.arrayContaining([
				expect.objectContaining({ id: question1.id }),
				expect.objectContaining({ id: question2.id }),
			]),
		})
		expect(result.value?.interviewQuestions).toHaveLength(2)
	})

	it('should return empty array when no questions exist for interview', async () => {
		const result = await sut.execute({
			interviewId: 'non-existent-interview',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestions: [],
		})
	})
})
