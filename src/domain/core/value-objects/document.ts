import { DOCUMENT_TYPE } from '@prisma/client'

export class Document {
	private readonly _value: string
	private readonly _type: DOCUMENT_TYPE

	constructor(value: string, type: DOCUMENT_TYPE) {
		const cleanValue = value.replace(/\D/g, '')

		if (!Document.isValid(cleanValue, type)) {
			throw new Error(`Invalid ${type} format`)
		}

		this._value = cleanValue
		this._type = type
	}

	static isValid(document: string, type: DOCUMENT_TYPE): boolean {
		const cleanDocument = document.replace(/\D/g, '')

		switch (type) {
			case DOCUMENT_TYPE.CPF:
				return Document.isValidCPF(cleanDocument)
			case DOCUMENT_TYPE.CNPJ:
				return Document.isValidCNPJ(cleanDocument)
			case DOCUMENT_TYPE.RG:
				return Document.isValidRG(cleanDocument)
			default:
				return false
		}
	}

	private static isValidCPF(cpf: string): boolean {
		if (cpf.length !== 11) return false
		if (/^(\d)\1+$/.test(cpf)) return false

		let sum = 0
		for (let i = 0; i < 9; i++) {
			sum += Number.parseInt(cpf[i]) * (10 - i)
		}
		let digit1 = 11 - (sum % 11)
		if (digit1 > 9) digit1 = 0

		sum = 0
		for (let i = 0; i < 10; i++) {
			sum += Number.parseInt(cpf[i]) * (11 - i)
		}
		let digit2 = 11 - (sum % 11)
		if (digit2 > 9) digit2 = 0

		return (
			digit1 === Number.parseInt(cpf[9]) && digit2 === Number.parseInt(cpf[10])
		)
	}

	private static isValidCNPJ(cnpj: string): boolean {
		if (cnpj.length !== 14) return false
		if (/^(\d)\1+$/.test(cnpj)) return false

		const weights1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
		const weights2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

		let sum = 0
		for (let i = 0; i < 12; i++) {
			sum += Number.parseInt(cnpj[i]) * weights1[i]
		}
		const digit1 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

		sum = 0
		for (let i = 0; i < 13; i++) {
			sum += Number.parseInt(cnpj[i]) * weights2[i]
		}
		const digit2 = sum % 11 < 2 ? 0 : 11 - (sum % 11)

		return (
			digit1 === Number.parseInt(cnpj[12]) &&
			digit2 === Number.parseInt(cnpj[13])
		)
	}

	private static isValidRG(rg: string): boolean {
		return rg.length >= 7 && rg.length <= 12
	}

	static create(value: string, type: DOCUMENT_TYPE): Document {
		return new Document(value, type)
	}

	get value(): string {
		return this._value
	}

	get type(): DOCUMENT_TYPE {
		return this._type
	}

	get formatted(): string {
		switch (this._type) {
			case DOCUMENT_TYPE.CPF:
				return this._value.replace(
					/(\d{3})(\d{3})(\d{3})(\d{2})/,
					'$1.$2.$3-$4',
				)
			case DOCUMENT_TYPE.CNPJ:
				return this._value.replace(
					/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
					'$1.$2.$3/$4-$5',
				)
			case DOCUMENT_TYPE.RG:
				return this._value
			default:
				return this._value
		}
	}

	equals(other: Document): boolean {
		return this._value === other._value && this._type === other._type
	}

	toString(): string {
		return this.formatted
	}
}
