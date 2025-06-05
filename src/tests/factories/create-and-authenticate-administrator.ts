import { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { prisma } from '@/infra/database/prisma/prisma'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'

export async function createAndAuthenticateAdministrator(app: FastifyInstance) {
	await prisma.administrator.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: await hash('123456', 10),
			role: ROLE.ADMIN,
		},
	})

	const authResponse = await request(app.server)
		.post('/sessions-administrator')
		.send({
			email: 'johndoe@example.com',
			password: '123456',
		})

	const { token } = authResponse.body

	return { token }
}
