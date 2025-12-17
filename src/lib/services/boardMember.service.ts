import { requireSession } from '@/lib/auth/require-session'
import { ERR } from '@/lib/errors/error.map'
import { boardMemberDal } from '@/lib/dal/boardMember.dal'
import {
  BoardMemberCreateSchema,
  BoardMemberRemoveSchema,
  BoardMemberUpdateSchema,
  CreateInviteSchema,
  AcceptInviteSchema,
  RevokeInviteSchema,
  BoardMemberListOfBoardsSchema,
} from '@/lib/schemas/boardMember.schema'
import { boardDal } from '@/lib/dal/board.dal'
import { RoleType } from '@/prisma/generated/prisma/enums'

export const boardMemberService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, role, targetUserId } = BoardMemberCreateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can add members')

    const existing = await boardMemberDal.findById({
      boardId,
      userId: targetUserId,
    })
    if (existing) throw ERR.CONFLICT('User already a member')

    return await boardMemberDal.create({
      targetUserId,
      boardId,
      role,
    })
  },

  async listMembers(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = BoardMemberListOfBoardsSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')

    if (board.ownerId !== userId) {
      const member = await boardMemberDal.findById({
        userId,
        boardId,
      })

      if (!member) throw ERR.UNAUTHORIZED()
    }

    return boardMemberDal.listMembers({ boardId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, role, targetUserId } = BoardMemberUpdateSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can update roles')
    if (targetUserId === board.ownerId)
      throw ERR.BAD_REQUEST('Cannot change owner role')

    return boardMemberDal.update({
      boardId,
      targetUserId,
      role: role ?? RoleType.EDITOR,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, targetUserId } = BoardMemberRemoveSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can remove members')
    if (targetUserId === board.ownerId)
      throw ERR.BAD_REQUEST('Cannot remove board owner')
    return await boardMemberDal.remove({
      boardId,
      targetUserId,
    })
  },

  async createInvite(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, role, token } = CreateInviteSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can invite')

    return boardMemberDal.createInvite({
      boardId,
      token,
      role: role ?? RoleType.EDITOR,
    })
  },

  async acceptInvite(input: unknown) {
    const { id: userId } = await requireSession()
    const { token } = AcceptInviteSchema.parse(input)

    const invite = await boardMemberDal.findInviteByToken({ token })
    if (!invite) throw ERR.NOT_FOUND('Invalid or expired invite')

    const existing = await boardMemberDal.findById({
      boardId: invite.boardId,
      userId,
    })
    if (existing) throw ERR.CONFLICT('Already a member')

    return boardMemberDal.acceptInvite({
      token,
      userId,
    })
  },

  async revokeInvite(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, token } = RevokeInviteSchema.parse(input)

    const board = await boardDal.findById({ boardId })
    if (!board) throw ERR.NOT_FOUND('Board not found')
    if (board.ownerId !== userId)
      throw ERR.UNAUTHORIZED('Only owner can revoke invites')

    return boardMemberDal.revokeInvite({ token })
  },
}
