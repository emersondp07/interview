export class Email {
	private readonly _value: string

	constructor(email: string) {
		if (!Email.isValid(email)) {
			throw new Error('Invalid email format')
		}
		this._value = email.toLowerCase().trim()
	}

	static isValid(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		return emailRegex.test(email.trim())
	}

	static create(email: string): Email {
		return new Email(email)
	}

	get value(): string {
		return this._value
	}

	equals(other: Email): boolean {
		return this._value === other._value
	}

	toString(): string {
		return this._value
	}
}
