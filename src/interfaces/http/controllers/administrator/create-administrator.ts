import { CreateAdministratorUseCase } from '@/application/administrator/use-cases/create-administrator'
import { PrismaAdministratorsRepository } from '@/infra/database/repositories/prisma-administrators-repository'
import { handleResult } from '@/interfaces/http/helpers/handle-result'
import type { CreateAdministratorSchema } from '@application/administrator/validators/create-administrator.schema'
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

	const result = await createAdministratorUseCase.execute({
		name,
		email,
		password,
	})

	return handleResult(result, reply, async () => {
		return reply.status(201).send()
	})
}
