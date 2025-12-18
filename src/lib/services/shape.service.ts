import { requireSession } from '@/lib/auth/require-session'
import {
  ShapeCreateSchema,
  ShapeFindByIdSchema,
  ShapeLoadByBoardSchema,
  ShapeRemoveSchema,
  ShapeUpdateSchema,
} from '@/lib/schemas/shape.schema'
import { shapeDal } from '@/lib/dal/shape.dal'
import { layerDal } from '@/lib/dal/layer.dal'
import { ERR } from '@/lib/errors/error.map'
import {
  requireBoardAccess,
  requireEditorAccess,
} from '@/lib/services/permission.service'

export const shapeService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, layerId, type, dataJson, styleJson, zIndex } =
      ShapeCreateSchema.parse(input)

    await requireEditorAccess(boardId, userId)

    const layer = await layerDal.findActiveById({ layerId })
    if (!layer || layer.boardId !== boardId) {
      throw ERR.NOT_FOUND('Layer not found')
    }

    return shapeDal.create({
      boardId,
      layerId,
      type,
      dataJson,
      styleJson,
      ownerId: userId,
      zIndex,
    })
  },

  async findById(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId } = ShapeFindByIdSchema.parse(input)

    const shape = await shapeDal.findActiveById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    await requireBoardAccess(shape.boardId, userId)
    return shape
  },

  async loadByBoard(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = ShapeLoadByBoardSchema.parse(input)

    await requireBoardAccess(boardId, userId)
    return shapeDal.loadByBoard({ boardId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId, dataJson, styleJson, zIndex, layerId } =
      ShapeUpdateSchema.parse(input)

    const shape = await shapeDal.findActiveById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    await requireEditorAccess(shape.boardId, userId)

    if (layerId !== undefined) {
      const layer = await layerDal.findActiveById({ layerId })
      if (!layer || layer.boardId !== shape.boardId) {
        throw ERR.NOT_FOUND('Layer not found')
      }
    }

    const updateData = {
      ...(dataJson !== undefined && { dataJson }),
      ...(styleJson !== undefined && { styleJson }),
      ...(zIndex !== undefined && { zIndex }),
      ...(layerId !== undefined && { layerId }),
    }

    return shapeDal.update({
      shapeId,
      ...updateData,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { shapeId } = ShapeRemoveSchema.parse(input)

    const shape = await shapeDal.findActiveById({ shapeId })
    if (!shape) throw ERR.NOT_FOUND('Shape not found')

    await requireEditorAccess(shape.boardId, userId)
    return shapeDal.softDelete({ shapeId })
  },
}
