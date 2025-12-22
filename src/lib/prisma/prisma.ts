import 'dotenv/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@/prisma/generated/prisma/client'
import { createLogger } from '@/lib/logger/logger'

const log = createLogger({ event: 'prisma', action: 'connect' })
const connectionString = `${process.env.DATABASE_URL}`

if (!connectionString) {
  const err = new Error('DATABASE_URL is missing')
  log.error(err, 'DATABASE_URL is missing')
  throw err
}

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

prisma
  .$connect()
  .then(() => {
    log.info('Prisma connected to database')
  })
  .catch((err) => {
    log.error(err, 'Prisma failed to connect')
    throw err
  })

export { prisma }
