import { ERR } from '@/lib/errors/error.map'
import { boardDal } from '@/lib/dal/board.dal'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import { RoleType } from '@/prisma/generated/prisma/enums'

export async function requireBoard(boardId: string) {
  const board = await boardDal.findActiveById({ boardId })
  if (!board) throw ERR.NOT_FOUND('Board not found')
  return board
}

export async function requireBoardAccess(boardId: string, userId: string) {
  const board = await requireBoard(boardId)

  if (board.ownerId === userId) return { board, role: 'OWNER' as const }

  const member = await boardMemberDal.findById({ boardId, userId })
  if (!member) throw ERR.NOT_FOUND('Board not found')

  return { board, role: member.role }
}

export async function requireEditorAccess(boardId: string, userId: string) {
  const access = await requireBoardAccess(boardId, userId)

  if (access.role === RoleType.VIEWER) {
    throw ERR.UNAUTHORIZED('Only owner or editor allowed')
  }

  return access
}

export async function requireOwner(boardId: string, userId: string) {
  const board = await requireBoard(boardId)
  if (board.ownerId !== userId) {
    throw ERR.UNAUTHORIZED('Only owner allowed')
  }
  return board
}
