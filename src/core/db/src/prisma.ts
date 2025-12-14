import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'
import { logError, logInfo } from '@/lib/logger/helper'

const connectionString = `${process.env.DATABASE_URL}`

if (!connectionString) {
  logError(
    { event: 'prisma', action: 'init' },
    new Error('DATABASE_URL is missing'),
    'DATABASE_URL is missing',
  )
  throw new Error('DATABASE_URL is missing')
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

prisma
  .$connect()
  .then(() => {
    logInfo(
      { event: 'prisma', action: 'connect' },
      'Prisma connected to database',
    )
  })
  .catch((err) => {
    logError(
      { event: 'prisma', action: 'connect' },
      err,
      'Prisma failed to connect',
    )
  })

export { prisma }
