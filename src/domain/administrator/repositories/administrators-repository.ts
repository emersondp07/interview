import type { Administrator } from '../entities/administrator'

export interface AdministratorsRepository {
	create(administrator: Administrator): Promise<void>
	findByEmail(email: string): Promise<Administrator | null>
}
