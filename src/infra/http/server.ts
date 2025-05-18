import fastifyJwt from '@fastify/jwt'
import fastify from 'fastify'
import { ZodError } from 'zod'
import { env } from '../config'

export const app = fastify()

app.register(fastifyJwt, {
	secret: env.JWT_SECRET,
	cookie: {
		cookieName: 'refreshToken',
		signed: false,
	},
	sign: {
		expiresIn: '10m',
	},
})

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error.', issue: error.format() })
	}

	if (env.NODE_ENV !== 'production') {
		console.error(error)
	} else {
		// fazer um log para ferramenta interna.
	}

	return reply.status(500).send({ message: 'Internal server error.' })
})
