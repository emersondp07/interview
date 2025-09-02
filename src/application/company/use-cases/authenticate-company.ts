import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Company } from '@/domain/company/entities/company'
import { type Either, failed, success } from '@/domain/core/either'
import { InvalidCredencialsError } from '@/domain/core/errors/errors/invalid-credencials-error'
import { compare } from 'bcryptjs'

interface AuthenticateCompanyUseCaseRequest {
	email: string
	password: string
}

type AuthenticateCompanyUseCaseResponse = Either<
	InvalidCredencialsError,
	{ company: Company }
>

export class AuthenticateCompanyUseCase {
	constructor(private readonly companiesRepository: CompaniesRepository) {}

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
