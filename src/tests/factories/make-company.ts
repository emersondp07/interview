import type { UniqueEntityID } from '@/core/entities/unique-entity'
import { DOCUMENT_TYPE } from '@/domain/client/enterprise/entities/interfaces/client.type'
import { Company } from '@/domain/company/enterprise/entities/company'
import type { CompanyProps } from '@/domain/company/enterprise/entities/interfaces/company.type'
import { faker } from '@faker-js/faker'

export function makeCompany(
	override: Partial<CompanyProps> = {},
	id?: UniqueEntityID,
) {
	const company = Company.create(
		{
			corporateReason: faker.person.fullName(),
			documentType: DOCUMENT_TYPE.CNPJ,
			cnpj: faker.helpers.replaceSymbols('##.###.###/####-##'),
			email: faker.internet.email(),
			password: faker.internet.password(),
			phone: faker.phone.number(),
			...override,
		},
		id,
	)

	return company
}
