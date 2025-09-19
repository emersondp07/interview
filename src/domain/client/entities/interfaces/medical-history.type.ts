import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum MEDICAL_RECORD_TYPE {
	CONSULTATION = 'CONSULTATION',
	EXAM = 'EXAM',
	SURGERY = 'SURGERY',
	HOSPITALIZATION = 'HOSPITALIZATION',
	VACCINATION = 'VACCINATION',
	ALLERGY = 'ALLERGY',
	CHRONIC_CONDITION = 'CHRONIC_CONDITION',
}

export interface MedicalHistoryProps {
	type: MEDICAL_RECORD_TYPE
	title: string
	description: string
	date: Date
	doctorName?: string
	institution?: string
	files: string[]
	observations?: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	clientId: UniqueEntityID
	interviewId?: UniqueEntityID
}
