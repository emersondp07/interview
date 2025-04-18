import type { UniqueEntityID } from '@/core/entities/unique-entity'

export enum STATUS_SIGNATURE {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	PENDING = 'PENDING',
	CANCELED = 'CANCELED',
}

export interface SignatureProps {
	companyId: UniqueEntityID
	planId: UniqueEntityID
	startValidity: Date
	endValidity?: Date
	status: STATUS_SIGNATURE
}
