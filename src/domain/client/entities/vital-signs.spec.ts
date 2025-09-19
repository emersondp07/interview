import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { VitalSigns } from './vital-signs'

describe('VitalSigns Entity', () => {
	it('Should be able to create vital signs with valid data', () => {
		const clientId = new UniqueEntityID()
		const measuredAt = faker.date.recent()

		const vitalSigns = VitalSigns.create({
			systolicPressure: 120,
			diastolicPressure: 80,
			heartRate: 72,
			temperature: 36.5,
			weight: 70.5,
			height: 175,
			respiratoryRate: 16,
			oxygenSaturation: 98,
			glucose: 90,
			observations: 'Normal vital signs',
			measuredAt,
			clientId,
		})

		expect(vitalSigns.id).toBeInstanceOf(UniqueEntityID)
		expect(vitalSigns.systolicPressure).toBe(120)
		expect(vitalSigns.diastolicPressure).toBe(80)
		expect(vitalSigns.heartRate).toBe(72)
		expect(vitalSigns.temperature).toBe(36.5)
		expect(vitalSigns.weight).toBe(70.5)
		expect(vitalSigns.height).toBe(175)
		expect(vitalSigns.respiratoryRate).toBe(16)
		expect(vitalSigns.oxygenSaturation).toBe(98)
		expect(vitalSigns.glucose).toBe(90)
		expect(vitalSigns.observations).toBe('Normal vital signs')
		expect(vitalSigns.measuredAt).toBe(measuredAt)
		expect(vitalSigns.clientId).toBe(clientId)
		expect(vitalSigns.createdAt).toBeInstanceOf(Date)
		expect(vitalSigns.updatedAt).toBeInstanceOf(Date)
		expect(vitalSigns.deletedAt).toBeUndefined()
		expect(vitalSigns.interviewId).toBeUndefined()
	})

	it('Should be able to update blood pressure', async () => {
		const vitalSigns = VitalSigns.create({
			systolicPressure: 120,
			diastolicPressure: 80,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updatePressure(130, 85)

		expect(vitalSigns.systolicPressure).toBe(130)
		expect(vitalSigns.diastolicPressure).toBe(85)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to update heart rate', async () => {
		const vitalSigns = VitalSigns.create({
			heartRate: 72,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updateHeartRate(85)

		expect(vitalSigns.heartRate).toBe(85)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to update temperature', async () => {
		const vitalSigns = VitalSigns.create({
			temperature: 36.5,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updateTemperature(37.2)

		expect(vitalSigns.temperature).toBe(37.2)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to update weight and height', async () => {
		const vitalSigns = VitalSigns.create({
			weight: 70,
			height: 175,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updateWeight(72.5)
		vitalSigns.updateHeight(176)

		expect(vitalSigns.weight).toBe(72.5)
		expect(vitalSigns.height).toBe(176)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to update respiratory measurements', async () => {
		const vitalSigns = VitalSigns.create({
			respiratoryRate: 16,
			oxygenSaturation: 98,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updateRespiratoryRate(18)
		vitalSigns.updateOxygenSaturation(96)

		expect(vitalSigns.respiratoryRate).toBe(18)
		expect(vitalSigns.oxygenSaturation).toBe(96)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to update glucose and observations', async () => {
		const vitalSigns = VitalSigns.create({
			glucose: 90,
			observations: 'Normal readings',
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.updateGlucose(110)
		vitalSigns.updateObservations('Slightly elevated glucose')

		expect(vitalSigns.glucose).toBe(110)
		expect(vitalSigns.observations).toBe('Slightly elevated glucose')
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to assign to an interview', async () => {
		const interviewId = new UniqueEntityID()

		const vitalSigns = VitalSigns.create({
			heartRate: 72,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.assignToInterview(interviewId)

		expect(vitalSigns.interviewId).toBe(interviewId)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to delete vital signs', async () => {
		const vitalSigns = VitalSigns.create({
			heartRate: 72,
			temperature: 36.5,
			clientId: new UniqueEntityID(),
		})

		const oldUpdatedAt = vitalSigns.updatedAt

		await delay(10)

		vitalSigns.delete()

		expect(vitalSigns.deletedAt).toBeInstanceOf(Date)
		expect(vitalSigns.updatedAt?.getTime()).toBeGreaterThan(
			oldUpdatedAt?.getTime() || 0,
		)
	})

	it('Should be able to create with minimal data', () => {
		const clientId = new UniqueEntityID()

		const vitalSigns = VitalSigns.create({
			clientId,
		})

		expect(vitalSigns.clientId).toBe(clientId)
		expect(vitalSigns.measuredAt).toBeInstanceOf(Date)
		expect(vitalSigns.createdAt).toBeInstanceOf(Date)
		expect(vitalSigns.updatedAt).toBeInstanceOf(Date)
		expect(vitalSigns.systolicPressure).toBeUndefined()
		expect(vitalSigns.diastolicPressure).toBeUndefined()
		expect(vitalSigns.heartRate).toBeUndefined()
	})
})
