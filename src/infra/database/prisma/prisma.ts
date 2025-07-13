import { PrismaClient } from '@prisma/client'
import { env } from '../../config'

const prisma = new PrismaClient({
	log: env.NODE_ENV === 'dev' ? ['query'] : [],
})

process.on('beforeExit', async () => {
	await prisma.$disconnect()
})

export { prisma }
