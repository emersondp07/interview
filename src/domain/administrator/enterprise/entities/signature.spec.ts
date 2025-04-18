import { UniqueEntityID } from '@/core/entities/unique-entity'
import { STATUS_SIGNATURE } from './interfaces/signature.type'
import { Signature } from './signature'

describe('Question Entity', () => {
	it('Should be able', () => {
		const signature = Signature.create({
			companyId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		expect(signature.id).toBeTruthy()
		expect(signature.startValidity).toBeInstanceOf(Date)
		expect(signature.status).toBe(STATUS_SIGNATURE.ACTIVE)
	})

	it('Should be able', async () => {
		const signature = Signature.create({
			companyId: new UniqueEntityID(),
			planId: new UniqueEntityID(),
		})

		signature.cancel()

		expect(signature.endValidity).toBeInstanceOf(Date)
		expect(signature.status).toBe(STATUS_SIGNATURE.CANCELED)
	})
})
