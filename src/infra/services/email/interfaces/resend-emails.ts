export interface IResendEmails {
	sendEmail(to: string, subject: string, html: string): Promise<void>
}
