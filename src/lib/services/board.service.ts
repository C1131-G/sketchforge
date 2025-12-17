import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import {
  BoardCreateSchema,
  BoardFindByIdSchema,
  BoardRemoveSchema,
  BoardUpdateSchema,
} from '@/lib/schemas/board.schema'
import { boardDal } from '@/lib/dal/board.dal'

export const boardService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { title } = BoardCreateSchema.parse(input)

    return boardDal.create({
      title,
      ownerId: userId,
    })
  },
  async findById(input: unknown) {
    const { boardId } = BoardFindByIdSchema.parse(input)
    const board = await boardDal.findById({ boardId })

    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.visibility !== 'PRIVATE') return board

    const { id: userId } = await requireSession()

    if (board.ownerId !== userId) throw ERR.NOT_FOUND('Board not found')

    return board
  },

  async listOwnerBoards() {
    const { id: userId } = await requireSession()
    return boardDal.listOwnerBoards({ ownerId: userId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, visibility, title } = BoardUpdateSchema.parse(input)

    const board = await boardDal.findById({ boardId })

    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can update board')

    return boardDal.update({
      boardId,
      ownerId: userId,
      ...(title !== undefined && { title }),
      ...(visibility !== undefined && { visibility }),
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = BoardRemoveSchema.parse(input)

    const board = await boardDal.findById({ boardId })

    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can delete board')

    return boardDal.remove({
      boardId,
      ownerId: userId,
    })
  },
}
