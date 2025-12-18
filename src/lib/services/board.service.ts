import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import { boardDal } from '@/lib/dal/board.dal'
import {
  BoardCreateSchema,
  BoardFindByIdSchema,
  BoardUpdateSchema,
  BoardRemoveSchema,
} from '@/lib/schemas/board.schema'
import { requireBoard, requireOwner } from '@/lib/services/permission.service'

export const boardService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { title } = BoardCreateSchema.parse(input)

    return boardDal.create({
      ownerId: userId,
      title,
    })
  },

  async findById(input: unknown) {
    const { boardId } = BoardFindByIdSchema.parse(input)
    const board = await requireBoard(boardId)

    if (board.visibility !== 'PRIVATE') return board

    const { id: userId } = await requireSession()
    if (board.ownerId !== userId) throw ERR.NOT_FOUND('Board not found')
    return board
  },

  async listOwnerBoards() {
    const { id: userId } = await requireSession()
    return boardDal.listByOwner({ ownerId: userId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, title, visibility } = BoardUpdateSchema.parse(input)

    await requireOwner(boardId, userId)
    const updateData = {
      ...(title !== undefined && { title }),
      ...(visibility !== undefined && { visibility }),
    }

    return boardDal.update({
      boardId,
      ...updateData,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = BoardRemoveSchema.parse(input)

    await requireOwner(boardId, userId)
    return boardDal.softDelete({ boardId })
  },
}
