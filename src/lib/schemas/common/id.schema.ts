import { z } from 'zod'

export const BoardIdSchema = z.cuid()
export const UserIdSchema = z.cuid()
export const LayerZIndexSchema = z.int()
export const LayerIdSchema = z.cuid()
