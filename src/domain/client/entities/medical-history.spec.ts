import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { MEDICAL_RECORD_TYPE } from './interfaces/medical-history.type'
import { MedicalHistory } from './medical-history'

describe('MedicalHistory Entity', () => {
	it('Should be able to create a medical history with valid data', () => {
		const clientId = new UniqueEntityID()
		const date = faker.date.past()

		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.CONSULTATION,
			title: 'Routine Check-up',
			description: 'Annual routine medical examination',
			date,
			doctorName: faker.person.fullName(),
			institution: 'Hospital ABC',
			observations: 'Patient is in good health',
			clientId,
		})

		expect(medicalHistory.id).toBeInstanceOf(UniqueEntityID)
		expect(medicalHistory.type).toBe(MEDICAL_RECORD_TYPE.CONSULTATION)
		expect(medicalHistory.title).toBe('Routine Check-up')
		expect(medicalHistory.description).toBe(
			'Annual routine medical examination',
		)
		expect(medicalHistory.date).toBe(date)
		expect(medicalHistory.clientId).toBe(clientId)
		expect(medicalHistory.files).toEqual([])
		expect(medicalHistory.createdAt).toBeInstanceOf(Date)
		expect(medicalHistory.updatedAt).toBeInstanceOf(Date)
		expect(medicalHistory.deletedAt).toBeUndefined()
		expect(medicalHistory.interviewId).toBeUndefined()
	})

	it('Should be able to update title and description', async () => {
		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.EXAM,
			title: 'Blood Test',
			description: 'Complete blood count',
			date: faker.date.past(),
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.updateTitle('Blood Test - Results')
		medicalHistory.updateDescription('Complete blood count with lipid panel')

		expect(medicalHistory.title).toBe('Blood Test - Results')
		expect(medicalHistory.description).toBe(
			'Complete blood count with lipid panel',
		)
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to update observations', async () => {
		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.SURGERY,
			title: 'Appendectomy',
			description: 'Surgical removal of appendix',
			date: faker.date.past(),
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.updateObservations(
			'Surgery was successful, patient recovering well',
		)

		expect(medicalHistory.observations).toBe(
			'Surgery was successful, patient recovering well',
		)
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to add and remove files', async () => {
		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.HOSPITALIZATION,
			title: 'Emergency Admission',
			description: 'Patient admitted with chest pain',
			date: faker.date.past(),
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.addFile('https://example.com/file1.pdf')
		medicalHistory.addFile('https://example.com/file2.pdf')

		expect(medicalHistory.files).toEqual([
			'https://example.com/file1.pdf',
			'https://example.com/file2.pdf',
		])
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)

		const secondUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.removeFile('https://example.com/file1.pdf')

		expect(medicalHistory.files).toEqual(['https://example.com/file2.pdf'])
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			secondUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign to an interview', async () => {
		const interviewId = new UniqueEntityID()

		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.VACCINATION,
			title: 'COVID-19 Vaccine',
			description: 'First dose of COVID-19 vaccine',
			date: faker.date.past(),
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.assignToInterview(interviewId)

		expect(medicalHistory.interviewId).toBe(interviewId)
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to delete a medical history', async () => {
		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.ALLERGY,
			title: 'Penicillin Allergy',
			description: 'Patient has severe allergic reaction to penicillin',
			date: faker.date.past(),
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medicalHistory.updatedAt

		await delay(10)

		medicalHistory.delete()

		expect(medicalHistory.deletedAt).toBeInstanceOf(Date)
		expect(medicalHistory.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to create with pre-existing files', () => {
		const files = [
			'https://example.com/report1.pdf',
			'https://example.com/report2.pdf',
		]

		const medicalHistory = MedicalHistory.create({
			type: MEDICAL_RECORD_TYPE.CHRONIC_CONDITION,
			title: 'Diabetes Management',
			description: 'Ongoing diabetes care',
			date: faker.date.past(),
			files,
			clientId: new UniqueEntityID(),
		})

		expect(medicalHistory.files).toEqual(files)
		expect(medicalHistory.type).toBe(MEDICAL_RECORD_TYPE.CHRONIC_CONDITION)
	})
})
