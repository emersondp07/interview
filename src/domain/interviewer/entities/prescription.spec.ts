import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { PRESCRIPTION_STATUS } from './interfaces/prescription.type'
import { Prescription } from './prescription'

describe('Prescription Entity', () => {
	it('Should be able to create a prescription with valid data', () => {
		const clientId = new UniqueEntityID()
		const interviewerId = new UniqueEntityID()

		const prescription = Prescription.create({
			diagnosis: 'Acute bronchitis',
			instructions: 'Complete the full course of antibiotics',
			clientId,
			interviewerId,
		})

		expect(prescription.id).toBeInstanceOf(UniqueEntityID)
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.ACTIVE)
		expect(prescription.diagnosis).toBe('Acute bronchitis')
		expect(prescription.instructions).toBe(
			'Complete the full course of antibiotics',
		)
		expect(prescription.clientId).toBe(clientId)
		expect(prescription.interviewerId).toBe(interviewerId)
		expect(prescription.createdAt).toBeInstanceOf(Date)
		expect(prescription.updatedAt).toBeInstanceOf(Date)
		expect(prescription.deletedAt).toBeUndefined()
		expect(prescription.interviewId).toBeUndefined()
	})

	it('Should be able to create prescription without instructions', () => {
		const prescription = Prescription.create({
			diagnosis: 'Mild headache',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		expect(prescription.diagnosis).toBe('Mild headache')
		expect(prescription.instructions).toBeUndefined()
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.ACTIVE)
	})

	it('Should be able to change prescription status', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Hypertension',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.changeStatus(PRESCRIPTION_STATUS.COMPLETED)

		expect(prescription.status).toBe(PRESCRIPTION_STATUS.COMPLETED)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to update diagnosis', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Initial diagnosis',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.updateDiagnosis('Updated diagnosis after further examination')

		expect(prescription.diagnosis).toBe(
			'Updated diagnosis after further examination',
		)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to update instructions', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Diabetes Type 2',
			instructions: 'Monitor blood sugar levels',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.updateInstructions(
			'Monitor blood sugar levels twice daily and maintain diet',
		)

		expect(prescription.instructions).toBe(
			'Monitor blood sugar levels twice daily and maintain diet',
		)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to assign to an interview', async () => {
		const interviewId = new UniqueEntityID()

		const prescription = Prescription.create({
			diagnosis: 'Post-surgery care',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.assignToInterview(interviewId)

		expect(prescription.interviewId).toBe(interviewId)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to cancel a prescription', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Allergic reaction',
			instructions: 'Take antihistamine as needed',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.cancel()

		expect(prescription.status).toBe(PRESCRIPTION_STATUS.CANCELED)
		expect(prescription.deletedAt).toBeInstanceOf(Date)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should handle all prescription statuses', () => {
		const statuses = [
			PRESCRIPTION_STATUS.ACTIVE,
			PRESCRIPTION_STATUS.COMPLETED,
			PRESCRIPTION_STATUS.SUSPENDED,
			PRESCRIPTION_STATUS.CANCELED,
		]

		statuses.forEach((status) => {
			const prescription = Prescription.create({
				status,
				diagnosis: faker.lorem.sentence(),
				clientId: new UniqueEntityID(),
				interviewerId: new UniqueEntityID(),
			})

			expect(prescription.status).toBe(status)
			expect(prescription.id).toBeInstanceOf(UniqueEntityID)
		})
	})

	it('Should be able to update multiple properties', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Original diagnosis',
			instructions: 'Original instructions',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		const oldUpdatedAt = prescription.updatedAt

		await delay(10)

		prescription.updateDiagnosis('Updated diagnosis')
		prescription.updateInstructions('Updated instructions')
		prescription.changeStatus(PRESCRIPTION_STATUS.SUSPENDED)

		expect(prescription.diagnosis).toBe('Updated diagnosis')
		expect(prescription.instructions).toBe('Updated instructions')
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.SUSPENDED)
		expect(prescription.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should maintain client and interviewer relationships', () => {
		const clientId = new UniqueEntityID()
		const interviewerId = new UniqueEntityID()

		const prescription = Prescription.create({
			diagnosis: 'Test diagnosis',
			clientId,
			interviewerId,
		})

		// Update properties
		prescription.updateDiagnosis('Updated diagnosis')
		prescription.changeStatus(PRESCRIPTION_STATUS.COMPLETED)

		// Relationships should remain unchanged
		expect(prescription.clientId).toBe(clientId)
		expect(prescription.interviewerId).toBe(interviewerId)
	})

	it('Should be able to transition through different statuses', async () => {
		const prescription = Prescription.create({
			diagnosis: 'Chronic condition',
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		// Start as ACTIVE
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.ACTIVE)

		await delay(10)

		// Suspend the prescription
		prescription.changeStatus(PRESCRIPTION_STATUS.SUSPENDED)
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.SUSPENDED)

		await delay(10)

		// Reactivate the prescription
		prescription.changeStatus(PRESCRIPTION_STATUS.ACTIVE)
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.ACTIVE)

		await delay(10)

		// Complete the prescription
		prescription.changeStatus(PRESCRIPTION_STATUS.COMPLETED)
		expect(prescription.status).toBe(PRESCRIPTION_STATUS.COMPLETED)
	})

	it('Should handle prescription with interview assignment from creation', () => {
		const interviewId = new UniqueEntityID()

		const prescription = Prescription.create({
			diagnosis: 'Post-consultation prescription',
			instructions: 'Follow up in 2 weeks',
			interviewId,
			clientId: new UniqueEntityID(),
			interviewerId: new UniqueEntityID(),
		})

		expect(prescription.interviewId).toBe(interviewId)
		expect(prescription.diagnosis).toBe('Post-consultation prescription')
	})
})
