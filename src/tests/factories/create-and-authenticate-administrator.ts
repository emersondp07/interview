import { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { prisma } from '@/infra/database/prisma/prisma'
import type { FastifyTypedInstance } from '@/interfaces/@types/instances.type'
import { hash } from 'bcryptjs'
import request from 'supertest'

export async function createAndAuthenticateAdministrator(
	app: FastifyTypedInstance,
) {
	await prisma.administrator.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: await hash('12345678', 10),
			role: ROLE.ADMIN,
		},
	})

	const authResponse = await request(app.server)
		.post('/session-administrator')
		.send({
			email: 'johndoe@example.com',
			password: '12345678',
		})

	const { token } = authResponse.body

	return { token }
}
