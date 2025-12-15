import { RoleType } from '@/core/db/generated/prisma/enums'
import { prisma } from '@/core/db/src/prisma'
import { logError } from '@/lib/logger/helper'

export const boardMemberDal = {
  addMember: async (boardId: string, userId: string, role: RoleType) => {
    try {
      return await prisma.boardMember.create({
        data: {
          boardId,
          userId,
          role,
          inviteToken: null,
          acceptedAt: new Date(),
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardmember.addmember',
          meta: { boardId, userId, role },
        },
        err,
        'BoardMember dal' + ' addmember crashed',
      )
      return null
    }
  },

  findMemberById: async (boardId: string, userId: string) => {
    try {
      return await prisma.boardMember.findUnique({
        where: {
          boardId_userId: {
            boardId,
            userId,
          },
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardmember.findMemberById',
          meta: { boardId, userId },
        },
        err,
        'BoardMember' + ' dal' + ' findMemberById crashed',
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
        { event: 'db', action: 'boardmember.listMembers', meta: { boardId } },
        err,
        'BoardMember dal' + ' listMembers crashed',
      )
      return null
    }
  },

  updateMemberRole: async (boardId: string, userId: string, role: RoleType) => {
    try {
      return await prisma.boardMember.update({
        where: { boardId_userId: { boardId, userId } },
        data: { role },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.updateMemberRole',
          meta: { boardId, userId },
        },
        err,
        'BoardMember DAL updateMemberRole crashed',
      )
      return null
    }
  },

  removeMember: async (boardId: string, userId: string) => {
    try {
      return await prisma.boardMember.delete({
        where: { boardId_userId: { boardId, userId } },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardMember.removeMember',
          meta: { boardId, userId },
        },
        err,
        'BoardMember DAL removeMember crashed',
      )
      return null
    }
  },

  createInvite: async (boardId: string, token: string, role: RoleType) => {
    try {
      return await prisma.boardMember.create({
        data: {
          boardId,
          inviteToken: token,
          role,
          userId: null,
          acceptedAt: null,
        },
      })
    } catch (err) {
      logError(
        {
          event: 'db',
          action: 'boardmember.createInvite',
          meta: { boardId, token, role },
        },
        err,
        'BoardMember dal createInvite crashed',
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

  listInvites: async (boardId: string) => {
    try {
      return await prisma.boardMember.findMany({
        where: {
          boardId,
          acceptedAt: null,
          inviteToken: { not: null },
        },
        orderBy: { createdAt: 'desc' },
      })
    } catch (err) {
      logError(
        { event: 'db', action: 'boardMember.listInvites', meta: { boardId } },
        err,
        'BoardMember DAL listInvites crashed',
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

  acceptInvite: async (token: string, userId: string) => {
    try {
      return await prisma.boardMember.update({
        where: {
          inviteToken: token,
        },
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
}
