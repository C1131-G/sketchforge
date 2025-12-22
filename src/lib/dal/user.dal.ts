import { prisma } from '@/lib/prisma/prisma'
import { createLogger } from '@/lib/logger/logger'
import { ERR } from '@/lib/errors/error.map'

export const userDal = {
  async findByEmail(data: { email: string }) {
    const log = createLogger({
      event: 'db',
      action: 'user.findByEmail',
      meta: { email: data.email },
    })

    try {
      return await prisma.user.findUnique({
        where: { email: data.email },
      })
    } catch (err) {
      log.error(err, 'User findByEmail failed')
      throw ERR.INTERNAL('Failed to fetch user')
    }
  },
}
