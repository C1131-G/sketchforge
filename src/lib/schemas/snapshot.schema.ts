import { z } from 'zod'
import { BoardIdSchema, SnapshotIdSchema } from '@/lib/schemas/common/id.schema'
import { JsonValueSchema } from '@/lib/schemas/common/json.schema'
import { SnapshotKindSchema } from '@/lib/schemas/common/enum.schema'

export const SnapshotCreateSchema = z.object({
  boardId: BoardIdSchema,
  kind: SnapshotKindSchema,
  snapshotJson: JsonValueSchema,
})

export const SnapshotListByBoardSchema = z.object({
  boardId: BoardIdSchema,
})

export const SnapshotFindByIdSchema = z.object({
  snapshotId: SnapshotIdSchema,
})
