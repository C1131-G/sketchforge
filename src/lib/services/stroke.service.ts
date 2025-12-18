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

    return strokeDal.create({
      boardId,
      layerId,
      ownerId: userId,
      pointsBlob,
      penPropsJson,
    })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeFindByIdSchema.parse(input)

    const stroke = await strokeDal.findActiveById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    await requireBoardAccess(stroke.boardId, userId)
    return stroke
  },

  async listByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = StrokeListByBoardSchema.parse(input)

    await requireBoardAccess(boardId, userId)
    return strokeDal.listByBoard({ boardId })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { strokeId } = StrokeRemoveSchema.parse(input)

    const stroke = await strokeDal.findActiveById({ strokeId })
    if (!stroke) throw ERR.NOT_FOUND('Stroke not found')

    await requireEditorAccess(stroke.boardId, userId)
    return strokeDal.softDelete({ strokeId })
  },
}
