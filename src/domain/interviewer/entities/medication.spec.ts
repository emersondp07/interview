import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { MEDICATION_FREQUENCY } from './interfaces/medication.type'
import { Medication } from './medication'

describe('Medication Entity', () => {
	it('Should be able to create a medication with valid data', () => {
		const prescriptionId = new UniqueEntityID()

		const medication = Medication.create({
			name: 'Ibuprofen',
			dosage: '400mg',
			frequency: MEDICATION_FREQUENCY.TWICE_DAILY,
			duration: '7 days',
			instructions: 'Take with food',
			prescriptionId,
		})

		expect(medication.id).toBeInstanceOf(UniqueEntityID)
		expect(medication.name).toBe('Ibuprofen')
		expect(medication.dosage).toBe('400mg')
		expect(medication.frequency).toBe(MEDICATION_FREQUENCY.TWICE_DAILY)
		expect(medication.duration).toBe('7 days')
		expect(medication.instructions).toBe('Take with food')
		expect(medication.prescriptionId).toBe(prescriptionId)
		expect(medication.createdAt).toBeInstanceOf(Date)
		expect(medication.updatedAt).toBeInstanceOf(Date)
		expect(medication.deletedAt).toBeUndefined()
	})

	it('Should be able to create medication without instructions', () => {
		const medication = Medication.create({
			name: 'Aspirin',
			dosage: '100mg',
			frequency: MEDICATION_FREQUENCY.ONCE_DAILY,
			duration: '30 days',
			prescriptionId: new UniqueEntityID(),
		})

		expect(medication.name).toBe('Aspirin')
		expect(medication.instructions).toBeUndefined()
	})

	it('Should be able to change medication name', async () => {
		const medication = Medication.create({
			name: 'Generic Ibuprofen',
			dosage: '200mg',
			frequency: MEDICATION_FREQUENCY.THREE_TIMES_DAILY,
			duration: '5 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.changeName('Advil')

		expect(medication.name).toBe('Advil')
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to change dosage', async () => {
		const medication = Medication.create({
			name: 'Paracetamol',
			dosage: '500mg',
			frequency: MEDICATION_FREQUENCY.FOUR_TIMES_DAILY,
			duration: '3 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.changeDosage('1000mg')

		expect(medication.dosage).toBe('1000mg')
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to change frequency', async () => {
		const medication = Medication.create({
			name: 'Antibiotic',
			dosage: '250mg',
			frequency: MEDICATION_FREQUENCY.TWICE_DAILY,
			duration: '10 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.changeFrequency(MEDICATION_FREQUENCY.EVERY_8_HOURS)

		expect(medication.frequency).toBe(MEDICATION_FREQUENCY.EVERY_8_HOURS)
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to change duration', async () => {
		const medication = Medication.create({
			name: 'Vitamins',
			dosage: '1 tablet',
			frequency: MEDICATION_FREQUENCY.ONCE_DAILY,
			duration: '30 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.changeDuration('90 days')

		expect(medication.duration).toBe('90 days')
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to update instructions', async () => {
		const medication = Medication.create({
			name: 'Pain Relief',
			dosage: '200mg',
			frequency: MEDICATION_FREQUENCY.AS_NEEDED,
			duration: 'As required',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.updateInstructions(
			'Take only when experiencing pain. Do not exceed 3 doses per day.',
		)

		expect(medication.instructions).toBe(
			'Take only when experiencing pain. Do not exceed 3 doses per day.',
		)
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should be able to delete a medication', async () => {
		const medication = Medication.create({
			name: 'Discontinued Med',
			dosage: '50mg',
			frequency: MEDICATION_FREQUENCY.TWICE_DAILY,
			duration: '14 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.delete()

		expect(medication.deletedAt).toBeInstanceOf(Date)
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should handle different frequency types', () => {
		const frequencies = [
			MEDICATION_FREQUENCY.ONCE_DAILY,
			MEDICATION_FREQUENCY.TWICE_DAILY,
			MEDICATION_FREQUENCY.THREE_TIMES_DAILY,
			MEDICATION_FREQUENCY.FOUR_TIMES_DAILY,
			MEDICATION_FREQUENCY.EVERY_6_HOURS,
			MEDICATION_FREQUENCY.EVERY_8_HOURS,
			MEDICATION_FREQUENCY.EVERY_12_HOURS,
			MEDICATION_FREQUENCY.AS_NEEDED,
		]

		frequencies.forEach((frequency) => {
			const medication = Medication.create({
				name: faker.science.chemicalElement().name,
				dosage: `${faker.number.int({ min: 50, max: 1000 })}mg`,
				frequency,
				duration: `${faker.number.int({ min: 1, max: 30 })} days`,
				prescriptionId: new UniqueEntityID(),
			})

			expect(medication.frequency).toBe(frequency)
			expect(medication.id).toBeInstanceOf(UniqueEntityID)
		})
	})

	it('Should be able to update multiple properties', async () => {
		const medication = Medication.create({
			name: 'Original Med',
			dosage: '100mg',
			frequency: MEDICATION_FREQUENCY.ONCE_DAILY,
			duration: '7 days',
			prescriptionId: new UniqueEntityID(),
		})

		const oldUpdatedAt = medication.updatedAt

		await delay(10)

		medication.changeName('Updated Med')
		medication.changeDosage('200mg')
		medication.changeFrequency(MEDICATION_FREQUENCY.TWICE_DAILY)
		medication.changeDuration('14 days')
		medication.updateInstructions('New instructions')

		expect(medication.name).toBe('Updated Med')
		expect(medication.dosage).toBe('200mg')
		expect(medication.frequency).toBe(MEDICATION_FREQUENCY.TWICE_DAILY)
		expect(medication.duration).toBe('14 days')
		expect(medication.instructions).toBe('New instructions')
		expect(medication.updatedAt.getTime()).toBeGreaterThan(
			oldUpdatedAt.getTime(),
		)
	})

	it('Should maintain prescription relationship', () => {
		const prescriptionId = new UniqueEntityID()

		const medication = Medication.create({
			name: 'Related Med',
			dosage: '50mg',
			frequency: MEDICATION_FREQUENCY.EVERY_6_HOURS,
			duration: '21 days',
			prescriptionId,
		})

		// Update properties
		medication.changeName('Updated Name')
		medication.changeDosage('75mg')

		// Prescription relationship should remain unchanged
		expect(medication.prescriptionId).toBe(prescriptionId)
	})
})
