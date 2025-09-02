import type { InterviewList } from '../../../../application/company/use-cases/interview-list'
import type { ROLE } from '../../../administrator/entities/interfaces/adminitrator.type'
import type { UniqueEntityID } from '../../../core/entities/unique-entity'

export enum SPECIALTIES {
	CARDIOLOGIA = 'CARDIOLOGIA',
	DERMATOLOGIA = 'DERMATOLOGIA',
	ENDOCRINOLOGIA = 'ENDOCRINOLOGIA',
	GASTROENTEROLOGIA = 'GASTROENTEROLOGIA',
	GINECOLOGIA = 'GINECOLOGIA',
	NEUROLOGIA = 'NEUROLOGIA',
	OFTALMOLOGIA = 'OFTALMOLOGIA',
	ORTOPEDIA = 'ORTOPEDIA',
	PEDIATRIA = 'PEDIATRIA',
	PSIQUIATRIA = 'PSIQUIATRIA',
	CLINICA_GERAL = 'CLINICA_GERAL',
	MEDICINA_DO_TRABALHO = 'MEDICINA_DO_TRABALHO',
	MEDICINA_PREVENTIVA = 'MEDICINA_PREVENTIVA',
}

export enum PROFESSIONAL_REGISTRATIONS {
	CRM = 'CRM',
	COREM = 'COREM',
}

export interface InterviewerProps {
	name: string
	email: string
	password: string
	specialty: SPECIALTIES
	profissionalRegistration: PROFESSIONAL_REGISTRATIONS
	numberRegistration: string
	experience?: string
	bio: string
	role: ROLE.INTERVIEWER
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	interviews?: InterviewList
	companyId: UniqueEntityID
}
