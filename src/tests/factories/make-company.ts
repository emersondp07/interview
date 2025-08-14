import { DOCUMENT_TYPE } from '@/domain/client/entities/interfaces/client.type'
import type { UniqueEntityID } from '@/domain/core/entities/unique-entity'
import { Company } from '@domain/company/entities/company'
import type { CompanyProps } from '@domain/company/entities/interfaces/company.type'
import { faker } from '@faker-js/faker'

export function makeCompany(
	override?: Partial<CompanyProps>,
	id?: UniqueEntityID,
) {
	const company = Company.create(
		{
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password({
				length: 16,
				memorable: false,
				pattern: /[A-Za-z0-9!@#$%^&*()_+]{16}/,
			}),
			phone: faker.phone.number(),
			planId: faker.string.uuid(),
			stripeCustomerId: faker.string.uuid(),
			...override,
		},
		id,
	)

	return company
}
