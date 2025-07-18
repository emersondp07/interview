import { WatchedList } from '@/domain/core/entities/watched-list'
import type { Interview } from '@/domain/interviewer/entities/interview'

export class InterviewList extends WatchedList<Interview> {
	compareItems(a: Interview, b: Interview): boolean {
		return a.id.equals(b.id)
	}
}
