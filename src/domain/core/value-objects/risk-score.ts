import type { VitalSigns } from './vital-signs'

export enum RiskLevel {
	LOW = 'LOW',
	MEDIUM = 'MEDIUM',
	HIGH = 'HIGH',
	CRITICAL = 'CRITICAL',
}

interface RiskFactors {
	age: number
	hasChronicConditions: boolean
	smokingStatus: 'never' | 'former' | 'current'
	bmi?: number
	medicationCount: number
	symptomSeverity: number // 1-10 scale
}

export class RiskScore {
	private readonly _score: number
	private readonly _level: RiskLevel
	private readonly _factors: string[]

	private constructor(score: number, level: RiskLevel, factors: string[]) {
		this._score = score
		this._level = level
		this._factors = factors
	}

	static calculate(
		vitalSigns: VitalSigns,
		riskFactors: RiskFactors,
	): RiskScore {
		let score = 0
		const factors: string[] = []

		// Análise dos sinais vitais (0-40 pontos)
		const vitalAnalysis = this.analyzeVitalSigns(vitalSigns)
		score += vitalAnalysis.score
		factors.push(...vitalAnalysis.factors)

		// Análise dos fatores de risco (0-60 pontos)
		const riskAnalysis = this.analyzeRiskFactors(riskFactors)
		score += riskAnalysis.score
		factors.push(...riskAnalysis.factors)

		// Determina o nível de risco baseado na pontuação
		const level = this.determineRiskLevel(score)

		return new RiskScore(score, level, factors)
	}

	private static analyzeVitalSigns(vitalSigns: VitalSigns): {
		score: number
		factors: string[]
	} {
		let score = 0
		const factors: string[] = []

		// Pressão arterial (0-15 pontos)
		if (vitalSigns.systolicBP >= 180 || vitalSigns.diastolicBP >= 120) {
			score += 15
			factors.push('Hypertensive Crisis')
		} else if (vitalSigns.systolicBP >= 140 || vitalSigns.diastolicBP >= 90) {
			score += 8
			factors.push('Hypertension')
		}

		// Frequência cardíaca (0-10 pontos)
		if (vitalSigns.heartRate < 50 || vitalSigns.heartRate > 120) {
			score += 10
			factors.push('Abnormal Heart Rate')
		} else if (vitalSigns.heartRate < 60 || vitalSigns.heartRate > 100) {
			score += 5
			factors.push('Borderline Heart Rate')
		}

		// Temperatura (0-8 pontos)
		if (vitalSigns.temperature >= 39 || vitalSigns.temperature < 36) {
			score += 8
			factors.push('Abnormal Temperature')
		} else if (vitalSigns.temperature >= 38 || vitalSigns.temperature < 36.1) {
			score += 4
			factors.push('Mild Temperature Alteration')
		}

		// Saturação de oxigênio (0-7 pontos)
		if (vitalSigns.oxygenSaturation < 90) {
			score += 7
			factors.push('Low Oxygen Saturation')
		} else if (vitalSigns.oxygenSaturation < 95) {
			score += 3
			factors.push('Borderline Oxygen Saturation')
		}

		return { score, factors }
	}

	private static analyzeRiskFactors(riskFactors: RiskFactors): {
		score: number
		factors: string[]
	} {
		let score = 0
		const factors: string[] = []

		// Análise da idade
		const ageAnalysis = this.analyzeAge(riskFactors.age)
		score += ageAnalysis.score
		if (ageAnalysis.factor) factors.push(ageAnalysis.factor)

		// Condições crônicas (0-15 pontos)
		if (riskFactors.hasChronicConditions) {
			score += 15
			factors.push('Chronic Medical Conditions')
		}

		// Análise do tabagismo
		const smokingAnalysis = this.analyzeSmokingStatus(riskFactors.smokingStatus)
		score += smokingAnalysis.score
		if (smokingAnalysis.factor) factors.push(smokingAnalysis.factor)

		// Análise do IMC
		if (riskFactors.bmi) {
			const bmiAnalysis = this.analyzeBMI(riskFactors.bmi)
			score += bmiAnalysis.score
			if (bmiAnalysis.factor) factors.push(bmiAnalysis.factor)
		}

		// Análise de medicamentos
		const medicationAnalysis = this.analyzeMedicationCount(riskFactors.medicationCount)
		score += medicationAnalysis.score
		if (medicationAnalysis.factor) factors.push(medicationAnalysis.factor)

		// Análise dos sintomas
		const symptomAnalysis = this.analyzeSymptomSeverity(riskFactors.symptomSeverity)
		score += symptomAnalysis.score
		if (symptomAnalysis.factor) factors.push(symptomAnalysis.factor)

		return { score, factors }
	}

