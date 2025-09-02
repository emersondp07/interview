import type { Either } from '@/domain/core/either'
import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import type { FastifyReply } from 'fastify'

export const handleResult = async <L, R>(
	result: Either<L, R>,
	reply: FastifyReply,
	onSuccess: (value: R) => Promise<FastifyReply> | FastifyReply,
): Promise<FastifyReply> => {
	if (result.isFailed()) {
		const error = result.value

		if (error instanceof InvalidCredencialsError) {
			return reply.status(401).send({ message: error.message })
		}

		if (error instanceof ResourceNotFoundError) {
			return reply.status(404).send({ message: error.message })
		}

		if (error instanceof NotAllowedError) {
			return reply.status(403).send({ message: error.message })
		}

		// Log unexpected errors and return generic error
		console.error('Unexpected error:', error)
		return reply.status(500).send({ message: 'Internal server error' })
	}

	return await onSuccess(result.value)
}
