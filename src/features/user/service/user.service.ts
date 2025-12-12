import { userDal } from '@/features/user/dal/user.dal'
import { logger } from '@/lib/logger/logger'

export const userService = {
  findByEmail: async (email: string) => {
    try {
      const user = await userDal.getByEmail(email)
      if (!user) {
        return { success: false, error: 'User not found' }
      }

      return { success: true, data: user }
    } catch (err) {
      logger.error({ err }, 'SERVICE getByEmail failed')
      return { success: false, error: 'Service failure' }
    }
  },
}
