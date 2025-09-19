import { VitalSigns } from './vital-signs'

describe('VitalSigns Value Object', () => {
	const createValidVitalSigns = () => ({
		systolicBP: 120,
		diastolicBP: 80,
		heartRate: 70,
		temperature: 36.5,
		respiratoryRate: 16,
		oxygenSaturation: 98,
		weight: 70,
		height: 170,
	})

	it('Should be able to create valid vital signs', () => {
		const props = createValidVitalSigns()
		const vitalSigns = VitalSigns.create(props)

		expect(vitalSigns.systolicBP).toBe(120)
		expect(vitalSigns.diastolicBP).toBe(80)
		expect(vitalSigns.heartRate).toBe(70)
		expect(vitalSigns.temperature).toBe(36.5)
		expect(vitalSigns.respiratoryRate).toBe(16)
		expect(vitalSigns.oxygenSaturation).toBe(98)
		expect(vitalSigns.weight).toBe(70)
		expect(vitalSigns.height).toBe(170)
	})

	it('Should be able to create vital signs without optional weight and height', () => {
		const props = {
			systolicBP: 120,
			diastolicBP: 80,
			heartRate: 70,
			temperature: 36.5,
			respiratoryRate: 16,
			oxygenSaturation: 98,
		}
		const vitalSigns = VitalSigns.create(props)

		expect(vitalSigns.weight).toBeUndefined()
		expect(vitalSigns.height).toBeUndefined()
		expect(vitalSigns.bmi).toBeUndefined()
		expect(vitalSigns.bmiCategory).toBeUndefined()
	})

	it('Should calculate BMI correctly when weight and height are provided', () => {
		const vitalSigns = VitalSigns.create(createValidVitalSigns())

		expect(vitalSigns.bmi).toBe(24.2)
		expect(vitalSigns.bmiCategory).toBe('Normal')
	})

	it('Should categorize blood pressure correctly', () => {
		const normal = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 115,
			diastolicBP: 75,
		})
		const elevated = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 125,
			diastolicBP: 75,
		})
		const stage1 = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 135,
			diastolicBP: 85,
		})
		const stage2 = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 150,
			diastolicBP: 95,
		})
		const crisis = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 185,
			diastolicBP: 125,
		})

		expect(normal.bloodPressureCategory).toBe('Normal')
		expect(elevated.bloodPressureCategory).toBe('Elevated')
		expect(stage1.bloodPressureCategory).toBe('Stage 1 Hypertension')
		expect(stage2.bloodPressureCategory).toBe('Stage 2 Hypertension')
		expect(crisis.bloodPressureCategory).toBe('Hypertensive Crisis')
	})

	it('Should categorize temperature correctly', () => {
		const hypothermia = VitalSigns.create({
			...createValidVitalSigns(),
			temperature: 35.5,
		})
		const normal = VitalSigns.create({
			...createValidVitalSigns(),
			temperature: 36.8,
		})
		const lowFever = VitalSigns.create({
			...createValidVitalSigns(),
			temperature: 37.5,
		})
		const moderateFever = VitalSigns.create({
			...createValidVitalSigns(),
			temperature: 38.5,
		})
		const highFever = VitalSigns.create({
			...createValidVitalSigns(),
			temperature: 39.5,
		})

		expect(hypothermia.temperatureCategory).toBe('Hypothermia')
		expect(normal.temperatureCategory).toBe('Normal')
		expect(lowFever.temperatureCategory).toBe('Low Fever')
		expect(moderateFever.temperatureCategory).toBe('Moderate Fever')
		expect(highFever.temperatureCategory).toBe('High Fever')
	})

	it('Should categorize heart rate correctly', () => {
		const bradycardia = VitalSigns.create({
			...createValidVitalSigns(),
			heartRate: 55,
		})
		const normal = VitalSigns.create({
			...createValidVitalSigns(),
			heartRate: 80,
		})
		const tachycardia = VitalSigns.create({
			...createValidVitalSigns(),
			heartRate: 110,
		})

		expect(bradycardia.heartRateCategory).toBe('Bradycardia')
		expect(normal.heartRateCategory).toBe('Normal')
		expect(tachycardia.heartRateCategory).toBe('Tachycardia')
	})

	it('Should categorize BMI correctly', () => {
		const underweight = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 50,
			height: 170,
		})
		const normal = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 70,
			height: 170,
		})
		const overweight = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 80,
			height: 170,
		})
		const obese = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 95,
			height: 170,
		})

		expect(underweight.bmiCategory).toBe('Underweight')
		expect(normal.bmiCategory).toBe('Normal')
		expect(overweight.bmiCategory).toBe('Overweight')
		expect(obese.bmiCategory).toBe('Obese')
	})

	it('Should not accept invalid systolic blood pressure', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), systolicBP: 60 }),
		).toThrow('Systolic blood pressure must be between 70-250 mmHg')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), systolicBP: 260 }),
		).toThrow('Systolic blood pressure must be between 70-250 mmHg')
	})

	it('Should not accept invalid diastolic blood pressure', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), diastolicBP: 30 }),
		).toThrow('Diastolic blood pressure must be between 40-150 mmHg')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), diastolicBP: 160 }),
		).toThrow('Diastolic blood pressure must be between 40-150 mmHg')
	})

	it('Should not accept systolic pressure lower than or equal to diastolic', () => {
		expect(() =>
			VitalSigns.create({
				...createValidVitalSigns(),
				systolicBP: 80,
				diastolicBP: 80,
			}),
		).toThrow('Systolic pressure must be higher than diastolic')
		expect(() =>
			VitalSigns.create({
				...createValidVitalSigns(),
				systolicBP: 75,
				diastolicBP: 80,
			}),
		).toThrow('Systolic pressure must be higher than diastolic')
	})

	it('Should not accept invalid heart rate', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), heartRate: 25 }),
		).toThrow('Heart rate must be between 30-220 bpm')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), heartRate: 230 }),
		).toThrow('Heart rate must be between 30-220 bpm')
	})

	it('Should not accept invalid temperature', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), temperature: 30 }),
		).toThrow('Temperature must be between 32-45°C')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), temperature: 50 }),
		).toThrow('Temperature must be between 32-45°C')
	})

	it('Should not accept invalid respiratory rate', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), respiratoryRate: 5 }),
		).toThrow('Respiratory rate must be between 8-60 rpm')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), respiratoryRate: 70 }),
		).toThrow('Respiratory rate must be between 8-60 rpm')
	})

	it('Should not accept invalid oxygen saturation', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), oxygenSaturation: 65 }),
		).toThrow('Oxygen saturation must be between 70-100%')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), oxygenSaturation: 105 }),
		).toThrow('Oxygen saturation must be between 70-100%')
	})

	it('Should not accept invalid weight', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), weight: 0.3 }),
		).toThrow('Weight must be between 0.5-500 kg')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), weight: 600 }),
		).toThrow('Weight must be between 0.5-500 kg')
	})

	it('Should not accept invalid height', () => {
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), height: 25 }),
		).toThrow('Height must be between 30-250 cm')
		expect(() =>
			VitalSigns.create({ ...createValidVitalSigns(), height: 300 }),
		).toThrow('Height must be between 30-250 cm')
	})

	it('Should convert to JSON correctly', () => {
		const props = createValidVitalSigns()
		const vitalSigns = VitalSigns.create(props)
		const json = vitalSigns.toJSON()

		expect(json).toEqual(props)
	})

	it('Should create from JSON correctly', () => {
		const json = createValidVitalSigns()
		const vitalSigns = VitalSigns.fromJSON(json)

		expect(vitalSigns.systolicBP).toBe(json.systolicBP)
		expect(vitalSigns.diastolicBP).toBe(json.diastolicBP)
		expect(vitalSigns.heartRate).toBe(json.heartRate)
		expect(vitalSigns.temperature).toBe(json.temperature)
		expect(vitalSigns.respiratoryRate).toBe(json.respiratoryRate)
		expect(vitalSigns.oxygenSaturation).toBe(json.oxygenSaturation)
		expect(vitalSigns.weight).toBe(json.weight)
		expect(vitalSigns.height).toBe(json.height)
	})

	it('Should check equality between vital signs', () => {
		const props = createValidVitalSigns()
		const vitalSigns1 = VitalSigns.create(props)
		const vitalSigns2 = VitalSigns.create(props)
		const vitalSigns3 = VitalSigns.create({ ...props, heartRate: 80 })

		expect(vitalSigns1.equals(vitalSigns2)).toBe(true)
		expect(vitalSigns1.equals(vitalSigns3)).toBe(false)
	})

	it('Should handle edge cases in blood pressure categorization', () => {
		const exactNormal = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 115,
			diastolicBP: 75,
		})
		const exactElevated = VitalSigns.create({
			...createValidVitalSigns(),
			systolicBP: 125,
			diastolicBP: 75,
		})

		expect(exactNormal.bloodPressureCategory).toBe('Normal')
		expect(exactElevated.bloodPressureCategory).toBe('Elevated')
	})

	it('Should handle BMI calculation with different heights and weights', () => {
		const tall = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 80,
			height: 190,
		})
		const short = VitalSigns.create({
			...createValidVitalSigns(),
			weight: 60,
			height: 150,
		})

		expect(tall.bmi).toBe(22.2)
		expect(short.bmi).toBe(26.7)
		expect(tall.bmiCategory).toBe('Normal')
		expect(short.bmiCategory).toBe('Overweight')
	})
})
