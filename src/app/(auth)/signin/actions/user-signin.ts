'use server'

import { signinSchema } from '@/features/user/validation/signin.schema'
import { auth } from '@/core/auth/auth'

export async function signIn(fromData: FormData) {
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

  return await auth.api.signInEmail({
    body: {
      email,
      password,
      callbackURL: '/',
    },
  })
}
