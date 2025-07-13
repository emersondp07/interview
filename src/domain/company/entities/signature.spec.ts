import { UniqueEntityID } from '../../core/entities/unique-entity'
import { STATUS_SIGNATURE } from './interfaces/signature.type'
import { Signature } from './signature'

describe('Question Entity', () => {
	it('Should be able to create a signature with valid data', () => {
		const signature = Signature.create({
			companyId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		expect(signature.id).toBeTruthy()
		expect(signature.startValidity).toBeInstanceOf(Date)
		expect(signature.companyId).toBeInstanceOf(UniqueEntityID)
		expect(signature.status).toBe(STATUS_SIGNATURE.CHECKOUT)
	})

	it('Should be able to delete a signature', async () => {
		const signature = Signature.create({
			companyId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		signature.cancel()

		expect(signature.endValidity).toBeInstanceOf(Date)
		expect(signature.status).toBe(STATUS_SIGNATURE.CANCELED)
	})
})
