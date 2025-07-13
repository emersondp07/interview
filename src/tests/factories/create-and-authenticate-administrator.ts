import { prisma } from '@/infra/database/prisma/prisma'
import type { FastifyTypedInstance } from '@/interfaces/@types/instances.type'
import { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import { hash } from 'bcryptjs'
import request from 'supertest'
import { makeAdministrator } from './make-administrator'

export async function createAndAuthenticateAdministrator(
	app: FastifyTypedInstance,
) {
	const adm = makeAdministrator()

	await prisma.administrator.create({
		data: {
			name: 'John Doe',
			email: 'johndoe@example.com',
			password: await hash(adm.password, 10),
			role: ROLE.ADMIN,
		},
	})

	const authResponse = await request(app.server)
		.post('/session-administrator')
		.send({
			email: 'johndoe@example.com',
			password: adm.password,
		})

	const { token } = authResponse.body

	return { token }
}
