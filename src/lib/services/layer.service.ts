import { requireSession } from '@/lib/auth/require-session'
import {
  LayerCreateSchema,
  LayerFindByIdSchema,
  LayerListByBoardSchema,
  LayerRemoveSchema,
  LayerUpdateSchema,
} from '@/lib/schemas/layer.schema'
import { layerDal } from '@/lib/dal/layer.dal'
import { ERR } from '@/lib/errors/error.map'
import {
  requireBoardAccess,
  requireEditorAccess,
} from '@/lib/services/permission.service'

export const layerService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, name, zIndex } = LayerCreateSchema.parse(input)

    await requireEditorAccess(boardId, userId)

    return layerDal.create({
      boardId,
      name,
      zIndex,
    })
  },

  async listByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = LayerListByBoardSchema.parse(input)

    await requireBoardAccess(boardId, userId)
    return layerDal.listByBoard({ boardId })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId } = LayerFindByIdSchema.parse(input)

    const layer = await layerDal.findActiveById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    await requireBoardAccess(layer.boardId, userId)
    return layer
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId, name, isLocked, isVisible, zIndex } =
      LayerUpdateSchema.parse(input)

    const layer = await layerDal.findActiveById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    await requireEditorAccess(layer.boardId, userId)

    const updateData = {
      ...(name !== undefined && { name }),
      ...(isLocked !== undefined && { isLocked }),
      ...(isVisible !== undefined && { isVisible }),
      ...(zIndex !== undefined && { zIndex }),
    }

    return layerDal.update({
      layerId,
      ...updateData,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { layerId } = LayerRemoveSchema.parse(input)

    const layer = await layerDal.findActiveById({ layerId })
    if (!layer) throw ERR.NOT_FOUND('Layer not found')

    await requireEditorAccess(layer.boardId, userId)
    return layerDal.softDelete({ layerId })
  },
}
