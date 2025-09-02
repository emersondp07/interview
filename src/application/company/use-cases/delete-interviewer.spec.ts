import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { makeCompany } from '../../../tests/factories/make-company'
import { makeSignature } from '../../../tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '../../../tests/repositories/in-memory-companies-repository'
import { InMemorySignaturesRepository } from '../../../tests/repositories/in-memory-signatures-repository'
import { DeleteInterviewerUseCase } from './delete-interviewer'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: DeleteInterviewerUseCase

describe('Delete Inteviewer', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new DeleteInterviewerUseCase(inMemoryInterviewersRepository)
	})

	it('Should be able to delete an interviewer', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		await inMemoryCompaniesRepository.create(company)
		await inMemorySignaturesRepository.create(signature)

		const interviewer = makeInterviewer({
			companyId: company.id,
		})

		await inMemoryInterviewersRepository.create(interviewer)

		await sut.execute({
			interviewerId: interviewer.id.toString(),
			companyId: company.id.toString(),
		})

		const deletedInterviewer = await inMemoryInterviewersRepository.findById(
			interviewer.id.toString(),
		)

		expect(deletedInterviewer?.deletedAt).toBeInstanceOf(Date)
	})

	it('Should not be able to delete an interviewer from another company', async () => {
		const interviewer = makeInterviewer(
			{ companyId: new UniqueEntityID('company-1') },
			new UniqueEntityID('interviewer-1'),
		)

		await inMemoryInterviewersRepository.create(interviewer)

		const result = await sut.execute({
			interviewerId: 'interviewer-2',
			companyId: 'company-2',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(ResourceNotFoundError)
	})
})
