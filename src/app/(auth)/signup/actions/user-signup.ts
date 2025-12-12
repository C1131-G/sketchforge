'use server'

import { signupSchema } from '@/features/user/validation/signup.schema'
import { auth } from '@/core/auth/auth'
import { logger } from '@/lib/logger/logger'
import bcrypt from 'bcryptjs'
import { userService } from '@/features/user/service/user.service'

export async function signUp(formData: FormData) {
  try {
    const raw = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    }

    const validated = signupSchema.safeParse(raw)
    if (!validated.success) {
      return {
        success: false,
        error: 'validation failed',
      }
    }

    const { email, password, name } = validated.data

    const checkUser = await userService.findByEmail(email)
    if (checkUser) {
      return {
        success: false,
        error: 'User already exists try login!',
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password: hashedPassword,
        callbackURL: '/',
      },
    })

    return {
      success: true,
      data: {
        token: result.token ?? null,
        user: result.user,
      },
    }
  } catch (err) {
    logger.error(err)
    return {
      success: false,
      error: err instanceof Error ? err.message : 'server error',
    }
  }
}
