import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum MEDICATION_FREQUENCY {
	ONCE_DAILY = 'ONCE_DAILY',
	TWICE_DAILY = 'TWICE_DAILY',
	THREE_TIMES_DAILY = 'THREE_TIMES_DAILY',
	FOUR_TIMES_DAILY = 'FOUR_TIMES_DAILY',
	EVERY_6_HOURS = 'EVERY_6_HOURS',
	EVERY_8_HOURS = 'EVERY_8_HOURS',
	EVERY_12_HOURS = 'EVERY_12_HOURS',
	AS_NEEDED = 'AS_NEEDED',
}

export interface MedicationProps {
	name: string
	dosage: string
	frequency: MEDICATION_FREQUENCY
	duration: string
	instructions?: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	prescriptionId: UniqueEntityID
}
