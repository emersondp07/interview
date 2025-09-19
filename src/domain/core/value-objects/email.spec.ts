import { describe, expect, it } from 'vitest'
import { Email } from './email'

describe('Email Value Object', () => {
	describe('Valid emails', () => {
		it('should create valid email', () => {
			const email = new Email('test@example.com')
			expect(email.value).toBe('test@example.com')
		})

		it('should normalize email (lowercase and trim)', () => {
			const email = new Email('  TEST@EXAMPLE.COM  ')
			expect(email.value).toBe('test@example.com')
		})

		it('should create with factory method', () => {
			const email = Email.create('user@domain.com')
			expect(email.value).toBe('user@domain.com')
		})
	})

	describe('Invalid emails', () => {
		it('should throw error for invalid format', () => {
			expect(() => new Email('invalid-email')).toThrow('Invalid email format')
			expect(() => new Email('test@')).toThrow('Invalid email format')
			expect(() => new Email('@domain.com')).toThrow('Invalid email format')
			expect(() => new Email('test@domain')).toThrow('Invalid email format')
		})

		it('should throw error for empty email', () => {
			expect(() => new Email('')).toThrow('Invalid email format')
		})
	})

	describe('Email validation', () => {
		it('should validate correct emails', () => {
			expect(Email.isValid('test@example.com')).toBe(true)
			expect(Email.isValid('user.name@domain.co.uk')).toBe(true)
			expect(Email.isValid('test+tag@example.org')).toBe(true)
		})

		it('should invalidate incorrect emails', () => {
			expect(Email.isValid('invalid')).toBe(false)
			expect(Email.isValid('test@')).toBe(false)
			expect(Email.isValid('@domain.com')).toBe(false)
			expect(Email.isValid('test@domain')).toBe(false)
		})

		it('should handle potentially malicious input efficiently (ReDoS protection)', () => {
			const maliciousEmail = 'a@a@a@a@a@a@a@a@a@a@a@a@a@a@a@a@a@a@a@a.com'
			const start = performance.now()
			const result = Email.isValid(maliciousEmail)
			const end = performance.now()

			expect(result).toBe(false)
			expect(end - start).toBeLessThan(100) // Should complete in less than 100ms
		})
	})

	describe('Equality', () => {
		it('should be equal for same email', () => {
			const email1 = new Email('test@example.com')
			const email2 = new Email('test@example.com')
			expect(email1.equals(email2)).toBe(true)
		})

		it('should be equal regardless of case', () => {
			const email1 = new Email('test@example.com')
			const email2 = new Email('TEST@EXAMPLE.COM')
			expect(email1.equals(email2)).toBe(true)
		})

		it('should not be equal for different emails', () => {
			const email1 = new Email('test1@example.com')
			const email2 = new Email('test2@example.com')
			expect(email1.equals(email2)).toBe(false)
		})
	})

	describe('String conversion', () => {
		it('should convert to string', () => {
			const email = new Email('test@example.com')
			expect(email.toString()).toBe('test@example.com')
		})
	})
})
