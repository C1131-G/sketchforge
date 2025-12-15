'use server'

import { signinSchema } from '@/features/user/validation/signin.schema'
import { auth } from '@/core/auth/auth'
import { userService } from '@/features/user/service/user.service'
import { logError, logFailed, logSuccess } from '@/lib/logger/helper'

export async function signIn(fromData: FormData) {
  try {
    const raw = {
      email: fromData.get('email'),
      password: fromData.get('password'),
    }

    const validated = signinSchema.safeParse(raw)
    if (!validated.success) {
      logFailed(
        { event: 'auth', action: 'signin' },
        'Signin failed: validation',
      )
      return {
        success: false,
        error: 'Invalid input',
      }
    }

    const { email, password } = validated.data

    const checkUser = await userService.findByEmail(email)
    if (!checkUser.success || !checkUser.data) {
      logFailed(
        { event: 'auth', action: 'signin', meta: { email } },
        'Signin failed: user not found',
      )
      return {
        success: false,
        error: checkUser.error || 'Invalid email or password',
      }
    }

    const user = checkUser.data

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: '/',
      },
    })

    logSuccess(
      { event: 'auth', action: 'signin', userId: user.id },
      'Signin successful',
    )

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
    logError({ event: 'auth', action: 'signin' }, err, 'Signin crashed')

    return {
      success: false,
      error: 'Something went wrong',
    }
  }
}
