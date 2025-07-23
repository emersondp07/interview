import { makeCompany } from '@/tests/factories/make-company'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { makeSignature } from '@/tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '@/tests/repositories/in-memory-companies-repository'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { InMemorySignaturesRepository } from '@/tests/repositories/in-memory-signatures-repository'
import { FetchInterviewersUseCase } from './fetch-interviewers'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: FetchInterviewersUseCase

describe('Fetch Interviewers', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new FetchInterviewersUseCase(inMemoryInterviewersRepository)
	})

	it('Should be able to fetch interviewers', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)

		await inMemoryInterviewersRepository.create(
			makeInterviewer({
				companyId: company.id,
			}),
		)
		await inMemoryInterviewersRepository.create(
			makeInterviewer({
				companyId: company.id,
			}),
		)
		await inMemoryInterviewersRepository.create(
			makeInterviewer({
				companyId: company.id,
			}),
		)

		const result = await sut.execute({
			companyId: company.id.toString(),
			page: 1,
		})

		expect(result.value?.interviewers).toHaveLength(3)
	})

	it('Should be able to fetch paginated interviewers', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		inMemoryCompaniesRepository.create(company)
		inMemorySignaturesRepository.create(signature)
		for (let i = 1; i <= 22; i++) {
			await inMemoryInterviewersRepository.create(
				makeInterviewer({
					companyId: company.id,
				}),
			)
		}

		const result = await sut.execute({
			companyId: company.id.toString(),
			page: 2,
		})

		expect(result.value?.interviewers).toHaveLength(10)
	})
})
