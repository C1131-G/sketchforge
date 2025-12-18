import { z } from 'zod'

export const BoardIdSchema = z.cuid()
export const LayerIdSchema = z.cuid()
export const ShapeIdSchema = z.cuid()
export const TargetUserIdSchema = z.cuid()
export const LayerZIndexSchema = z.number().int().min(0)
export const ShapeZIndexSchema = z.number().int().min(0)
