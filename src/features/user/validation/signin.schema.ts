import { z } from 'zod'

export const signinSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

export type SignInInput = z.infer<typeof signinSchema>
