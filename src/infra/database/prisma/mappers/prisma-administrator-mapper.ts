import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Administrator } from '@domain/administrator/entities/administrator'
import type { ROLE } from '@domain/administrator/entities/interfaces/adminitrator.type'
import type {
	Administrator as PrismaAdministrator,
	ROLE as PrismaRole,
} from '@prisma/client'

export class PrismaAdministratorMapper {
	static toPrisma(admin: Administrator): PrismaAdministrator {
		return {
			id: admin.id.toString(),
			name: admin.name,
			email: admin.email,
			password: admin.password,
			role: admin.role as PrismaRole,
			created_at: admin.createdAt,
			updated_at: admin.updatedAt,
			deleted_at: admin.deletedAt ?? null,
		}
	}

	static toDomain(raw: PrismaAdministrator): Administrator {
		return Administrator.create(
			{
				name: raw.name,
				email: raw.email,
				password: raw.password,
				role: raw.role as ROLE.ADMIN,
				createdAt: raw.created_at,
				updatedAt: raw.updated_at ?? undefined,
			},
			new UniqueEntityID(raw.id),
		)
	}
}
