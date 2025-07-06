export enum ROLE {
	ADMIN = 'ADMIN',
	COMPANY = 'COMPANY',
	INTERVIEWER = 'INTERVIEWER',
	CLIENT = 'CLIENT',
}

export interface AdministratorProps {
	name: string
	email: string
	password: string
	role: ROLE.ADMIN
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date | null
}
