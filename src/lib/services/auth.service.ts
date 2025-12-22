import { SigninSchema, SignupSchema } from '@/lib/schemas/user.schema'
import { createLogger } from '@/lib/logger/logger'
import { ERR } from '@/lib/errors/error.map'
import { userService } from '@/lib/services/user.service'
import { auth } from '@/lib/auth/auth'
import { SocialProviderType } from '@/lib/types/social.types'

export const authService = {
  async signUp(input: unknown) {
    const log = createLogger({ event: 'auth', action: 'signup' })

    const parsed = SignupSchema.safeParse(input)
    if (!parsed.success) {
      log.warn('Signup failed: invalid input')
      throw ERR.BAD_REQUEST('Invalid signup data')
    }

    const { name, email, password } = parsed.data

    const existing = await userService.findByEmail({ email })

    if (existing) {
      log.warn('Signup failed: user already exists')
      throw ERR.CONFLICT('User already exists')
    }

    const result = await auth.api.signUpEmail({
      body: {
        name,
        email,
        password,
        callbackURL: '/',
      },
    })

    log.info('Signup successful')

    return {
      token: result.token ?? null,
      user: result.user,
    }
  },

  async signIn(input: unknown) {
    const log = createLogger({ event: 'auth', action: 'signin' })

    const parsed = SigninSchema.safeParse(input)
    if (!parsed.success) {
      log.warn('Signin failed: invalid input')
      throw ERR.BAD_REQUEST('Invalid email or password')
    }

    const { email, password } = parsed.data

    const result = await auth.api.signInEmail({
      body: {
        email,
        password,
        callbackURL: '/',
      },
    })

    log.info('Signin successful')

    return {
      url: result.url ?? '',
      token: result.token ?? null,
      user: result.user,
      redirect: result.redirect ?? false,
    }
  },

  async signOut(headers: Headers) {
    const log = createLogger({ event: 'auth', action: 'signout' })

    const result = await auth.api.signOut({ headers })

    log.info('Signout successful')

    return {
      redirect: result.success ?? false,
    }
  },

  async signInSocial(provider: SocialProviderType) {
    const log = createLogger({
      event: 'auth',
      action: 'signin.social',
      meta: { provider },
    })

    const result = await auth.api.signInSocial({
      body: {
        provider,
        callbackURL: '/',
      },
    })

    if (!result.url) {
      throw ERR.INTERNAL('Social sign-in failed')
    }

    log.info('Social signin redirect issued')

    return result.url
  },
}
