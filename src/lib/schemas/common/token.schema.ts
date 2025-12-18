import { z } from 'zod'

export const TokenSchema = z
  .string()
  .min(32, 'Invalid invite token')
  .max(128, 'Invalid invite token')
