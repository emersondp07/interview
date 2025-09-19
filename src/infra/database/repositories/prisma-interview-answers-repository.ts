import { prisma } from '../prisma/prisma'

export class PrismaInterviewAnswersRepository {
	async findAll() {
		const answers = await prisma.interviewAnswer.findMany({
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers
	}

	async findById(answerId: string) {
		const answer = await prisma.interviewAnswer.findUnique({
			where: {
				id: answerId,
			},
		})

		return answer
	}

	async findByClientId(clientId: string) {
		const answers = await prisma.interviewAnswer.findMany({
			where: {
				client_id: clientId,
			},
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers
	}

	async findByQuestionId(questionId: string) {
		const answers = await prisma.interviewAnswer.findMany({
			where: {
				question_id: questionId,
			},
			orderBy: {
				created_at: 'desc',
			},
		})

		return answers
	}

	async findByClientAndQuestion(clientId: string, questionId: string) {
		const answer = await prisma.interviewAnswer.findFirst({
			where: {
				client_id: clientId,
				question_id: questionId,
			},
		})

		return answer
	}

	async create(data: any) {
		await prisma.interviewAnswer.create({
			data,
		})
	}

	async update(answerId: string, data: any) {
		await prisma.interviewAnswer.update({
			where: {
				id: answerId,
			},
			data,
		})
	}

	async delete(answerId: string) {
		await prisma.interviewAnswer.update({
			where: {
				id: answerId,
			},
			data: {
				deleted_at: new Date(),
				updated_at: new Date(),
			},
		})
	}
}
