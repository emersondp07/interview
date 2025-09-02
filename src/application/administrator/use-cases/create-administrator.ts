import { Administrator } from '@/domain/administrator/entities/administrator'
import type { AdministratorsRepository } from '@/domain/administrator/repositories/administrators-repository'
import { type Either, success } from '@/domain/core/either'
import { hash } from 'bcryptjs'

interface CreateAdministratorUseCaseRequest {
	name: string
	email: string
	password: string
}

type CreateAdministratorUseCaseResponse = Either<
	null,
	{ administrator: Administrator }
>

export class CreateAdministratorUseCase {
	constructor(
		private readonly administratorsRepository: AdministratorsRepository,
	) {}

	async execute({
		name,
		email,
		password,
	}: CreateAdministratorUseCaseRequest): Promise<CreateAdministratorUseCaseResponse> {
		const administrator = Administrator.create({
			name,
			email,
			password: await hash(password, 10),
		})

		await this.administratorsRepository.create(administrator)

		return success({ administrator })
	}
}
