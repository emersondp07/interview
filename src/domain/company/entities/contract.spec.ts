import { delay } from '@/tests/utils/delay'
import { faker } from '@faker-js/faker'
import { UniqueEntityID } from '../../core/entities/unique-entity'
import { Contract } from './contract'

describe('Contract Entity', () => {
	it('Should be able to create a contract with valida data', () => {
		const contract = Contract.create({
			companyId: new UniqueEntityID(),
			title: 'Contrato de concordancia de patologia',
			description: 'Examplo de contrato de concordancia de patologia',
			imageUrl: 'https://example.com/contract.png',
		})

		expect(contract.id).toBeInstanceOf(UniqueEntityID)
		expect(contract.companyId).toBeInstanceOf(UniqueEntityID)
		expect(contract.title).toEqual('Contrato de concordancia de patologia')
		expect(contract.description).toEqual(
			'Examplo de contrato de concordancia de patologia',
		)
		expect(contract.imageUrl).toEqual('https://example.com/contract.png')
		expect(contract.createdAt).toBeInstanceOf(Date)
		expect(contract.updatedAt).toBeInstanceOf(Date)
	})

	it('Should be able to change the datas of a contract', async () => {
		const contract = Contract.create({
			companyId: new UniqueEntityID(),
			description: faker.lorem.paragraph(),
			title: faker.lorem.sentence(),
			imageUrl: faker.image.url(),
		})

		const oldUpdatedAt = contract.updatedAt

		await delay(10)

		contract.delete()

		expect(contract.deletedAt).toBeInstanceOf(Date)
		expect(contract.updatedAt.getTime()).toBeGreaterThan(oldUpdatedAt.getTime())
	})
})
