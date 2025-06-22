export interface PlanProps {
	name: string
	price: string
	interviewLimit: number
	description: string
	createdAt: Date
	updatedAt: Date
	deletedAt?: Date
	stripeProductId: string
}
