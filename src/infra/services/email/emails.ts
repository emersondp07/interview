import { Resend } from 'resend'
import { env } from '../../config'
import type { IResendEmails } from './interfaces/resend-emails'

export class ResendEmailsService implements IResendEmails {
	private readonly resend: Resend

	constructor() {
		this.resend = new Resend(env.RESEND_EMAIL_API_KEY)
	}

	async sendEmail(to: string, subject: string, html: string): Promise<void> {
		await this.resend.emails.send({
			from: 'onboarding@resend.dev',
			to,
			subject,
			html,
		})
	}
}
