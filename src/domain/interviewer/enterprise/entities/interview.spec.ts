import { UniqueEntityID } from '@/core/entities/unique-entity'
import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { STATUS_INTERVIEW } from './interfaces/interview.type'
import { Interview } from './interview'

describe('Interview Entity', () => {
	it('Should be able create a inteview with valid data', () => {
		const interview = Interview.create({
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
			status: faker.helpers.arrayElement(Object.values(STATUS_INTERVIEW)),
		})

		expect(interview.id).toBeInstanceOf(UniqueEntityID)
		expect(interview.clientId).toBeInstanceOf(UniqueEntityID)
		expect(interview.interviewerId).toBeInstanceOf(UniqueEntityID)
		expect(interview.createdAt).toBeInstanceOf(Date)
	})

	it('Should be able to change interview status', async () => {
		const company = Interview.create({
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
			status: STATUS_INTERVIEW.SCHEDULED,
		})

		const oldUpdatedAt = company.updatedAt

		await delay(10)

		company.changeStatus(STATUS_INTERVIEW.IN_PROGRESS)

		expect(company.status).toEqual(STATUS_INTERVIEW.IN_PROGRESS)
		expect(company.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able to delete a interview', async () => {
		const company = Interview.create({
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
			status: STATUS_INTERVIEW.SCHEDULED,
		})

		const oldUpdatedAt = company.updatedAt

		await delay(10)

		company.delete()

		expect(company.status).toEqual(STATUS_INTERVIEW.CANCELED)
		expect(company.deletedAt).toBeInstanceOf(Date)
		expect(company.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
