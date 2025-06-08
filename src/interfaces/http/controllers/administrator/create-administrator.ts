import { CreateAdministratorUseCase } from '@/domain/administrator/application/use-cases/create-administrator'
import type { CreateAdministratorSchema } from '@/domain/administrator/application/validators/create-administrator.schema'
import { PrismaAdministratorsRepository } from '@/infra/database/repositories/prisma-administrators-repository'
import type { FastifyReply, FastifyRequest } from 'fastify'

export async function createAdministrator(
	request: FastifyRequest,
	reply: FastifyReply,
) {
	const { name, email, password } = request.body as CreateAdministratorSchema

	const prismaAdministratorsRepository = new PrismaAdministratorsRepository()
	const createAdministratorUseCase = new CreateAdministratorUseCase(
		prismaAdministratorsRepository,
	)

	await createAdministratorUseCase.execute({
		name,
		email,
		password,
	})

	return reply.status(201).send()
}
