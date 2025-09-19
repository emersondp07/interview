import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { makeInterviewAnswer } from '@/tests/factories/make-interview-answer'
import { InMemoryInterviewAnswersRepository } from '@/tests/repositories/in-memory-interview-answers-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { GenerateInterviewReportUseCase } from './generate-interview-report'

let inMemoryInterviewAnswersRepository: InMemoryInterviewAnswersRepository
let sut: GenerateInterviewReportUseCase

describe('Generate Interview Report Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewAnswersRepository =
			new InMemoryInterviewAnswersRepository()
		sut = new GenerateInterviewReportUseCase(inMemoryInterviewAnswersRepository)
	})

	it('should be able to generate interview report for client', async () => {
		const clientId = new UniqueEntityID('client-1')
		const questionId1 = new UniqueEntityID('question-1')
		const questionId2 = new UniqueEntityID('question-2')

		const answer1 = makeInterviewAnswer({
			clientId,
			questionId: questionId1,
			selectedOption: 'Muito bem',
		})
		const answer2 = makeInterviewAnswer({
			clientId,
			questionId: questionId2,
			selectedOption: 'Sim',
		})

		await inMemoryInterviewAnswersRepository.create(answer1)
		await inMemoryInterviewAnswersRepository.create(answer2)

		const result = await sut.execute({
			clientId: clientId.toString(),
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			report: expect.objectContaining({
				clientId: clientId.toString(),
				totalAnswers: 2,
				answersData: expect.arrayContaining([
					expect.objectContaining({
						questionId: questionId1.toString(),
						selectedOption: 'Muito bem',
						answeredAt: expect.any(Date),
					}),
					expect.objectContaining({
						questionId: questionId2.toString(),
						selectedOption: 'Sim',
						answeredAt: expect.any(Date),
					}),
				]),
				generatedAt: expect.any(Date),
			}),
		})
	})

	it('should generate empty report when client has no answers', async () => {
		const result = await sut.execute({
			clientId: 'client-without-answers',
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			report: expect.objectContaining({
				clientId: 'client-without-answers',
				totalAnswers: 0,
				answersData: [],
				generatedAt: expect.any(Date),
			}),
		})
	})
})
