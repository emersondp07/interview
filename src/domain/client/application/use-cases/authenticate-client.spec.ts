import { InvalidCredencialsError } from '@/core/errors/errors/invalid-credencials-error'
import { InMemoryClientsRepository } from '@/tests/repositories/in-memory-clients-repository'
import { makeClient } from '../../../../tests/factories/make-client'
import { DOCUMENT_TYPE } from '../../enterprise/entities/interfaces/client.type'
import { AuthenticateClientUseCase } from './authenticate-client'

let inMemoryClientsRepository: InMemoryClientsRepository
let sut: AuthenticateClientUseCase

describe('Authenticate Client Use Case', () => {
	beforeEach(() => {
		inMemoryClientsRepository = new InMemoryClientsRepository()

		sut = new AuthenticateClientUseCase(inMemoryClientsRepository)
	})

	it('Should be able to authenticate client', async () => {
		const client = makeClient({
			documentType: DOCUMENT_TYPE.CPF,
			document: '12345678901',
		})

		await inMemoryClientsRepository.create(client)

		const result = await sut.execute({
			document: '12345678901',
		})

		expect(result.isSuccess()).toBe(true)
		expect(client.id.toString()).toEqual(expect.any(String))
	})

	it('Should not be able to authenticate with wrong document', async () => {
		const result = await sut.execute({
			document: '12345678901',
		})

		expect(result.value).toBeInstanceOf(InvalidCredencialsError)
	})
})
