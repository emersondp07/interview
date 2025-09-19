import type { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import { faker } from '@faker-js/faker'

export function makeInterviewQuestion(
	override: Partial<{
		question: string
		options: string[]
		required: boolean
		interviewId: UniqueEntityID
	}> = {},
	id?: UniqueEntityID,
) {
	const interviewQuestion = InterviewQuestion.create(
		{
			question: faker.lorem.sentence(),
			options: [
				faker.lorem.word(),
				faker.lorem.word(),
				faker.lorem.word(),
				faker.lorem.word(),
			],
			required: true,
			...override,
		},
		id,
	)

	return interviewQuestion
}
