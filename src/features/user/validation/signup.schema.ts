import { z } from 'zod'

export const signupSchema = z.object({
  name: z.string().min(1, 'Name required').max(50, 'Name too long'),
  email: z.email('Invalid email'),
  password: z
    .string()
    .min(8, 'Password too short')
    .max(100, 'Password too long'),
})

export type SignUpInput = z.infer<typeof signupSchema>
