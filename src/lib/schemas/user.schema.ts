import { z } from 'zod'

export const SignupSchema = z.object({
  name: z.string().min(1, 'Name required').max(50),
  email: z.email('Invalid email'),
  password: z.string().min(8).max(100),
})

export const SigninSchema = z.object({
  email: z.email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})
