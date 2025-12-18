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
import { RoleType } from '@/prisma/generated/prisma/enums'
import {
  requireBoardAccess,
  requireOwner,
} from '@/lib/services/permission.service'

export const boardMemberService = {
  async create(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, role, targetUserId } = BoardMemberCreateSchema.parse(input)

    await requireOwner(boardId, userId)

    const existing = await boardMemberDal.findById({
      boardId,
      userId: targetUserId,
    })
    if (existing) throw ERR.CONFLICT('User already a member')

    return boardMemberDal.create({
      boardId,
      targetUserId,
      role,
    })
  },

  async listMembers(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId } = BoardMemberListOfBoardsSchema.parse(input)

    await requireBoardAccess(boardId, userId)
    return boardMemberDal.listMembers({ boardId })
  },

  async update(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, role, targetUserId } = BoardMemberUpdateSchema.parse(input)

    const board = await requireOwner(boardId, userId)

    if (targetUserId === board.ownerId) {
      throw ERR.BAD_REQUEST('Cannot change owner role')
    }

    return boardMemberDal.update({
      boardId,
      targetUserId,
      role,
    })
  },

  async remove(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, targetUserId } = BoardMemberRemoveSchema.parse(input)

    const board = await requireOwner(boardId, userId)

    if (targetUserId === board.ownerId) {
      throw ERR.BAD_REQUEST('Cannot remove board owner')
    }

    return boardMemberDal.remove({
      boardId,
      targetUserId,
    })
  },

  async createInvite(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, token, role } = CreateInviteSchema.parse(input)

    await requireOwner(boardId, userId)

    return boardMemberDal.createInvite({
      boardId,
      token,
      role: role ?? RoleType.VIEWER,
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

    const result = await boardMemberDal.acceptInvite({
      token,
      userId,
    })

    if (result.count !== 1) {
      throw ERR.INTERNAL('Invite acceptance failed')
    }

    return result
  },

  async revokeInvite(input: unknown) {
    const { id: userId } = await requireSession()
    const { boardId, token } = RevokeInviteSchema.parse(input)

    await requireOwner(boardId, userId)
    return boardMemberDal.revokeInvite({ token })
  },
}
