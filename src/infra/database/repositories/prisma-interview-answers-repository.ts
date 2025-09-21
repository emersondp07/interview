import type { InterviewAnswersRepository } from '@/domain/interviewer/repositories/interview-answers-repository'
import type { InterviewAnswer } from '@/domain/interviewer/entities/interview-answer'
import { PrismaInterviewAnswerMapper } from '../prisma/mappers/prisma-interview-answer-mapper'
import { prisma } from '../prisma/prisma'

export class PrismaInterviewAnswersRepository implements InterviewAnswersRepository {
	async findAll(): Promise<InterviewAnswer[] | null> {
		const answers = await prisma.interviewAnswer.findMany({
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers.map(PrismaInterviewAnswerMapper.toDomain)
	}

	async findById(answerId: string): Promise<InterviewAnswer | null> {
		const answer = await prisma.interviewAnswer.findUnique({
			where: {
				id: answerId,
			},
		})

		if (!answer) {
			return null
		}

		return PrismaInterviewAnswerMapper.toDomain(answer)
	}

	async findByClientId(clientId: string): Promise<InterviewAnswer[] | null> {
		const answers = await prisma.interviewAnswer.findMany({
			where: {
				client_id: clientId,
			},
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers.map(PrismaInterviewAnswerMapper.toDomain)
	}

	async findByQuestionId(questionId: string): Promise<InterviewAnswer[] | null> {
		const answers = await prisma.interviewAnswer.findMany({
			where: {
				question_id: questionId,
			},
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers.map(PrismaInterviewAnswerMapper.toDomain)
	}

	async findByClientAndQuestion(
		clientId: string,
		questionId: string,
	): Promise<InterviewAnswer | null> {
		const answer = await prisma.interviewAnswer.findFirst({
			where: {
				client_id: clientId,
				question_id: questionId,
			},
		})

		if (!answer) {
			return null
		}

		return PrismaInterviewAnswerMapper.toDomain(answer)
	}

	async findByInterviewId(interviewId: string): Promise<InterviewAnswer[] | null> {
		const answers = await prisma.interviewAnswer.findMany({
			where: {
				interview_question: {
					interview_id: interviewId,
				},
			},
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers.map(PrismaInterviewAnswerMapper.toDomain)
	}

	async create(interviewAnswer: InterviewAnswer): Promise<void> {
		const data = PrismaInterviewAnswerMapper.toPrisma(interviewAnswer)
		await prisma.interviewAnswer.create({
			data,
		})
	}

	async update(interviewAnswer: InterviewAnswer): Promise<void> {
		const data = PrismaInterviewAnswerMapper.toPrisma(interviewAnswer)
		await prisma.interviewAnswer.update({
			where: {
				id: interviewAnswer.id.toString(),
			},
			data,
		})
	}

	async delete(interviewAnswer: InterviewAnswer): Promise<void> {
		await prisma.interviewAnswer.update({
			where: {
				id: interviewAnswer.id.toString(),
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
