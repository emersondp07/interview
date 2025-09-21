import type { PaginationParams } from '@/domain/core/repositories/pagination-params'
import type { InterviewQuestion } from '@/domain/interviewer/entities/interview-question'
import type { InterviewQuestionsRepository } from '@/domain/interviewer/repositories/interview-questions-repository'
import { PrismaInterviewQuestionMapper } from '../prisma/mappers/prisma-interview-question-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewQuestionsRepository
	implements InterviewQuestionsRepository
{
	async findAll({ page }: PaginationParams) {
		const questions = await prisma.interviewQuestion.findMany({
			take: 10,
			skip: (page - 1) * 10,
			orderBy: {
				created_at: 'desc',
			},
		})

		return questions.map(PrismaInterviewQuestionMapper.toDomain)
	}

	async findById(questionId: string) {
		const question = await prisma.interviewQuestion.findUnique({
			where: {
				id: questionId,
			},
		})

		return question ? PrismaInterviewQuestionMapper.toDomain(question) : null
	}

	async findByInterviewId(interviewId: string) {
		const questions = await prisma.interviewQuestion.findMany({
			where: {
				interview_id: interviewId,
			},
			orderBy: {
				created_at: 'asc',
			},
		})

		return questions.map(PrismaInterviewQuestionMapper.toDomain)
	}

	async create(interviewQuestion: InterviewQuestion): Promise<void> {
		const data = PrismaInterviewQuestionMapper.toPrisma(interviewQuestion)
		await prisma.interviewQuestion.create({
			data,
		})
	}

	async update(questionId: string, interviewQuestion: InterviewQuestion): Promise<void> {
		const data = PrismaInterviewQuestionMapper.toPrisma(interviewQuestion)
		await prisma.interviewQuestion.update({
			where: {
				id: questionId,
			},
			data: {
				...data,
				updated_at: new Date(),
			},
		})
	}

	async delete(questionId: string): Promise<void> {
		await prisma.interviewQuestion.update({
			where: {
				id: questionId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
