import { prisma } from '@/lib/prisma/prisma'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const userDal = {
  async findByEmail(data: { email: string }) {
    const log = withLogContext({ event: 'db', action: 'user.getByEmail' })
    try {
      return await prisma.user.findUnique({
        where: { email: data.email },
      })
    } catch (err) {
      log.error(err, 'User DAL: getByEmail failed')
      throw ERR.INTERNAL('Failed to fetch user')
    }
  },
}
