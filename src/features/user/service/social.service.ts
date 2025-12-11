import { auth } from '@/core/auth/auth'
import { redirect } from 'next/navigation'
import { SocialProviderType } from '@/features/user/types/social.types'

export async function signInSocial(provider: SocialProviderType) {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
      callbackURL: '/',
    },
  })

  if (url) {
    redirect(url)
  }
}
