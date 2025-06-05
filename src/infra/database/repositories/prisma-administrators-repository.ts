import type { AdministratorsRepository } from '@/domain/administrator/application/repositories/administrators-repository'
import type { Administrator } from '@/domain/administrator/enterprise/entities/administrator'
import { PrismaAdministratorMapper } from '../prisma/mappers/prisma-administrator-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaAdministratorsRepository
	implements AdministratorsRepository
{
	async create(administrator: Administrator): Promise<void> {
		await prisma.administrator.create({
			data: {
				id: administrator.id.toString(),
				name: administrator.name,
				email: administrator.email,
				password: administrator.password,
				role: administrator.role,
			},
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
