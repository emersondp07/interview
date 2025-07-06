import type { Administrator } from '@domain/administrator/entities/administrator'
import type { AdministratorsRepository } from '@domain/administrator/repositories/administrators-repository'
import { PrismaAdministratorMapper } from '../prisma/mappers/prisma-administrator-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaAdministratorsRepository
	implements AdministratorsRepository
{
	async create(administrator: Administrator): Promise<void> {
		const prismaAdministrator =
			PrismaAdministratorMapper.toPrisma(administrator)

		await prisma.administrator.create({
			data: prismaAdministrator,
		})
	}

	async findByEmail(email: string) {
		const administrator = await prisma.administrator.findUnique({
			where: {
				email,
			},
		})

		return administrator
			? PrismaAdministratorMapper.toDomain(administrator)
			: null
	}
}
