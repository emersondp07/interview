import type { CompaniesRepository } from '@/domain/administrator/repositories/companies-repository'
import type { Signature } from '@/domain/company/entities/signature'
import type { SignaturesRepository } from '@/domain/company/repositories/signatures-repository'
import { type Either, failed, success } from '@/domain/core/either'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'

interface ActiveSignatureUseCaseRequest {
	companyId: string
}

type ActiveSignatureUseCaseResponse = Either<
	ResourceNotFoundError,
	{ signature: Signature }
>

export class ActiveSignatureUseCase {
	constructor(
		private signaturesRepository: SignaturesRepository,
		private companiesRepository: CompaniesRepository,
	) {}

	async execute({
		companyId,
	}: ActiveSignatureUseCaseRequest): Promise<ActiveSignatureUseCaseResponse> {
		const isExistCompany = await this.companiesRepository.findById(companyId)

		if (!isExistCompany || !isExistCompany.signature) {
			return failed(new ResourceNotFoundError())
		}

		const signature = await this.signaturesRepository.findById(
			isExistCompany.signature.id.toString(),
		)

		if (!signature) {
			return failed(new ResourceNotFoundError())
		}

		signature.changeActive()

		await this.signaturesRepository.update(signature)

		return success({ signature })
	}
}
