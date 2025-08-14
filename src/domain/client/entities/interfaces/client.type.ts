import type { InterviewList } from '@/application/company/use-cases/interview-list'
import type { ROLE } from '../../../administrator/entities/interfaces/adminitrator.type'
import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum DOCUMENT_TYPE {
	CPF = 'CPF',
	CNPJ = 'CNPJ',
	RG = 'RG',
}
export enum GENDER {
	MALE = 'MALE',
	FEM = 'FEM',
	OTHER = 'OTHER',
}

export interface ClientProps {
	name: string
	documentType: DOCUMENT_TYPE
	document: string
	phone: string
	birthDate: Date
	age: number
	gender: GENDER
	email: string
	emergencyContact?: string
	emergencyPhone?: string
	medicalHistory?: string
	allergies?: string
	medications?: string
	role: ROLE.CLIENT
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	interviews?: InterviewList
	companyId: UniqueEntityID
}
