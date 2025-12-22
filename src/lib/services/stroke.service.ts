import { requireSession } from '@/lib/auth/require-session'
import {
  StrokeCreateSchema,
  StrokeFindByIdSchema,
  StrokeListByBoardSchema,
  StrokeRemoveSchema,
} from '@/lib/schemas/stroke.schema'
import { strokeDal } from '@/lib/dal/stroke.dal'
import { layerDal } from '@/lib/dal/layer.dal'
import { ERR } from '@/lib/errors/error.map'
import {
  requireBoardAccess,
  requireEditorAccess,
} from '@/lib/services/permission.service'
import { cacheLife, cacheTag, revalidateTag } from 'next/cache'

export const strokeService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, layerId, pointsBlob, penPropsJson } =
      StrokeCreateSchema.parse(input)

    await requireEditorAccess(boardId, userId)

    const layer = await layerDal.findActiveById({ layerId })
    if (!layer || layer.boardId !== boardId) {
      throw ERR.NOT_FOUND('Layer not found')
    }

    const createStroke = await strokeDal.create({
      boardId,
      layerId,
      ownerId: userId,
      pointsBlob,
      penPropsJson,
    })

    revalidateTag(`board:${boardId}:strokes`, 'max')
    return createStroke
  },

  async findById(input: unknown) {
    'use cache'
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeFindByIdSchema.parse(input)

    cacheTag(`strokeId:${strokeId}`)
    cacheLife('minutes')

    const stroke = await strokeDal.findActiveById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    await requireBoardAccess(stroke.boardId, userId)
    return stroke
  },

  async listByBoard(input: unknown) {
    'use cache'
    const { id: userId } = await requireSession()
    const { boardId } = StrokeListByBoardSchema.parse(input)

    cacheTag(`board:${boardId}:strokes`)
    cacheLife('minutes')

    await requireBoardAccess(boardId, userId)
    return strokeDal.listByBoard({ boardId })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeRemoveSchema.parse(input)

    const stroke = await strokeDal.findActiveById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    await requireEditorAccess(stroke.boardId, userId)
    await strokeDal.softDelete({ strokeId })

    revalidateTag(`strokeId:${strokeId}`, 'max')
    revalidateTag(`board:${stroke.boardId}:strokes`, 'max')

    return { success: true }
  },
}
