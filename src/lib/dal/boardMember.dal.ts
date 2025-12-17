import { prisma } from '@/lib/prisma/prisma'
import { RoleType } from '@/prisma/generated/prisma/enums'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const boardMemberDal = {
  async create(data: {
    boardId: string
    targetUserId: string
    role: RoleType
  }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.create',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.create({
        data: {
          boardId: data.boardId,
          userId: data.targetUserId,
          role: data.role,
          acceptedAt: new Date(),
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: create failed')
      throw ERR.INTERNAL('Failed to create board member')
    }
  },

  async findById(data: { boardId: string; userId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.findByBoard',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId: data.boardId,
            userId: data.userId,
          },
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: findById failed')
      throw ERR.INTERNAL('Failed to find the board member')
    }
  },

  async listMembers(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.listMembers',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.findMany({
        where: {
          boardId: data.boardId,
          acceptedAt: { not: null },
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: listMembers failed')
      throw ERR.INTERNAL('Failed to list board members')
    }
  },

  async update(data: {
    boardId: string
    targetUserId: string
    role: RoleType
  }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.update',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.update({
        where: {
          boardId_userId: {
            boardId: data.boardId,
            userId: data.targetUserId,
          },
        },
        data: {
          role: data.role,
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: update failed')
      throw ERR.INTERNAL('Failed to update board member')
    }
  },

  async remove(data: { boardId: string; targetUserId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.remove',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.delete({
        where: {
          boardId_userId: {
            boardId: data.boardId,
            userId: data.targetUserId,
          },
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: remove failed')
      throw ERR.INTERNAL('Failed to remove board member')
    }
  },

  async createInvite(data: { boardId: string; token: string; role: RoleType }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.createInvite',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.boardMember.create({
        data: {
          boardId: data.boardId,
          role: data.role,
          inviteToken: data.token,
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: createInvite failed')
      throw ERR.INTERNAL('Failed to create invite')
    }
  },

  async findInviteByToken(data: { token: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.findInviteByToken',
    })

    try {
      return await prisma.boardMember.findUnique({
        where: {
          inviteToken: data.token,
          acceptedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: findInviteByToken failed')
      throw ERR.INTERNAL('Failed to fetch invite')
    }
  },

  async acceptInvite(data: { token: string; userId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.acceptInvite',
    })

    try {
      return await prisma.boardMember.updateMany({
        where: { inviteToken: data.token, acceptedAt: null },
        data: {
          userId: data.userId,
          inviteToken: null,
          acceptedAt: new Date(),
        },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: acceptInvite failed')
      throw ERR.INTERNAL('Failed to accept invite')
    }
  },

  async revokeInvite(data: { token: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'boardMember.revokeInvite',
    })

    try {
      return await prisma.boardMember.delete({
        where: { inviteToken: data.token },
      })
    } catch (err) {
      log.error(err, 'BoardMember DAL: revokeInvite failed')
      throw ERR.INTERNAL('Failed to revoke invite')
    }
  },
}
