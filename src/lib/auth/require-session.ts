import { SessionUser } from '@/lib/types/sessionuser.types'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { ERR } from '@/lib/errors/error.map'

export async function requireSession(): Promise<SessionUser> {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session || !session.user) {
    throw ERR.UNAUTHORIZED()
  }

  return {
    id: session.user.id,
    email: session.user.email ?? null,
    name: session.user.name ?? null,
  }
}
