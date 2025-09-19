export interface VitalSignsProps {
	systolicBP: number // Pressão sistólica
	diastolicBP: number // Pressão diastólica
	heartRate: number // Batimentos por minuto
	temperature: number // Temperatura corporal em Celsius
	respiratoryRate: number // Frequência respiratória
	oxygenSaturation: number // Saturação de oxigênio (%)
	weight?: number // Peso em kg
	height?: number // Altura em cm
}

export class VitalSigns {
	private readonly _systolicBP: number
	private readonly _diastolicBP: number
	private readonly _heartRate: number
	private readonly _temperature: number
	private readonly _respiratoryRate: number
	private readonly _oxygenSaturation: number
	private readonly _weight?: number
	private readonly _height?: number

	constructor(props: VitalSignsProps) {
		this.validateVitalSigns(props)

		this._systolicBP = props.systolicBP
		this._diastolicBP = props.diastolicBP
		this._heartRate = props.heartRate
		this._temperature = props.temperature
		this._respiratoryRate = props.respiratoryRate
		this._oxygenSaturation = props.oxygenSaturation
		this._weight = props.weight
		this._height = props.height
	}

	private validateVitalSigns(props: VitalSignsProps): void {
		// Pressão arterial
		if (props.systolicBP < 70 || props.systolicBP > 250) {
			throw new Error('Systolic blood pressure must be between 70-250 mmHg')
		}
		if (props.diastolicBP < 40 || props.diastolicBP > 150) {
			throw new Error('Diastolic blood pressure must be between 40-150 mmHg')
		}
		if (props.systolicBP <= props.diastolicBP) {
			throw new Error('Systolic pressure must be higher than diastolic')
		}

		// Frequência cardíaca
		if (props.heartRate < 30 || props.heartRate > 220) {
			throw new Error('Heart rate must be between 30-220 bpm')
		}

		// Temperatura
		if (props.temperature < 32 || props.temperature > 45) {
			throw new Error('Temperature must be between 32-45°C')
		}

		// Frequência respiratória
		if (props.respiratoryRate < 8 || props.respiratoryRate > 60) {
			throw new Error('Respiratory rate must be between 8-60 rpm')
		}

		// Saturação de oxigênio
		if (props.oxygenSaturation < 70 || props.oxygenSaturation > 100) {
			throw new Error('Oxygen saturation must be between 70-100%')
		}

		// Peso (opcional)
		if (props.weight && (props.weight < 0.5 || props.weight > 500)) {
			throw new Error('Weight must be between 0.5-500 kg')
		}

		// Altura (opcional)
		if (props.height && (props.height < 30 || props.height > 250)) {
			throw new Error('Height must be between 30-250 cm')
		}
	}

	static create(props: VitalSignsProps): VitalSigns {
		return new VitalSigns(props)
	}

	// Getters
	get systolicBP(): number {
		return this._systolicBP
	}

	get diastolicBP(): number {
		return this._diastolicBP
	}

	get heartRate(): number {
		return this._heartRate
	}

	get temperature(): number {
		return this._temperature
	}

	get respiratoryRate(): number {
		return this._respiratoryRate
	}

	get oxygenSaturation(): number {
		return this._oxygenSaturation
	}

	get weight(): number | undefined {
		return this._weight
	}

	get height(): number | undefined {
		return this._height
	}

	// Análises clínicas
	get bloodPressureCategory(): string {
		if (this._systolicBP < 120 && this._diastolicBP < 80) return 'Normal'
		if (this._systolicBP < 130 && this._diastolicBP < 80) return 'Elevated'
		if (this._systolicBP < 140 || this._diastolicBP < 90)
			return 'Stage 1 Hypertension'
		if (this._systolicBP < 180 || this._diastolicBP < 120)
			return 'Stage 2 Hypertension'
		return 'Hypertensive Crisis'
	}

	get temperatureCategory(): string {
		if (this._temperature < 36.1) return 'Hypothermia'
		if (this._temperature <= 37.2) return 'Normal'
		if (this._temperature <= 38) return 'Low Fever'
		if (this._temperature <= 39) return 'Moderate Fever'
		return 'High Fever'
	}

	get heartRateCategory(): string {
		if (this._heartRate < 60) return 'Bradycardia'
		if (this._heartRate <= 100) return 'Normal'
		return 'Tachycardia'
	}

	get bmi(): number | undefined {
		if (!this._weight || !this._height) return undefined
		const heightInMeters = this._height / 100
		return Number((this._weight / (heightInMeters * heightInMeters)).toFixed(1))
	}

	get bmiCategory(): string | undefined {
		const bmi = this.bmi
		if (!bmi) return undefined

		if (bmi < 18.5) return 'Underweight'
		if (bmi < 25) return 'Normal'
		if (bmi < 30) return 'Overweight'
		return 'Obese'
	}

	// Converte para formato JSON para armazenamento
	toJSON(): Record<string, any> {
		return {
			systolicBP: this._systolicBP,
			diastolicBP: this._diastolicBP,
			heartRate: this._heartRate,
			temperature: this._temperature,
			respiratoryRate: this._respiratoryRate,
			oxygenSaturation: this._oxygenSaturation,
			weight: this._weight,
			height: this._height,
		}
	}

	// Cria instância a partir de JSON
	static fromJSON(json: Record<string, any>): VitalSigns {
		return new VitalSigns({
			systolicBP: json.systolicBP,
			diastolicBP: json.diastolicBP,
			heartRate: json.heartRate,
			temperature: json.temperature,
			respiratoryRate: json.respiratoryRate,
			oxygenSaturation: json.oxygenSaturation,
			weight: json.weight,
			height: json.height,
		})
	}

	equals(other: VitalSigns): boolean {
		return (
			this._systolicBP === other._systolicBP &&
			this._diastolicBP === other._diastolicBP &&
			this._heartRate === other._heartRate &&
			this._temperature === other._temperature &&
			this._respiratoryRate === other._respiratoryRate &&
			this._oxygenSaturation === other._oxygenSaturation &&
			this._weight === other._weight &&
			this._height === other._height
		)
	}
}
