import { type Either, failed, success } from '@/core/either'
import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { compare } from 'bcryptjs'
import type { CompaniesRepository } from '../../../administrator/application/repositories/companies-repository'
import type { Company } from '../../enterprise/entities/company'

interface AuthenticateCompanyUseCaseRequest {
	email: string
	password: string
}

type AuthenticateCompanyUseCaseResponse = Either<
	InvalidCredencialsError,
	{ company: Company }
>

export class AuthenticateCompanyUseCase {
	constructor(private companiesRepository: CompaniesRepository) {}

	async execute({
		email,
		password,
	}: AuthenticateCompanyUseCaseRequest): Promise<AuthenticateCompanyUseCaseResponse> {
		const company = await this.companiesRepository.findByEmail(email)

		if (!company) {
			return failed(new InvalidCredencialsError())
		}

		const doesPasswordMatches = await compare(password, company.password)

		if (!doesPasswordMatches) {
			return failed(new InvalidCredencialsError())
		}

		return success({ company })
	}
}
