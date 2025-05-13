import type { UseCaseError } from '../use-case-error'

export class InvalidCredencialsError extends Error implements UseCaseError {
	constructor() {
		super('Invalid Credencials Error')
	}
}
