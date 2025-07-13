import type { UniqueEntityID } from '../entities/unique-entity'

export interface DomainEvent {
	ocurredAt: Date
	getAggregateId(): UniqueEntityID
}
