import { prisma } from '@/lib/prisma/prisma'
import { Prisma } from '@/prisma/generated/prisma/client'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const strokeDal = {
  async create(data: {
    boardId: string
    layerId: string
    ownerId: string
    pointsBlob: Prisma.Bytes
    penPropsJson: Prisma.InputJsonValue
  }) {
    const log = withLogContext({
      event: 'db',
      action: 'stroke.create',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.stroke.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Stroke DAL: create failed')
      throw ERR.INTERNAL('Failed to create stroke')
    }
  },

  async findById(data: { strokeId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'stroke.findById',
      meta: { strokeId: data.strokeId },
    })

    try {
      return await prisma.stroke.findUnique({
        where: { id: data.strokeId },
      })
    } catch (err) {
      log.error(err, 'Stroke DAL: findById failed')
      throw ERR.INTERNAL('Failed to find stroke')
    }
  },

  async listByBoard(data: { boardId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'stroke.listByBoard',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.stroke.findMany({
        where: {
          boardId: data.boardId,
          deletedAt: null,
        },
        orderBy: { createdAt: 'asc' },
      })
    } catch (err) {
      log.error(err, 'Stroke DAL: listByBoard failed')
      throw ERR.INTERNAL('Failed to load strokes')
    }
  },

  async remove(data: { strokeId: string }) {
    const log = withLogContext({
      event: 'db',
      action: 'stroke.remove',
      meta: { strokeId: data.strokeId },
    })

    try {
      return await prisma.stroke.update({
        where: { id: data.strokeId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Stroke DAL: remove failed')
      throw ERR.INTERNAL('Failed to remove stroke')
    }
  },
}
