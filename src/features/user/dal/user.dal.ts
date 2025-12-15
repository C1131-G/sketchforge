import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'

export const userDal = {
  getByEmail: async (email: string) => {
    try {
      return await prisma.user.findUnique({
        where: { email },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'user.getByEmail', meta: { email } },
        err,
        'User dal getByEmail crashed',
      )
      return null
    }
  },
}
