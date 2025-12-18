import { z } from 'zod'

export const TokenSchema = z
  .string()
  .min(32, 'Invalid token')
  .max(128, 'Invalid token')