	private static analyzeAge(age: number): { score: number; factor?: string } {
		if (age >= 80) return { score: 20, factor: 'Advanced Age (80+)' }
		if (age >= 65) return { score: 12, factor: 'Elderly (65-79)' }
		if (age >= 50) return { score: 6, factor: 'Middle Age (50-64)' }
		return { score: 0 }
	}

	private static analyzeSmokingStatus(smokingStatus: string): { score: number; factor?: string } {
		if (smokingStatus === 'current') return { score: 10, factor: 'Current Smoker' }
		if (smokingStatus === 'former') return { score: 5, factor: 'Former Smoker' }
		return { score: 0 }
	}

	private static analyzeBMI(bmi: number): { score: number; factor?: string } {
		if (bmi >= 35) return { score: 8, factor: 'Severe Obesity (BMI ≥35)' }
		if (bmi >= 30) return { score: 5, factor: 'Obesity (BMI 30-34.9)' }
		if (bmi < 18.5) return { score: 4, factor: 'Underweight (BMI <18.5)' }
		return { score: 0 }
	}

	private static analyzeMedicationCount(medicationCount: number): { score: number; factor?: string } {
		if (medicationCount >= 5) return { score: 5, factor: 'Multiple Medications (≥5)' }
		if (medicationCount >= 3) return { score: 3, factor: 'Several Medications (3-4)' }
		return { score: 0 }
	}

	private static analyzeSymptomSeverity(symptomSeverity: number): { score: number; factor?: string } {
		if (symptomSeverity >= 8) return { score: 10, factor: 'Severe Symptoms' }
		if (symptomSeverity >= 6) return { score: 6, factor: 'Moderate Symptoms' }
		if (symptomSeverity >= 4) return { score: 3, factor: 'Mild Symptoms' }
		return { score: 0 }
	}

	private static determineRiskLevel(score: number): RiskLevel {
		if (score >= 75) return RiskLevel.CRITICAL
		if (score >= 50) return RiskLevel.HIGH
		if (score >= 25) return RiskLevel.MEDIUM
		return RiskLevel.LOW
	}

	static fromScore(score: number): RiskScore {
		const level = this.determineRiskLevel(score)
		return new RiskScore(score, level, [])
	}

	get score(): number {
		return this._score
	}

	get level(): RiskLevel {
		return this._level
	}

	get factors(): string[] {
		return [...this._factors]
	}

	get priority(): number {
		switch (this._level) {
			case RiskLevel.CRITICAL:
				return 1
			case RiskLevel.HIGH:
				return 2
			case RiskLevel.MEDIUM:
				return 3
			case RiskLevel.LOW:
				return 4
			default:
				return 4
		}
	}

	get recommendedAction(): string {
		switch (this._level) {
			case RiskLevel.CRITICAL:
				return 'Immediate medical attention required. Contact emergency services.'
			case RiskLevel.HIGH:
				return 'Urgent medical consultation needed within 24 hours.'
			case RiskLevel.MEDIUM:
				return 'Schedule medical appointment within 7 days.'
			case RiskLevel.LOW:
				return 'Routine follow-up recommended.'
			default:
				return 'Routine follow-up recommended.'
		}
	}

	get color(): string {
		switch (this._level) {
			case RiskLevel.CRITICAL:
				return '#DC2626' // Red
			case RiskLevel.HIGH:
				return '#EA580C' // Orange
			case RiskLevel.MEDIUM:
				return '#CA8A04' // Yellow
			case RiskLevel.LOW:
				return '#16A34A' // Green
			default:
				return '#16A34A' // Green (fallback)
		}
	}

	isHigherThan(other: RiskScore): boolean {
		return this._score > other._score
	}

	equals(other: RiskScore): boolean {
		return this._score === other._score && this._level === other._level
	}

	toString(): string {
		return `${this._level} (${this._score}/100)`
	}
}
