import type { CreateEmailResponse } from 'resend'

export class InMemoryResendEmailsService {
	public items: CreateEmailResponse[] = []

	async sendEmail(to: string, subject: string, html: string) {
		const emailRecord: CreateEmailResponse = {
			data: {
				id: `email_${Math.random().toString(36).substring(2, 15)}`,
			},
			error: null,
		}

		this.items.push(emailRecord)
	}
}
