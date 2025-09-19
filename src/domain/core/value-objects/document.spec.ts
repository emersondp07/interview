import { DOCUMENT_TYPE } from '@prisma/client'
import { Document } from './document'

describe('Document Value Object', () => {
	it('Should be able to create a valid CPF document', () => {
		const document = Document.create('12345678909', DOCUMENT_TYPE.CPF)

		expect(document.value).toBe('12345678909')
		expect(document.type).toBe(DOCUMENT_TYPE.CPF)
	})

	it('Should be able to create a valid CNPJ document', () => {
		const document = Document.create('11222333000181', DOCUMENT_TYPE.CNPJ)

		expect(document.value).toBe('11222333000181')
		expect(document.type).toBe(DOCUMENT_TYPE.CNPJ)
	})

	it('Should be able to create a valid RG document', () => {
		const document = Document.create('1234567', DOCUMENT_TYPE.RG)

		expect(document.value).toBe('1234567')
		expect(document.type).toBe(DOCUMENT_TYPE.RG)
	})

	it('Should clean non-numeric characters from document value', () => {
		const document = Document.create('123.456.789-09', DOCUMENT_TYPE.CPF)

		expect(document.value).toBe('12345678909')
	})

	it('Should format CPF correctly', () => {
		const document = Document.create('12345678909', DOCUMENT_TYPE.CPF)

		expect(document.formatted).toBe('123.456.789-09')
		expect(document.toString()).toBe('123.456.789-09')
	})

	it('Should format CNPJ correctly', () => {
		const document = Document.create('11222333000181', DOCUMENT_TYPE.CNPJ)

		expect(document.formatted).toBe('11.222.333/0001-81')
		expect(document.toString()).toBe('11.222.333/0001-81')
	})

	it('Should return unformatted RG', () => {
		const document = Document.create('1234567', DOCUMENT_TYPE.RG)

		expect(document.formatted).toBe('1234567')
		expect(document.toString()).toBe('1234567')
	})

	it('Should not accept invalid CPF', () => {
		expect(() => Document.create('12345678901', DOCUMENT_TYPE.CPF)).toThrow(
			'Invalid CPF format',
		)
	})

	it('Should not accept CPF with all same digits', () => {
		expect(() => Document.create('11111111111', DOCUMENT_TYPE.CPF)).toThrow(
			'Invalid CPF format',
		)
	})

	it('Should not accept CPF with wrong length', () => {
		expect(() => Document.create('123456789', DOCUMENT_TYPE.CPF)).toThrow(
			'Invalid CPF format',
		)
	})

	it('Should not accept invalid CNPJ', () => {
		expect(() => Document.create('11222333000182', DOCUMENT_TYPE.CNPJ)).toThrow(
			'Invalid CNPJ format',
		)
	})

	it('Should not accept CNPJ with all same digits', () => {
		expect(() => Document.create('11111111111111', DOCUMENT_TYPE.CNPJ)).toThrow(
			'Invalid CNPJ format',
		)
	})

	it('Should not accept CNPJ with wrong length', () => {
		expect(() => Document.create('1122233300018', DOCUMENT_TYPE.CNPJ)).toThrow(
			'Invalid CNPJ format',
		)
	})

	it('Should not accept RG with less than 7 digits', () => {
		expect(() => Document.create('123456', DOCUMENT_TYPE.RG)).toThrow(
			'Invalid RG format',
		)
	})

	it('Should not accept RG with more than 12 digits', () => {
		expect(() => Document.create('1234567890123', DOCUMENT_TYPE.RG)).toThrow(
			'Invalid RG format',
		)
	})

	it('Should check equality between documents', () => {
		const document1 = Document.create('12345678909', DOCUMENT_TYPE.CPF)
		const document2 = Document.create('12345678909', DOCUMENT_TYPE.CPF)
		const document3 = Document.create('11222333000181', DOCUMENT_TYPE.CNPJ)

		expect(document1.equals(document2)).toBe(true)
		expect(document1.equals(document3)).toBe(false)
	})

	it('Should validate documents statically', () => {
		expect(Document.isValid('12345678909', DOCUMENT_TYPE.CPF)).toBe(true)
		expect(Document.isValid('12345678901', DOCUMENT_TYPE.CPF)).toBe(false)
		expect(Document.isValid('11222333000181', DOCUMENT_TYPE.CNPJ)).toBe(true)
		expect(Document.isValid('11222333000182', DOCUMENT_TYPE.CNPJ)).toBe(false)
		expect(Document.isValid('1234567', DOCUMENT_TYPE.RG)).toBe(true)
		expect(Document.isValid('123456', DOCUMENT_TYPE.RG)).toBe(false)
	})
})
