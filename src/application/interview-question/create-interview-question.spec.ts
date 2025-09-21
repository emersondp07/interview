import { InMemoryInterviewQuestionsRepository } from '@/tests/repositories/in-memory-interview-questions-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { CreateInterviewQuestionUseCase } from './create-interview-question'

let inMemoryInterviewQuestionsRepository: InMemoryInterviewQuestionsRepository
let sut: CreateInterviewQuestionUseCase

describe('Create Interview Question Use Case', () => {
	beforeEach(() => {
		inMemoryInterviewQuestionsRepository =
			new InMemoryInterviewQuestionsRepository()
		sut = new CreateInterviewQuestionUseCase(
			inMemoryInterviewQuestionsRepository,
		)
	})

	it('should be able to create an interview question', async () => {
		const result = await sut.execute({
			question: 'Como você se sente hoje?',
			options: ['Muito bem', 'Bem', 'Regular', 'Mal', 'Muito mal'],
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestion: expect.objectContaining({
				question: 'Como você se sente hoje?',
				options: ['Muito bem', 'Bem', 'Regular', 'Mal', 'Muito mal'],
				required: true,
			}),
		})
		expect(inMemoryInterviewQuestionsRepository.items).toHaveLength(1)
	})

	it('should be able to create an optional interview question', async () => {
		const result = await sut.execute({
			question: 'Alguma observação adicional?',
			options: ['Sim', 'Não'],
			required: false,
		})

		expect(result.isSuccess()).toBe(true)
		expect(result.value).toEqual({
			interviewQuestion: expect.objectContaining({
				required: false,
			}),
		})
	})
})
