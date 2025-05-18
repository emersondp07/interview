import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { InterviewersRepository } from '@/domain/interviewer/application/repositories/interviewers-repository'
import type { Interviewer } from '@/domain/interviewer/enterprise/entities/interviewer'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewersRepository implements InterviewersRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.interviewer.findMany({
			select: {
				id: true,
				name: true,
				email: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Interviewer[]
	}

	async findById(interviewerId: string) {
		return prisma.interviewer.findUnique({
			where: {
				id: interviewerId,
			},
			select: {
				id: true,
				name: true,
				email: true,
				password: true,
			},
		}) as unknown as Interviewer
	}

	async findByEmail(email: string) {
		return prisma.company.findUnique({
			where: {
				email,
			},
			select: {
				id: true,
				corporate_reason: true,
				cnpj: true,
				email: true,
				phone: true,
			},
		}) as unknown as Interviewer
	}

	async create(interviewer: Interviewer) {
		await prisma.interviewer.create({
			data: {
				name: interviewer.name,
				email: interviewer.email,
				password: interviewer.password,
				role: interviewer.role,
				company_id: interviewer.companyId.toString(),
			},
		})
	}

	async delete(interviewerId: string) {
		await prisma.interviewer.update({
			where: {
				id: interviewerId,
			},
			data: {
				deleted_at: new Date(),
			},
		})
	}
}
