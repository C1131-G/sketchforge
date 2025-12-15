import { prisma } from '@/core/db/src/prisma'
import { RoleType } from '@/core/db/generated/prisma/enums'
import { logError } from '@/lib/logger/helper'

export const boardMemberDal = {
  createMember: async (boardId: string, userId: string, role: RoleType) => {
    try {
      return await prisma.boardMember.create({
        data: {
          boardId,
          userId,
          role,
          acceptedAt: new Date(),
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.createMember',
          meta: { boardId, userId, role },
        },
        err,
        'BoardMember DAL createMember crashed',
      )
      return null
    }
  },

  findByBoardAndUser: async (boardId: string, userId: string) => {
    try {
      return await prisma.boardMember.findUnique({
        where: { boardId_userId: { boardId, userId } },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.findByBoardAndUser',
          meta: { boardId, userId },
        },
        err,
        'BoardMember DAL findByBoardAndUser crashed',
      )
      return null
    }
  },

  listMembers: async (boardId: string) => {
    try {
      return await prisma.boardMember.findMany({
        where: { boardId, acceptedAt: { not: null } },
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'boardMember.listMembers', meta: { boardId } },
        err,
        'BoardMember DAL listMembers crashed',
      )
      return null
    }
  },

  update: async (
    boardId: string,
    userId: string,
    data: { role?: RoleType },
  ) => {
    try {
      return await prisma.boardMember.update({
        where: { boardId_userId: { boardId, userId } },
        data,
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.update',
          meta: { boardId, userId },
        },
        err,
        'BoardMember DAL update crashed',
      )
      return null
    }
  },

  remove: async (boardId: string, userId: string) => {
    try {
      return await prisma.boardMember.delete({
        where: { boardId_userId: { boardId, userId } },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.remove',
          meta: { boardId, userId },
        },
        err,
        'BoardMember DAL remove crashed',
      )
      return null
    }
  },

  createInvite: async (boardId: string, token: string, role: RoleType) => {
    try {
      return await prisma.boardMember.create({
        data: {
          boardId,
          role,
          inviteToken: token,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.createInvite',
          meta: { boardId, role },
        },
        err,
        'BoardMember DAL createInvite crashed',
      )
      return null
    }
  },

  findInviteByToken: async (token: string) => {
    try {
      return await prisma.boardMember.findFirst({
        where: {
          inviteToken: token,
          acceptedAt: null,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.findInviteByToken',
          meta: { token },
        },
        err,
        'BoardMember DAL findInviteByToken crashed',
      )
      return null
    }
  },

  acceptInvite: async (token: string, userId: string) => {
    try {
      return await prisma.boardMember.update({
        where: { inviteToken: token },
        data: {
          userId,
          inviteToken: null,
          acceptedAt: new Date(),
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.acceptInvite',
          meta: { token, userId },
        },
        err,
        'BoardMember DAL acceptInvite crashed',
      )
      return null
    }
  },

  revokeInvite: async (token: string) => {
    try {
      return await prisma.boardMember.delete({
        where: { inviteToken: token },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'boardMember.revokeInvite', meta: { token } },
        err,
        'BoardMember DAL revokeInvite crashed',
      )
      return null
    }
  },
}
