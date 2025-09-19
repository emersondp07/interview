import { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { VitalSigns } from '@/domain/core/value-objects/vital-signs'
import { Triage } from '@/domain/interviewer/entities/triage'
import { faker } from '@faker-js/faker'

export function makeTriage(
	override: Partial<{
		notes: string
		vitalSigns: VitalSigns
		nurseName: string
		clientId: UniqueEntityID
	}> = {},
	id?: UniqueEntityID,
) {
	const vitalSigns = VitalSigns.create({
		systolicBP: 120,
		diastolicBP: 80,
		heartRate: 70,
		temperature: 36.5,
		respiratoryRate: 16,
		oxygenSaturation: 98,
	})

	const triage = Triage.create(
		{
			notes: faker.lorem.paragraph(),
			vitalSigns,
			nurseName: faker.person.fullName(),
			clientId: new UniqueEntityID(),
			...override,
		},
		id,
	)

	return triage
}
