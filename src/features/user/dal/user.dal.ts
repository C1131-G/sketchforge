import { prisma } from '@/core/db/src/prisma'
import { logger } from '@/lib/logger/logger'

export const userDal = {
  getByEmail: async (email: string) => {
    try {
      return prisma.user.findUnique({
        where: { email },
      })
    } catch (err) {
      logger.error({ err }, 'DAL getByEmail failed')
      return null
    }
  },
}
