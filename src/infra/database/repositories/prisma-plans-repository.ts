import type { PaginationParams } from '@/core/repositories/pagination-params'
import type { PlansRepository } from '@/domain/administrator/application/repositories/plans-repository'
import type { Plan } from '@/domain/administrator/enterprise/entities/plan'
import { prisma } from '../prisma/prisma'

export class PrismaPlansRepository implements PlansRepository {
	async findAll({ page }: PaginationParams) {
		return prisma.plan.findMany({
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				interview_limit: true,
			},
			take: 10,
			skip: (page - 1) * 10,
		}) as unknown as Plan[]
	}

	async findById(planId: string) {
		return prisma.plan.findUnique({
			where: {
				id: planId,
			},
			select: {
				id: true,
				name: true,
				price: true,
				description: true,
				interview_limit: true,
			},
		}) as unknown as Plan
	}

	async create(plan: Plan) {
		await prisma.plan.create({
			data: {
				name: plan.name,
				price: plan.price,
				description: plan.description,
				interview_limit: plan.interviewLimit,
			},
		})
	}
}
