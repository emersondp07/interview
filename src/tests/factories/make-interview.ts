import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import {
	type InterviewProps,
	STATUS_INTERVIEW,
} from '@/domain/interviewer/entities/interfaces/interview.type'
import { Interview } from '@/domain/interviewer/entities/interview'

export function makeInterview(
	override?: Partial<InterviewProps>,
	id?: UniqueEntityID,
) {
	const interview = Interview.create(
		{
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
			companyId: new UniqueEntityID(),
			status: STATUS_INTERVIEW.SCHEDULED,
			...override,
		},
		id,
	)

	return interview
}
