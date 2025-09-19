export class PhoneNumber {
	private readonly _value: string

	constructor(phone: string) {
		const cleanPhone = phone.replace(/\D/g, '') // Remove non-digits

		if (!PhoneNumber.isValid(cleanPhone)) {
			throw new Error('Invalid phone number format')
		}

		this._value = cleanPhone
	}

	static isValid(phone: string): boolean {
		const cleanPhone = phone.replace(/\D/g, '')

		// Brasil: 10 dígitos (fixo) ou 11 dígitos (celular com 9 na frente)
		if (cleanPhone.length < 10 || cleanPhone.length > 11) {
			return false
		}

		// Se tem 11 dígitos, deve começar com dígito válido para celular
		if (cleanPhone.length === 11) {
			const thirdDigit = cleanPhone[2]
			return thirdDigit === '9' // Celular deve ter 9 como terceiro dígito
		}

		// Se tem 10 dígitos, é telefone fixo
		if (cleanPhone.length === 10) {
			const thirdDigit = cleanPhone[2]
			return ['2', '3', '4', '5'].includes(thirdDigit) // Fixo começa com 2, 3, 4 ou 5
		}

		return false
	}

	static create(phone: string): PhoneNumber {
		return new PhoneNumber(phone)
	}

	get value(): string {
		return this._value
	}

	get formatted(): string {
		if (this._value.length === 11) {
			// Celular: (XX) 9XXXX-XXXX
			return this._value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
		} else {
			// Fixo: (XX) XXXX-XXXX
			return this._value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
		}
	}

	get isMobile(): boolean {
		return this._value.length === 11 && this._value[2] === '9'
	}

	get areaCode(): string {
		return this._value.substring(0, 2)
	}

	equals(other: PhoneNumber): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this.formatted
	}
}
