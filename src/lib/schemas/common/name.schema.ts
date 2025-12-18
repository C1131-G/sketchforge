import { z } from 'zod'

export const TitleSchema = z
  .string()
  .trim()
  .min(1, 'Title is required')
  .max(255, 'Title is too long')
