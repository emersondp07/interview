import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import { faker } from '@faker-js/faker'

export function makeInterviewAnswer(
	override: Partial<{
		clientId: UniqueEntityID
		questionId: UniqueEntityID
		selectedOption: string
	}> = {},
	id?: UniqueEntityID,
) {
	const interviewAnswer = InterviewAnswer.create(
		{
			clientId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			selectedOption: faker.lorem.word(),
			...override,
		},
		id,
	)

	return interviewAnswer
}
