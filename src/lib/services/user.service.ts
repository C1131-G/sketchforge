import { userDal } from '@/lib/dal/user.dal'
import { ERR } from '@/lib/errors/error.map'

export const userService = {
  //   email comes from parsed auth service so no need to parse again.
  async findByEmail(data: { email: string }) {
    const user = await userDal.findByEmail({
      email: data.email,
    })

    if (!user) throw ERR.NOT_FOUND('User not found')

    return user
  },
}
