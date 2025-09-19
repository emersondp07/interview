import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { InterviewAnswer } from './interview-answer'

describe('InterviewAnswer Entity', () => {
	it('Should be able to create an interview answer with valid data', () => {
		const clientId = new UniqueEntityID()
		const questionId = new UniqueEntityID()
		const selectedOption = 'Option A'

		const interviewAnswer = InterviewAnswer.create({
			clientId,
			questionId,
			selectedOption,
		})

		expect(interviewAnswer.id).toBeInstanceOf(UniqueEntityID)
		expect(interviewAnswer.clientId).toBe(clientId)
		expect(interviewAnswer.questionId).toBe(questionId)
		expect(interviewAnswer.selectedOption).toBe(selectedOption)
		expect(interviewAnswer.createdAt).toBeInstanceOf(Date)
		expect(interviewAnswer.updatedAt).toBeInstanceOf(Date)
		expect(interviewAnswer.deletedAt).toBeUndefined()
	})

	it('Should be able to change the selected option', async () => {
		const interviewAnswer = InterviewAnswer.create({
			clientId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			selectedOption: 'Option A',
		})

		const oldUpdatedAt = interviewAnswer.updatedAt

		await delay(100)

		interviewAnswer.changeSelectedOption('Option B')

		expect(interviewAnswer.selectedOption).toBe('Option B')
		expect(interviewAnswer.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to delete an interview answer', async () => {
		const interviewAnswer = InterviewAnswer.create({
			clientId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			selectedOption: 'Option C',
		})

		const oldUpdatedAt = interviewAnswer.updatedAt

		await delay(100)

		interviewAnswer.delete()

		expect(interviewAnswer.deletedAt).toBeInstanceOf(Date)
		expect(interviewAnswer.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to change selected option multiple times', async () => {
		const interviewAnswer = InterviewAnswer.create({
			clientId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			selectedOption: 'Initial Option',
		})

		const firstUpdatedAt = interviewAnswer.updatedAt

		await delay(100)

		interviewAnswer.changeSelectedOption('Second Option')
		const secondUpdatedAt = interviewAnswer.updatedAt

		await delay(100)

		interviewAnswer.changeSelectedOption('Final Option')

		expect(interviewAnswer.selectedOption).toBe('Final Option')
		expect(secondUpdatedAt?.getTime()).toBeGreaterThan(
			firstUpdatedAt?.getTime() || 0,
		)
		expect(interviewAnswer.updatedAt?.getTime()).toBeGreaterThan(
			secondUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to create with different option types', () => {
		const testCases = [
			'Yes',
			'No',
			'Sometimes',
			'Never',
			'Always',
			'1-2 times per week',
			'More than 5 years',
		]

		testCases.forEach((option) => {
			const interviewAnswer = InterviewAnswer.create({
				clientId: new UniqueEntityID(),
				questionId: new UniqueEntityID(),
				selectedOption: option,
			})

			expect(interviewAnswer.selectedOption).toBe(option)
			expect(interviewAnswer.id).toBeInstanceOf(UniqueEntityID)
		})
	})

	it('Should maintain client and question relationships', () => {
		const clientId = new UniqueEntityID()
		const questionId = new UniqueEntityID()

		const interviewAnswer = InterviewAnswer.create({
			clientId,
			questionId,
			selectedOption: faker.helpers.arrayElement(['Yes', 'No', 'Maybe']),
		})

		// Change the selected option
		interviewAnswer.changeSelectedOption('Different Option')

		// Relationships should remain unchanged
		expect(interviewAnswer.clientId).toBe(clientId)
		expect(interviewAnswer.questionId).toBe(questionId)
	})

	it('Should handle edge case with empty string option', () => {
		const interviewAnswer = InterviewAnswer.create({
			clientId: new UniqueEntityID(),
			questionId: new UniqueEntityID(),
			selectedOption: '',
		})

		expect(interviewAnswer.selectedOption).toBe('')

		interviewAnswer.changeSelectedOption('Now has content')
		expect(interviewAnswer.selectedOption).toBe('Now has content')
	})
})
