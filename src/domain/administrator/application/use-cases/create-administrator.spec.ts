import { InMemoryAdministratorsRepository } from '@/tests/repositories/in-memory-administrators-repository'
import { CreateAdministratorUseCase } from './create-administrator'

let inMemoryAdministratorsRepository: InMemoryAdministratorsRepository
let sut: CreateAdministratorUseCase

describe('Create Administrator', () => {
	beforeEach(() => {
		inMemoryAdministratorsRepository = new InMemoryAdministratorsRepository()

		sut = new CreateAdministratorUseCase(inMemoryAdministratorsRepository)
	})

	it('Should be able to create a administrator', async () => {
		const result = await sut.execute({
			name: 'Jonh Doe',
			email: 'jonhdoe@email.com',
			password: '123456',
		})

		expect(result.isSuccess()).toBe(true)
	})
})
