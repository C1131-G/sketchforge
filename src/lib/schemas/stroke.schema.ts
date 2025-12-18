import { z } from 'zod'
import {
  BoardIdSchema,
  LayerIdSchema,
  StrokeIdSchema,
} from '@/lib/schemas/common/id.schema'
import { JsonValueSchema } from '@/lib/schemas/common/json.schema'

export const StrokeCreateSchema = z.object({
  boardId: BoardIdSchema,
  layerId: LayerIdSchema,
  pointsBlob: z.instanceof(Uint8Array),
  penPropsJson: JsonValueSchema,
})

export const StrokeFindByIdSchema = z.object({
  strokeId: StrokeIdSchema,
})

export const StrokeListByBoardSchema = z.object({
  boardId: BoardIdSchema,
})

export const StrokeRemoveSchema = z.object({
  strokeId: StrokeIdSchema,
})
