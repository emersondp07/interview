import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import { administratorRoutes } from '@/interfaces/http/routes/administrator-routes'
import { appointmentRoutes } from '@/interfaces/http/routes/appointment-routes'
import { clientRoutes } from '@/interfaces/http/routes/client-routes'
import { companyRoutes } from '@/interfaces/http/routes/company-routes'
import { interviewAnswerRoutes } from '@/interfaces/http/routes/interview-answer-routes'
import { interviewQuestionRoutes } from '@/interfaces/http/routes/interview-question-routes'
import { interviewerRoutes } from '@/interfaces/http/routes/interviewer-routes'
import { riskScoreRoutes } from '@/interfaces/http/routes/risk-score-routes'
import { triageRoutes } from '@/interfaces/http/routes/triage-routes'
import { webhookRoutes } from '@/interfaces/http/routes/webhook-routes'
import { registerInterviewNamespace } from '@/interfaces/http/socket/namespace/interview-namespace'
import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifyJwt from '@fastify/jwt'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import fastify from 'fastify'
import fastifyRawBody from 'fastify-raw-body'
import {
	type ZodTypeProvider,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod'
import { ZodError } from 'zod'
import { env } from '../config'

import { Server as SocketIOServer } from 'socket.io'
import { registerVideoNamespace } from '../../interfaces/http/socket/namespace/video-namespace'

export const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyRawBody, {
	field: 'rawBody',
	global: false,
	runFirst: true,
	encoding: 'utf8',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(fastifyCors, { origin: '*', credentials: true })

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'API Documentation',
			version: '1.0.0',
		},
		components: {
			securitySchemes: {
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
	},
	transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUi, {
	routePrefix: '/docs',
})

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

app.register(fastifyCookie)

app.register(administratorRoutes)
app.register(companyRoutes)
app.register(clientRoutes)
app.register(interviewerRoutes)
app.register(interviewQuestionRoutes)
app.register(interviewAnswerRoutes)
app.register(triageRoutes)
app.register(appointmentRoutes)
app.register(riskScoreRoutes)

app.register(webhookRoutes)

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: 'Validation error.', issue: error.format() })
	}

	if (error.statusCode === 400 && error.code === 'FST_ERR_VALIDATION') {
		return reply.status(400).send({
			message: 'Validation error.',
			details: error.validation
		})
	}

	if (error instanceof InvalidCredencialsError) {
		return reply.status(401).send(error.message)
	}

	if (env.NODE_ENV !== 'prod') {
		console.error(error)
	} else {
		// fazer um log para ferramenta interna.
	}

	return reply.status(500).send({ message: 'Internal server error.' })
})

function initSocket(io: SocketIOServer) {
	registerInterviewNamespace(io)
	registerVideoNamespace(io)
}

export async function start(customPort?: number) {
	try {
		await app.ready()

		const port = customPort ?? env.PORT ?? 3333
		await app.listen({
			port,
			host: '0.0.0.0',
			listenTextResolver: (address) => `Servidor rodando em ${address}`,
		})

		const io = new SocketIOServer(app.server, {
			cors: {
				origin: '*',
			},
		})

		initSocket(io)
	} catch (err) {
		app.log.error(err)
		// Em ambiente de teste, não devemos fazer process.exit(1)
		if (process.env.NODE_ENV !== 'test' && process.env.VITEST !== 'true') {
			process.exit(1)
		} else {
			console.error('Server failed to start in test environment:', err)
			throw err
		}
	}
}
