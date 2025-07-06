import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { ResourceNotFoundError } from '@/domain/core/errors/errors/resource-not-found-error'
import { makeInterviewer } from '@/tests/factories/make-interviewer'
import { InMemoryInterviewersRepository } from '@/tests/repositories/in-memory-interviewers-repository'
import { DeleteInterviewerUseCase } from './delete-interviewer'

let inMemoryInterviewersRepository: InMemoryInterviewersRepository
let sut: DeleteInterviewerUseCase

describe('Delete Inteviewer', () => {
	beforeEach(() => {
		inMemoryInterviewersRepository = new InMemoryInterviewersRepository()

		sut = new DeleteInterviewerUseCase(inMemoryInterviewersRepository)
	})

	it('Should be able to delete an interviewer', async () => {
		const interviewer = makeInterviewer()

		await inMemoryInterviewersRepository.create(interviewer)

		await sut.execute({
			interviewerId: interviewer.id.toString(),
			companyId: interviewer.companyId.toString(),
		})

		expect(inMemoryInterviewersRepository.items).toHaveLength(0)
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
