import type { Administrator } from '@/domain/administrator/entities/administrator'
import { PrismaAdministratorMapper } from '@/infra/database/prisma/mappers/prisma-administrator-mapper'
import type { AdministratorsRepository } from '@domain/administrator/repositories/administrators-repository'
import type { Administrator as PrismaAdministrator } from '@prisma/client'

export class InMemoryAdministratorsRepository
	implements AdministratorsRepository
{
	public items: PrismaAdministrator[] = []

	async findByEmail(email: string) {
		const administrator = this.items.find((company) => company.email === email)

		if (!administrator) {
			return null
		}

		return administrator
			? PrismaAdministratorMapper.toDomain(administrator)
			: null
	}

	async create(administrator: Administrator) {
		const prismaAdministrator =
			PrismaAdministratorMapper.toPrisma(administrator)
		this.items.push(prismaAdministrator)
	}
}
