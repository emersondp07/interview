import { PhoneNumber } from './phone-number'

describe('PhoneNumber Value Object', () => {
	it('Should be able to create a valid mobile phone number', () => {
		const phoneNumber = PhoneNumber.create('11987654321')

		expect(phoneNumber.value).toBe('11987654321')
		expect(phoneNumber.isMobile).toBe(true)
		expect(phoneNumber.areaCode).toBe('11')
	})

	it('Should be able to create a valid landline phone number', () => {
		const phoneNumber = PhoneNumber.create('1123456789')

		expect(phoneNumber.value).toBe('1123456789')
		expect(phoneNumber.isMobile).toBe(false)
		expect(phoneNumber.areaCode).toBe('11')
	})

	it('Should clean non-numeric characters from phone number', () => {
		const phoneNumber = PhoneNumber.create('(11) 98765-4321')

		expect(phoneNumber.value).toBe('11987654321')
	})

	it('Should format mobile phone number correctly', () => {
		const phoneNumber = PhoneNumber.create('11987654321')

		expect(phoneNumber.formatted).toBe('(11) 98765-4321')
		expect(phoneNumber.toString()).toBe('(11) 98765-4321')
	})

	it('Should format landline phone number correctly', () => {
		const phoneNumber = PhoneNumber.create('1123456789')

		expect(phoneNumber.formatted).toBe('(11) 2345-6789')
		expect(phoneNumber.toString()).toBe('(11) 2345-6789')
	})

	it('Should validate mobile phone number format', () => {
		expect(PhoneNumber.isValid('11987654321')).toBe(true)
		expect(PhoneNumber.isValid('21987654321')).toBe(true)
		expect(PhoneNumber.isValid('85987654321')).toBe(true)
	})

	it('Should validate landline phone number format', () => {
		expect(PhoneNumber.isValid('1123456789')).toBe(true)
		expect(PhoneNumber.isValid('1133456789')).toBe(true)
		expect(PhoneNumber.isValid('1143456789')).toBe(true)
		expect(PhoneNumber.isValid('1153456789')).toBe(true)
	})

	it('Should not accept phone number with less than 10 digits', () => {
		expect(() => PhoneNumber.create('119876543')).toThrow(
			'Invalid phone number format',
		)
	})

	it('Should not accept phone number with more than 11 digits', () => {
		expect(() => PhoneNumber.create('119876543210')).toThrow(
			'Invalid phone number format',
		)
	})

	it('Should not accept mobile phone without 9 as third digit', () => {
		expect(() => PhoneNumber.create('11887654321')).toThrow(
			'Invalid phone number format',
		)
	})

	it('Should not accept landline phone with invalid third digit', () => {
		expect(() => PhoneNumber.create('1183456789')).toThrow(
			'Invalid phone number format',
		)
		expect(() => PhoneNumber.create('1193456789')).toThrow(
			'Invalid phone number format',
		)
	})

	it('Should identify mobile vs landline correctly', () => {
		const mobile = PhoneNumber.create('11987654321')
		const landline = PhoneNumber.create('1123456789')

		expect(mobile.isMobile).toBe(true)
		expect(landline.isMobile).toBe(false)
	})

	it('Should extract area code correctly', () => {
		const phoneNumber1 = PhoneNumber.create('11987654321')
		const phoneNumber2 = PhoneNumber.create('2133456789')

		expect(phoneNumber1.areaCode).toBe('11')
		expect(phoneNumber2.areaCode).toBe('21')
	})

	it('Should check equality between phone numbers', () => {
		const phoneNumber1 = PhoneNumber.create('11987654321')
		const phoneNumber2 = PhoneNumber.create('(11) 98765-4321')
		const phoneNumber3 = PhoneNumber.create('1123456789')

		expect(phoneNumber1.equals(phoneNumber2)).toBe(true)
		expect(phoneNumber1.equals(phoneNumber3)).toBe(false)
	})

	it('Should validate phone numbers statically', () => {
		expect(PhoneNumber.isValid('11987654321')).toBe(true)
		expect(PhoneNumber.isValid('1123456789')).toBe(true)
		expect(PhoneNumber.isValid('119876543')).toBe(false)
		expect(PhoneNumber.isValid('119876543210')).toBe(false)
		expect(PhoneNumber.isValid('11887654321')).toBe(false)
		expect(PhoneNumber.isValid('1183456789')).toBe(false)
	})
})
