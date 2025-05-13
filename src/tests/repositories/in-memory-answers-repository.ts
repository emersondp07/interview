import type { AnswersRepository } from '@/domain/administrator/application/repositories/answers-repository'
import type { Answer } from '@/domain/administrator/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
	public items: Answer[] = []

	async create(answer: Answer) {
		this.items.push(answer)
	}
}
