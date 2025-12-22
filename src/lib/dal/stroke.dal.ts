import { prisma } from '@/lib/prisma/prisma'
import { Prisma } from '@/prisma/generated/prisma/client'
import { createLogger } from '@/lib/logger/logger'
import { ERR } from '@/lib/errors/error.map'

export const strokeDal = {
  async create(data: {
    boardId: string
    layerId: string
    ownerId: string
    pointsBlob: Prisma.Bytes
    penPropsJson: Prisma.InputJsonValue
  }) {
    const log = createLogger({
      event: 'db',
      action: 'stroke.create',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.stroke.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Stroke create failed')
      throw ERR.INTERNAL('Failed to create stroke')
    }
  },

  async findActiveById(data: { strokeId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'stroke.findActiveById',
      meta: { strokeId: data.strokeId },
    })

    try {
      return await prisma.stroke.findFirst({
        where: {
          id: data.strokeId,
          deletedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'Stroke find failed')
      throw ERR.INTERNAL('Failed to fetch stroke')
    }
  },

  async listByBoard(data: { boardId: string }) {
    const log = createLogger({
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
      log.error(err, 'Stroke list failed')
      throw ERR.INTERNAL('Failed to load strokes')
    }
  },

  async softDelete(data: { strokeId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'stroke.softDelete',
      meta: { strokeId: data.strokeId },
    })

    try {
      return await prisma.stroke.update({
        where: { id: data.strokeId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Stroke delete failed')
      throw ERR.INTERNAL('Failed to delete stroke')
    }
  },
}
