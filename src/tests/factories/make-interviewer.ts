import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import type { InterviewerProps } from '@/domain/interviewer/entities/interfaces/interviewer.type'
import { Interviewer } from '@/domain/interviewer/entities/interviewer'
import { faker } from '@faker-js/faker'

export function makeInterviewer(
	override?: Partial<InterviewerProps>,
	id?: UniqueEntityID,
) {
	const interviewer = Interviewer.create(
		{
			name: faker.person.fullName(),
			email: faker.internet.email(),
			companyId: new UniqueEntityID(),
			password: faker.internet.password(),
			...override,
		},
		id,
	)

	return interviewer
}
