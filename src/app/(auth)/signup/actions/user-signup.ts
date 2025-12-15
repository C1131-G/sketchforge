'use server'

import { signupSchema } from '@/features/user/validation/signup.schema'
import { auth } from '@/core/auth/auth'
import { userService } from '@/features/user/service/user.service'
import { logError, logFailed, logSuccess } from '@/lib/logger/helper'

export async function signUp(formData: FormData) {
  try {
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const validated = signupSchema.safeParse(raw)
    if (!validated.success) {
      logFailed(
        { event: 'auth', action: 'signup' },
        'Signup failed: validation',
      )
      return {
        success: false,
        error: 'Invalid input',
      }
    }

    const { email, password, name } = validated.data

    const checkUser = await userService.findByEmail(email)
    if (checkUser.success) {
      logFailed(
        { event: 'auth', action: 'signup', meta: { email } },
        'Signup failed: user exists',
      )
      return {
        success: false,
        error: checkUser.error || 'User already exists. Please login.',
      }
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: '/',
      },
    })

    logSuccess(
      { event: 'auth', action: 'signup', meta: { email } },
      'Signup successful',
    )

    return {
      success: true,
      data: {
        token: result.token ?? null,
        user: result.user,
      },
    }
  } catch (err) {
    logError({ event: 'auth', action: 'signup' }, err, 'Signup crashed')

    return {
      success: false,
      error: 'Something went wrong',
    }
  }
}
