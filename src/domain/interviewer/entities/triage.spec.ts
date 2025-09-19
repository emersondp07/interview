import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { Triage } from './triage'

describe('Triage Entity', () => {
	it('Should be able to create a triage with valid data', () => {
		const clientId = new UniqueEntityID()
		const nurseName = faker.person.fullName()
		const notes = 'Patient appears stable, no immediate concerns'

		const triage = Triage.create({
			notes,
			nurseName,
			clientId,
		})

		expect(triage.id).toBeInstanceOf(UniqueEntityID)
		expect(triage.notes).toBe(notes)
		expect(triage.nurseName).toBe(nurseName)
		expect(triage.clientId).toBe(clientId)
		expect(triage.createdAt).toBeInstanceOf(Date)
		expect(triage.updatedAt).toBeInstanceOf(Date)
		expect(triage.deletedAt).toBeUndefined()
		expect(triage.vitalSigns).toBeUndefined()
	})

	it('Should be able to create triage without notes', () => {
		const triage = Triage.create({
			nurseName: 'Nurse Johnson',
			clientId: new UniqueEntityID(),
		})

		expect(triage.nurseName).toBe('Nurse Johnson')
		expect(triage.notes).toBeUndefined()
	})

	it('Should be able to create triage with vital signs', () => {
		const vitalSigns = {
			bloodPressure: '120/80',
			heartRate: 72,
			temperature: 36.5,
			respiratoryRate: 16,
		}

		const triage = Triage.create({
			nurseName: 'Nurse Smith',
			vitalSigns,
			clientId: new UniqueEntityID(),
		})

		expect(triage.vitalSigns).toEqual(vitalSigns)
		expect(triage.nurseName).toBe('Nurse Smith')
	})

	it('Should be able to update notes', async () => {
		const triage = Triage.create({
			notes: 'Initial assessment',
			nurseName: 'Nurse Brown',
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = triage.updatedAt

		await delay(10)

		triage.updateNotes('Updated assessment: Patient shows improvement')

		expect(triage.notes).toBe('Updated assessment: Patient shows improvement')
		expect(triage.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able to update vital signs', async () => {
		const initialVitalSigns = {
			bloodPressure: '120/80',
			heartRate: 72,
		}

		const updatedVitalSigns = {
			bloodPressure: '130/85',
			heartRate: 78,
			temperature: 37.1,
		}

		const triage = Triage.create({
			nurseName: 'Nurse Wilson',
			vitalSigns: initialVitalSigns,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = triage.updatedAt

		await delay(10)

		triage.updateVitalSigns(updatedVitalSigns)

		expect(triage.vitalSigns).toEqual(updatedVitalSigns)
		expect(triage.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able to change nurse name', async () => {
		const triage = Triage.create({
			nurseName: 'Nurse Davis',
			notes: 'Patient triaged successfully',
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = triage.updatedAt

		await delay(10)

		triage.changeNurseName('Nurse Martinez')

		expect(triage.nurseName).toBe('Nurse Martinez')
		expect(triage.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able to delete a triage', async () => {
		const triage = Triage.create({
			nurseName: 'Nurse Thompson',
			notes: 'Triage to be deleted',
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = triage.updatedAt

		await delay(10)

		triage.delete()

		expect(triage.deletedAt).toBeInstanceOf(Date)
		expect(triage.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should be able to update multiple properties', async () => {
		const triage = Triage.create({
			nurseName: 'Original Nurse',
			notes: 'Original notes',
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = triage.updatedAt

		await delay(10)

		const newVitalSigns = {
			bloodPressure: '140/90',
			heartRate: 85,
			temperature: 38.2,
			respiratoryRate: 20,
			oxygenSaturation: 96,
		}

		triage.updateNotes('Updated comprehensive notes')
		triage.updateVitalSigns(newVitalSigns)
		triage.changeNurseName('Updated Nurse')

		expect(triage.notes).toBe('Updated comprehensive notes')
		expect(triage.vitalSigns).toEqual(newVitalSigns)
		expect(triage.nurseName).toBe('Updated Nurse')
		expect(triage.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})

	it('Should handle complex vital signs data', () => {
		const complexVitalSigns = {
			bloodPressure: {
				systolic: 120,
				diastolic: 80,
				timestamp: new Date(),
			},
			heartRate: 72,
			temperature: {
				celsius: 36.5,
				fahrenheit: 97.7,
			},
			respiratoryRate: 16,
			oxygenSaturation: 98,
			glucose: 90,
			painScale: 2,
			consciousness: 'Alert and oriented',
			notes: 'Stable vital signs',
		}

		const triage = Triage.create({
			nurseName: 'Nurse Rodriguez',
			vitalSigns: complexVitalSigns,
			clientId: new UniqueEntityID(),
		})

		expect(triage.vitalSigns).toEqual(complexVitalSigns)
		expect(triage.vitalSigns.bloodPressure.systolic).toBe(120)
		expect(triage.vitalSigns.temperature.celsius).toBe(36.5)
	})

	it('Should maintain client relationship through updates', () => {
		const clientId = new UniqueEntityID()

		const triage = Triage.create({
			nurseName: 'Nurse Garcia',
			notes: 'Initial triage',
			clientId,
		})

		// Update properties
		triage.updateNotes('Updated notes')
		triage.changeNurseName('Different Nurse')
		triage.updateVitalSigns({ heartRate: 80 })

		// Client relationship should remain unchanged
		expect(triage.clientId).toBe(clientId)
	})

	it('Should handle edge cases with empty and null data', () => {
		const triage = Triage.create({
			nurseName: 'Nurse Lee',
			notes: '',
			clientId: new UniqueEntityID(),
		})

		expect(triage.notes).toBe('')
		expect(triage.nurseName).toBe('Nurse Lee')

		// Update with empty/null values
		triage.updateNotes('')
		triage.updateVitalSigns(null)

		expect(triage.notes).toBe('')
		expect(triage.vitalSigns).toBe(null)
	})

	it('Should create triage with minimal required data', () => {
		const clientId = new UniqueEntityID()

		const triage = Triage.create({
			nurseName: 'Minimum Nurse',
			clientId,
		})

		expect(triage.nurseName).toBe('Minimum Nurse')
		expect(triage.clientId).toBe(clientId)
		expect(triage.createdAt).toBeInstanceOf(Date)
		expect(triage.updatedAt).toBeInstanceOf(Date)
		expect(triage.notes).toBeUndefined()
		expect(triage.vitalSigns).toBeUndefined()
		expect(triage.deletedAt).toBeUndefined()
	})

	it('Should handle sequential vital signs updates', async () => {
		const triage = Triage.create({
			nurseName: 'Nurse Anderson',
			clientId: new UniqueEntityID(),
		})

		// First vital signs reading
		const firstReading = { heartRate: 70, temperature: 36.5 }
		triage.updateVitalSigns(firstReading)

		await delay(10)

		// Second vital signs reading
		const secondReading = {
			heartRate: 75,
			temperature: 36.8,
			bloodPressure: '125/82',
		}
		triage.updateVitalSigns(secondReading)

		await delay(10)

		// Third vital signs reading
		const thirdReading = {
			heartRate: 72,
			temperature: 36.6,
			bloodPressure: '120/80',
			respiratoryRate: 18,
		}
		triage.updateVitalSigns(thirdReading)

		expect(triage.vitalSigns).toEqual(thirdReading)
		expect(triage.vitalSigns.respiratoryRate).toBe(18)
	})
})
