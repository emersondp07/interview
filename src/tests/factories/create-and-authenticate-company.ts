import { ROLE } from '@/domain/administrator/enterprise/entities/interfaces/adminitrator.type'
import { prisma } from '@/infra/database/prisma/prisma'
import { hash } from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { makePlan } from './make-plan'

export async function createAndAuthenticateCompany(app: FastifyInstance) {
	const plan = makePlan()
	await prisma.plan.create({
		data: {
			id: plan.id.toString(),
			name: plan.name,
			price: plan.price,
			description: plan.description,
			interview_limit: plan.interviewLimit,
		},
	})

	await prisma.company.create({
		data: {
			corporate_reason: 'Corporate',
			email: 'corporate@example.com',
			password: await hash('123456', 10),
			cnpj: '165165165156',
			phone: '1231321321',
			role: ROLE.COMPANY,
			plan_id: plan.id.toString(),
		},
	})

	const authResponse = await request(app.server)
		.post('/sessions-company')
		.send({
			email: 'johndoe@example.com',
			password: '123456',
		})

	const { token } = authResponse.body

	return { token }
}
