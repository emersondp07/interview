export enum ROLE {
	ADMIN = 'admin',
	COMPANY = 'company',
	INTERVIEWR = 'interviewer',
}

export interface AdministratorProps {
	name: string
	email: string
	password: string
	role: ROLE.ADMIN
	createdAt: Date
	updatedAt: Date
}
