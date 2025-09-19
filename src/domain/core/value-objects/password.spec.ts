import { Password } from './password'

describe('Password Value Object', () => {
	it('Should be able to create a valid password', async () => {
		const plainPassword = 'Password123!'
		const password = await Password.create(plainPassword)

		expect(password.hashedValue).toBeDefined()
		expect(password.hashedValue).not.toBe(plainPassword)
		expect(password.hashedValue.length).toBeGreaterThan(0)
	})

	it('Should create different hashes for same password', async () => {
		const plainPassword = 'Password123!'
		const password1 = await Password.create(plainPassword)
		const password2 = await Password.create(plainPassword)

		expect(password1.hashedValue).not.toBe(password2.hashedValue)
		expect(password1.equals(password2)).toBe(false)
	})

	it('Should be able to create from hashed password', () => {
		const hashedPassword = '$2a$08$example.hash.value'
		const password = Password.fromHashed(hashedPassword)

		expect(password.hashedValue).toBe(hashedPassword)
	})

	it('Should validate password format correctly', () => {
		expect(Password.isValid('Password123!')).toBe(true)
		expect(Password.isValid('MyPass123@')).toBe(true)
		expect(Password.isValid('Test1234$')).toBe(true)
	})

	it('Should not accept password without uppercase letter', () => {
		expect(Password.isValid('password123!')).toBe(false)
	})

	it('Should not accept password without lowercase letter', () => {
		expect(Password.isValid('PASSWORD123!')).toBe(false)
	})

	it('Should not accept password without number', () => {
		expect(Password.isValid('Password!')).toBe(false)
	})

	it('Should not accept password without special character', () => {
		expect(Password.isValid('Password123')).toBe(false)
	})

	it('Should not accept password with less than 8 characters', () => {
		expect(Password.isValid('Pass1!')).toBe(false)
	})

	it('Should throw error for invalid password', async () => {
		await expect(Password.create('weak')).rejects.toThrow(
			'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
		)
	})

	it('Should check equality between passwords', () => {
		const hashedPassword = '$2a$08$example.hash.value'
		const password1 = Password.fromHashed(hashedPassword)
		const password2 = Password.fromHashed(hashedPassword)
		const password3 = Password.fromHashed('$2a$08$different.hash.value')

		expect(password1.equals(password2)).toBe(true)
		expect(password1.equals(password3)).toBe(false)
	})

	it('Should hide password value in toString', () => {
		const hashedPassword = '$2a$08$example.hash.value'
		const password = Password.fromHashed(hashedPassword)

		expect(password.toString()).toBe('***HIDDEN***')
	})
})
