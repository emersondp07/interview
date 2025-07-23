import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { NotAllowedError } from '@/domain/core/errors/errors/not-allowed-error'
import { makeClient } from '@/tests/factories/make-client'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { makeCompany } from '../../../tests/factories/make-company'
import { makeSignature } from '../../../tests/factories/make-signature'
import { InMemoryCompaniesRepository } from '../../../tests/repositories/in-memory-companies-repository'
import { InMemorySignaturesRepository } from '../../../tests/repositories/in-memory-signatures-repository'
import { DeleteClientUseCase } from './delete-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let inMemoryCompaniesRepository: InMemoryCompaniesRepository
let inMemorySignaturesRepository: InMemorySignaturesRepository
let sut: DeleteClientUseCase

describe('Delete Client', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()
		inMemoryCompaniesRepository = new InMemoryCompaniesRepository()
		inMemorySignaturesRepository = new InMemorySignaturesRepository()

		sut = new DeleteClientUseCase(inMemoryClientsRepository)
	})

	it('Should be able to delete a client', async () => {
		const company = makeCompany()
		const signature = makeSignature({
			companyId: company.id,
		})

		await inMemoryCompaniesRepository.create(company)
		await inMemorySignaturesRepository.create(signature)

		const client = makeClient({
			companyId: company.id,
		})

		await inMemoryClientsRepository.create(client)

		await sut.execute({
			companyId: company.id.toString(),
			clientId: client.id.toString(),
		})

		const deletedClient = await inMemoryClientsRepository.findByIdAndCompanyId(
			company.id.toString(),
			client.id.toString(),
		)

		expect(deletedClient?.deletedAt).toBeInstanceOf(Date)
	})

	it('Should not be able to delete a client if is not exist', async () => {
		const client = makeClient(
			{ companyId: new UniqueEntityID('company-1') },
			new UniqueEntityID('client-1'),
		)

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			companyId: 'company-2',
			clientId: 'client-2',
		})

		expect(result.isFailed()).toBe(true)
		expect(result.value).toBeInstanceOf(NotAllowedError)
	})
})
