import { userDal } from '@/features/user/dal/user.dal'

export const userService = {
  findByEmail: async (email: string) => {
    const user = await userDal.getByEmail(email)

    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    return {
      success: true,
      data: user,
    }
  },
}
