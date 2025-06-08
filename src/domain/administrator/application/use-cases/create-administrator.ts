import { hash } from 'bcryptjs'
import { type Either, success } from '../../../../core/either'
import { Administrator } from '../../enterprise/entities/administrator'
import type { AdministratorsRepository } from '../repositories/administrators-repository'

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
	constructor(private administratorsRepository: AdministratorsRepository) {}

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
