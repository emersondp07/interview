import { ActiveSignatureUseCase } from '@/application/gateway-payment/use-cases/active-signature'
import { PrismaCompaniesRepository } from '@/infra/database/repositories/prisma-companies-repository'
import { PrismaSignaturesRepository } from '@/infra/database/repositories/prisma-signatures-repository'
import type Stripe from 'stripe'
import { ResendEmailsService } from '../../../../infra/services/email/emails'

export async function checkouCompleted(
	event: Stripe.CheckoutSessionCompletedEvent,
) {
	const { customer, subscription, status } = event.data
		.object as Stripe.Checkout.Session

	const prismaSignaturesRepository = new PrismaSignaturesRepository()
	const prismaCompaniesRepository = new PrismaCompaniesRepository()
	const resendEmailsService = new ResendEmailsService()
	const activeSignatureUseCase = new ActiveSignatureUseCase(
		prismaSignaturesRepository,
		prismaCompaniesRepository,
		resendEmailsService,
	)

	await activeSignatureUseCase.execute({
		companyId: customer as string,
		subscriptionId: subscription as string,
		stripeSubscriptionStatus: status as string,
	})

	return {
		status: 'success',
		message: 'Signature activated successfully',
	}
}
