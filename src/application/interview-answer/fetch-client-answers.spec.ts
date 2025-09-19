import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { makeInterviewAnswer } from '@/tests/factories/make-interview-answer'
import { InMemoryInterviewAnswersRepository } from '@/tests/repositories/in-memory-interview-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { FetchClientAnswersUseCase } from './fetch-client-answers'

let inMemoryInterviewAnswersRepository: InMemoryInterviewAnswersRepository
let sut: FetchClientAnswersUseCase

describe('Fetch Client Answers Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewAnswersRepository =
			new InMemoryInterviewAnswersRepository()
		sut = new FetchClientAnswersUseCase(inMemoryInterviewAnswersRepository)
	})

	it('should be able to fetch client answers', async () => {
		const clientId = new UniqueEntityID('client-1')
		const anotherClientId = new UniqueEntityID('client-2')

		const answer1 = makeInterviewAnswer({ clientId })
		const answer2 = makeInterviewAnswer({ clientId })
		const answer3 = makeInterviewAnswer({ clientId: anotherClientId })

		await inMemoryInterviewAnswersRepository.create(answer1)
		await inMemoryInterviewAnswersRepository.create(answer2)
		await inMemoryInterviewAnswersRepository.create(answer3)

		const result = await sut.execute({
			clientId: clientId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewAnswers: expect.arrayContaining([
				expect.objectContaining({ id: answer1.id }),
				expect.objectContaining({ id: answer2.id }),
			]),
		})
		expect(result.value?.interviewAnswers).toHaveLength(2)
	})

	it('should return empty array when client has no answers', async () => {
		const result = await sut.execute({
			clientId: 'non-existent-client',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewAnswers: [],
		})
	})
})
