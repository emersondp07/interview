import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import {
	type InterviewerProps,
	PROFESSIONAL_REGISTRATIONS,
	SPECIALTIES,
} from '@/domain/interviewer/entities/interfaces/interviewer.type'
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
			specialty: faker.helpers.arrayElement(Object.values(SPECIALTIES)),
			profissionalRegistration: faker.helpers.arrayElement(
				Object.values(PROFESSIONAL_REGISTRATIONS),
			),
			numberRegistration: faker.string.numeric(6),
			experience: faker.lorem.sentence(),
			bio: faker.lorem.paragraph(),
			...override,
		},
		id,
	)

	return interviewer
}
