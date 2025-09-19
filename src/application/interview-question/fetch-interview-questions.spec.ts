import { makeInterviewQuestion } from '@/tests/factories/make-interview-question'
import { InMemoryInterviewQuestionsRepository } from '@/tests/repositories/in-memory-interview-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchInterviewQuestionsUseCase } from './fetch-interview-questions'

let inMemoryInterviewQuestionsRepository: InMemoryInterviewQuestionsRepository
let sut: FetchInterviewQuestionsUseCase

describe('Fetch Interview Questions Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewQuestionsRepository =
			new InMemoryInterviewQuestionsRepository()
		sut = new FetchInterviewQuestionsUseCase(
			inMemoryInterviewQuestionsRepository,
		)
	})

	it('should be able to fetch interview questions', async () => {
		const question1 = makeInterviewQuestion()
		const question2 = makeInterviewQuestion()

		await inMemoryInterviewQuestionsRepository.create(question1)
		await inMemoryInterviewQuestionsRepository.create(question2)

		const result = await sut.execute({
			page: 1,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestions: expect.arrayContaining([
				expect.objectContaining({ id: question1.id }),
				expect.objectContaining({ id: question2.id }),
			]),
		})
	})

	it('should return empty array when no questions exist', async () => {
		const result = await sut.execute({
			page: 1,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestions: [],
		})
	})
})
