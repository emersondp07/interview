import { RiskLevel, RiskScore } from './risk-score'
import { VitalSigns } from './vital-signs'

describe('RiskScore Value Object', () => {
	const createNormalVitalSigns = (): VitalSigns => {
		return VitalSigns.create({
			systolicBP: 120,
			diastolicBP: 80,
			heartRate: 70,
			temperature: 36.5,
			respiratoryRate: 16,
			oxygenSaturation: 98,
		})
	}

	const createAbnormalVitalSigns = (): VitalSigns => {
		return VitalSigns.create({
			systolicBP: 180,
			diastolicBP: 120,
			heartRate: 130,
			temperature: 39.5,
			respiratoryRate: 25,
			oxygenSaturation: 85,
		})
	}

	it('Should calculate low risk score for young healthy patient', () => {
		const vitalSigns = createNormalVitalSigns()
		const riskFactors = {
			age: 25,
			hasChronicConditions: false,
			smokingStatus: 'never' as const,
			bmi: 22,
			medicationCount: 0,
			symptomSeverity: 2,
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		expect(riskScore.level).toBe(RiskLevel.LOW)
		expect(riskScore.score).toBeLessThan(25)
		expect(riskScore.priority).toBe(4)
		expect(riskScore.color).toBe('#16A34A')
		expect(riskScore.recommendedAction).toBe('Routine follow-up recommended.')
	})

	it('Should calculate critical risk score for elderly patient with abnormal vitals', () => {
		const vitalSigns = createAbnormalVitalSigns()
		const riskFactors = {
			age: 85,
			hasChronicConditions: true,
			smokingStatus: 'current' as const,
			bmi: 35,
			medicationCount: 6,
			symptomSeverity: 9,
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		expect(riskScore.level).toBe(RiskLevel.CRITICAL)
		expect(riskScore.score).toBeGreaterThanOrEqual(75)
		expect(riskScore.priority).toBe(1)
		expect(riskScore.color).toBe('#DC2626')
		expect(riskScore.recommendedAction).toBe(
			'Immediate medical attention required. Contact emergency services.',
		)
	})

	it('Should calculate medium risk score for middle-aged patient', () => {
		const vitalSigns = VitalSigns.create({
			systolicBP: 135,
			diastolicBP: 85,
			heartRate: 85,
			temperature: 37.0,
			respiratoryRate: 18,
			oxygenSaturation: 96,
		})
		const riskFactors = {
			age: 55,
			hasChronicConditions: true,
			smokingStatus: 'former' as const,
			bmi: 28,
			medicationCount: 3,
			symptomSeverity: 5,
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		expect(riskScore.level).toBe(RiskLevel.MEDIUM)
		expect(riskScore.score).toBeGreaterThanOrEqual(25)
		expect(riskScore.score).toBeLessThan(50)
		expect(riskScore.priority).toBe(3)
		expect(riskScore.color).toBe('#CA8A04')
		expect(riskScore.recommendedAction).toBe(
			'Schedule medical appointment within 7 days.',
		)
	})

	it('Should calculate high risk score for patient with moderate symptoms', () => {
		const vitalSigns = VitalSigns.create({
			systolicBP: 145,
			diastolicBP: 90,
			heartRate: 95,
			temperature: 37.8,
			oxygenSaturation: 95,
			respiratoryRate: 16,
		})
		const riskFactors = {
			age: 65,
			hasChronicConditions: true,
			smokingStatus: 'former' as const,
			bmi: 30,
			medicationCount: 3,
			symptomSeverity: 6,
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		expect(riskScore.level).toBe(RiskLevel.HIGH)
		expect(riskScore.score).toBeGreaterThanOrEqual(50)
		expect(riskScore.score).toBeLessThan(75)
		expect(riskScore.priority).toBe(2)
		expect(riskScore.color).toBe('#EA580C')
		expect(riskScore.recommendedAction).toBe(
			'Urgent medical consultation needed within 24 hours.',
		)
	})

	it('Should create risk score from score value', () => {
		const riskScore = RiskScore.fromScore(60)

		expect(riskScore.score).toBe(60)
		expect(riskScore.level).toBe(RiskLevel.HIGH)
		expect(riskScore.factors).toEqual([])
	})

	it('Should identify risk factors correctly', () => {
		const vitalSigns = createAbnormalVitalSigns()
		const riskFactors = {
			age: 80,
			hasChronicConditions: true,
			smokingStatus: 'current' as const,
			bmi: 35,
			medicationCount: 5,
			symptomSeverity: 8,
		}

		const riskScore = RiskScore.calculate(vitalSigns, riskFactors)

		expect(riskScore.factors).toContain('Hypertensive Crisis')
		expect(riskScore.factors).toContain('Abnormal Heart Rate')
		expect(riskScore.factors).toContain('Abnormal Temperature')
		expect(riskScore.factors).toContain('Low Oxygen Saturation')
		expect(riskScore.factors).toContain('Advanced Age (80+)')
		expect(riskScore.factors).toContain('Chronic Medical Conditions')
		expect(riskScore.factors).toContain('Current Smoker')
		expect(riskScore.factors).toContain('Severe Obesity (BMI ≥35)')
		expect(riskScore.factors).toContain('Multiple Medications (≥5)')
		expect(riskScore.factors).toContain('Severe Symptoms')
	})

	it('Should handle BMI edge cases', () => {
		const vitalSigns = createNormalVitalSigns()

		const underweightRisk = RiskScore.calculate(vitalSigns, {
			age: 30,
			hasChronicConditions: false,
			smokingStatus: 'never' as const,
			bmi: 17,
			medicationCount: 0,
			symptomSeverity: 1,
		})

		expect(underweightRisk.factors).toContain('Underweight (BMI <18.5)')

		const obeseRisk = RiskScore.calculate(vitalSigns, {
			age: 30,
			hasChronicConditions: false,
			smokingStatus: 'never' as const,
			bmi: 32,
			medicationCount: 0,
			symptomSeverity: 1,
		})

		expect(obeseRisk.factors).toContain('Obesity (BMI 30-34.9)')
	})

	it('Should compare risk scores correctly', () => {
		const lowRisk = RiskScore.fromScore(15)
		const mediumRisk = RiskScore.fromScore(35)
		const highRisk = RiskScore.fromScore(60)

		expect(highRisk.isHigherThan(mediumRisk)).toBe(true)
		expect(mediumRisk.isHigherThan(lowRisk)).toBe(true)
		expect(lowRisk.isHigherThan(highRisk)).toBe(false)
	})

	it('Should check equality between risk scores', () => {
		const riskScore1 = RiskScore.fromScore(50)
		const riskScore2 = RiskScore.fromScore(50)
		const riskScore3 = RiskScore.fromScore(25)

		expect(riskScore1.equals(riskScore2)).toBe(true)
		expect(riskScore1.equals(riskScore3)).toBe(false)
	})

	it('Should format toString correctly', () => {
		const lowRisk = RiskScore.fromScore(15)
		const criticalRisk = RiskScore.fromScore(85)

		expect(lowRisk.toString()).toBe('LOW (15/100)')
		expect(criticalRisk.toString()).toBe('CRITICAL (85/100)')
	})

	it('Should determine risk levels based on score ranges', () => {
		expect(RiskScore.fromScore(10).level).toBe(RiskLevel.LOW)
		expect(RiskScore.fromScore(24).level).toBe(RiskLevel.LOW)
		expect(RiskScore.fromScore(25).level).toBe(RiskLevel.MEDIUM)
		expect(RiskScore.fromScore(49).level).toBe(RiskLevel.MEDIUM)
		expect(RiskScore.fromScore(50).level).toBe(RiskLevel.HIGH)
		expect(RiskScore.fromScore(74).level).toBe(RiskLevel.HIGH)
		expect(RiskScore.fromScore(75).level).toBe(RiskLevel.CRITICAL)
		expect(RiskScore.fromScore(100).level).toBe(RiskLevel.CRITICAL)
	})

	it('Should handle borderline vital signs correctly', () => {
		const borderlineVitals = VitalSigns.create({
			systolicBP: 145,
			diastolicBP: 95,
			heartRate: 105,
			temperature: 38.2,
			oxygenSaturation: 94,
			respiratoryRate: 16,
		})

		const riskFactors = {
			age: 30,
			hasChronicConditions: false,
			smokingStatus: 'never' as const,
			medicationCount: 0,
			symptomSeverity: 4,
		}

		const riskScore = RiskScore.calculate(borderlineVitals, riskFactors)

		expect(riskScore.factors).toContain('Hypertension')
		expect(riskScore.factors).toContain('Borderline Heart Rate')
		expect(riskScore.factors).toContain('Mild Temperature Alteration')
		expect(riskScore.factors).toContain('Borderline Oxygen Saturation')
		expect(riskScore.factors).toContain('Mild Symptoms')
	})
})
