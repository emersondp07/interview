import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['dev', 'test', 'prod']).default('dev'),
	PORT: z.coerce.number().default(3000),
	JWT_SECRET: z.string(),
	DATABASE_URL: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	STRIPE_WEBHOOK_SECRET_KEY: z.string(),
	EMAIL_ADM: z.string(),
	RESEND_EMAIL_API_KEY: z.string(),
	URL_FRONTEND: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
	console.error('❌ Invalid enviroment variable', _env.error.format())

	throw new Error('Invalid enviroment variables')
}

export const env = _env.data
