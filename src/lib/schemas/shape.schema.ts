import { z } from 'zod'
import {
  BoardIdSchema,
  LayerIdSchema,
  ShapeIdSchema,
  ShapeZIndexSchema,
} from '@/lib/schemas/common/id.schema'
import { ShapeSchema } from '@/lib/schemas/common/enum.schema'
import { JsonValueSchema } from '@/lib/schemas/common/json.schema'

export const ShapeCreateSchema = z.object({
  boardId: BoardIdSchema,
  layerId: LayerIdSchema,
  type: ShapeSchema,
  dataJson: JsonValueSchema,
  styleJson: JsonValueSchema,
  zIndex: ShapeZIndexSchema,
})

export const ShapeLoadByBoardSchema = z.object({
  boardId: BoardIdSchema,
})

export const ShapeFindByIdSchema = z.object({
  shapeId: ShapeIdSchema,
})

export const ShapeUpdateSchema = z
  .object({
    shapeId: ShapeIdSchema,
    dataJson: JsonValueSchema.optional(),
    styleJson: JsonValueSchema.optional(),
    zIndex: ShapeZIndexSchema.optional(),
    layerId: LayerIdSchema.optional(),
  })
  .refine(
    (data) =>
      data.dataJson !== undefined ||
      data.styleJson !== undefined ||
      data.zIndex !== undefined ||
      data.layerId !== undefined,
    {
      message: 'At least one field must be updated',
      path: ['dataJson'],
    },
  )

export const ShapeRemoveSchema = z.object({
  shapeId: ShapeIdSchema,
})
