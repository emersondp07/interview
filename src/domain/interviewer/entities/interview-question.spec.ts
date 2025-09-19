import { delay } from '@/tests/utils/delay'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { InterviewQuestion } from './interview-question'

describe('InterviewQuestion Entity', () => {
	it('Should be able to create an interview question with valid data', () => {
		const question = 'How often do you exercise?'
		const options = [
			'Never',
			'1-2 times per week',
			'3-4 times per week',
			'Daily',
		]

		const interviewQuestion = InterviewQuestion.create({
			question,
			options,
		})

		expect(interviewQuestion.id).toBeInstanceOf(UniqueEntityID)
		expect(interviewQuestion.question).toBe(question)
		expect(interviewQuestion.options).toEqual(options)
		expect(interviewQuestion.required).toBe(true) // default value
		expect(interviewQuestion.createdAt).toBeInstanceOf(Date)
		expect(interviewQuestion.updatedAt).toBeInstanceOf(Date)
		expect(interviewQuestion.deletedAt).toBeUndefined()
		expect(interviewQuestion.interviewId).toBeUndefined()
	})

	it('Should be able to create a non-required question', () => {
		const interviewQuestion = InterviewQuestion.create({
			question: 'Any additional comments?',
			options: ['Yes', 'No'],
			required: false,
		})

		expect(interviewQuestion.required).toBe(false)
		expect(interviewQuestion.question).toBe('Any additional comments?')
	})

	it('Should be able to change the question text', async () => {
		const interviewQuestion = InterviewQuestion.create({
			question: 'Original question',
			options: ['Option 1', 'Option 2'],
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.changeQuestion('Updated question text')

		expect(interviewQuestion.question).toBe('Updated question text')
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to update options', async () => {
		const originalOptions = ['Yes', 'No']
		const newOptions = ['Always', 'Sometimes', 'Never', 'Not applicable']

		const interviewQuestion = InterviewQuestion.create({
			question: 'Do you smoke?',
			options: originalOptions,
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.updateOptions(newOptions)

		expect(interviewQuestion.options).toEqual(newOptions)
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to toggle required flag', async () => {
		const interviewQuestion = InterviewQuestion.create({
			question: 'Optional question',
			options: ['Yes', 'No'],
			required: true,
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.toggleRequired()

		expect(interviewQuestion.required).toBe(false)
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)

		const secondUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.toggleRequired()

		expect(interviewQuestion.required).toBe(true)
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			secondUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign to an interview', async () => {
		const interviewId = new UniqueEntityID()

		const interviewQuestion = InterviewQuestion.create({
			question: 'Medical history question',
			options: ['Yes', 'No', 'Unsure'],
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.assignToInterview(interviewId)

		expect(interviewQuestion.interviewId).toBe(interviewId)
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to delete an interview question', async () => {
		const interviewQuestion = InterviewQuestion.create({
			question: 'Question to be deleted',
			options: ['Option 1', 'Option 2'],
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.delete()

		expect(interviewQuestion.deletedAt).toBeInstanceOf(Date)
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should handle multiple option types', () => {
		const testCases = [
			{
				question: 'Yes/No question',
				options: ['Yes', 'No'],
			},
			{
				question: 'Scale question',
				options: ['1', '2', '3', '4', '5'],
			},
			{
				question: 'Frequency question',
				options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'],
			},
			{
				question: 'Single option',
				options: ['Only option'],
			},
		]

		testCases.forEach(({ question, options }) => {
			const interviewQuestion = InterviewQuestion.create({
				question,
				options,
			})

			expect(interviewQuestion.question).toBe(question)
			expect(interviewQuestion.options).toEqual(options)
			expect(interviewQuestion.options.length).toBe(options.length)
		})
	})

	it('Should be able to update question and options together', async () => {
		const interviewQuestion = InterviewQuestion.create({
			question: 'Original question',
			options: ['Old option 1', 'Old option 2'],
		})

		const oldUpdatedAt = interviewQuestion.updatedAt

		await delay(10)

		interviewQuestion.changeQuestion('New question text')
		interviewQuestion.updateOptions([
			'New option 1',
			'New option 2',
			'New option 3',
		])

		expect(interviewQuestion.question).toBe('New question text')
		expect(interviewQuestion.options).toEqual([
			'New option 1',
			'New option 2',
			'New option 3',
		])
		expect(interviewQuestion.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should maintain interview assignment through updates', async () => {
		const interviewId = new UniqueEntityID()

		const interviewQuestion = InterviewQuestion.create({
			question: 'Question with interview',
			options: ['Yes', 'No'],
		})

		interviewQuestion.assignToInterview(interviewId)

		await delay(10)

		interviewQuestion.changeQuestion('Updated question')
		interviewQuestion.updateOptions(['Updated Yes', 'Updated No'])
		interviewQuestion.toggleRequired()

		expect(interviewQuestion.interviewId).toBe(interviewId)
	})
})
