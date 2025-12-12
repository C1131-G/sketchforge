import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { logger } from '@/lib/logger/logger'

const connectionString = `${process.env.DATABASE_URL}`

if (!connectionString) {
  logger.error('Prisma initialization failed: DATABASE_URL is missing')
  throw new Error('DATABASE_URL is missing')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

prisma
  .$connect()
  .then(() => {
    logger.info('Prisma connected to database')
  })
  .catch((err) => {
    logger.error({ err }, 'Prisma failed to connect')
  })

export { prisma }
