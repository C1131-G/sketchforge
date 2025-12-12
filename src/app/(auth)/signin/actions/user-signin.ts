'use server'

import { signinSchema } from '@/features/user/validation/signin.schema'
import { auth } from '@/core/auth/auth'
import bcrypt from 'bcryptjs'
import { logger } from '@/lib/logger/logger'
import { userService } from '@/features/user/service/user.service'

export async function signIn(fromData: FormData) {
  try {
    const raw = {
      email: fromData.get('email'),
      password: fromData.get('password'),
    }

    const validated = signinSchema.safeParse(raw)
    if (!validated.success) {
      return {
        success: false,
        error: 'validation failed',
      }
    }

    const { email, password } = validated.data

    const checkUser = await userService.findByEmail(email)
    if (!checkUser.success || !checkUser.data) {
      return {
        success: false,
        error: checkUser.error || 'Invalid email or account does not exist',
      }
    }

    const user = checkUser.data

    const checkPassword = await bcrypt.compare(password, user.hashedPassword)
    if (!checkPassword) {
      return {
        success: false,
        error: 'Invalid password',
      }
    }

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: '/',
      },
    })

    return {
      success: true,
      data: {
        url: result.url ?? '',
        token: result.token ?? null,
        user: result.user,
        redirect: result.redirect ?? false,
      },
    }
  } catch (err) {
    logger.error(err)
    return {
      success: false,
      data: err instanceof Error ? err.message : 'server error',
    }
  }
}
