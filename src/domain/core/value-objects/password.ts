import { hash } from 'bcryptjs'

export class Password {
	private readonly _hashedValue: string

	private constructor(hashedPassword: string) {
		this._hashedValue = hashedPassword
	}

	static async create(plainPassword: string): Promise<Password> {
		if (!Password.isValid(plainPassword)) {
			throw new Error(
				'Password must be at least 8 characters long and contain uppercase, lowercase, number and special character',
			)
		}

		const hashedPassword = await hash(plainPassword, 8)
		return new Password(hashedPassword)
	}

	static fromHashed(hashedPassword: string): Password {
		return new Password(hashedPassword)
	}

	static isValid(password: string): boolean {
		// Pelo menos 8 caracteres, 1 maiúscula, 1 minúscula, 1 número, 1 especial
		const passwordRegex =
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		return passwordRegex.test(password)
	}

	get hashedValue(): string {
		return this._hashedValue
	}

	equals(other: Password): boolean {
		return this._hashedValue === other._hashedValue
	}

	toString(): string {
		return '***HIDDEN***'
	}
}
