import { prisma } from '@/lib/prisma/prisma'
import { createLogger } from '@/lib/logger/logger'
import { ERR } from '@/lib/errors/error.map'

export const layerDal = {
  async create(data: { boardId: string; name: string; zIndex: number }) {
    const log = createLogger({
      event: 'db',
      action: 'layer.create',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.layer.create({
        data,
      })
    } catch (err) {
      log.error(err, 'Layer create failed')
      throw ERR.INTERNAL('Failed to create layer')
    }
  },

  async listByBoard(data: { boardId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'layer.listByBoard',
      meta: { boardId: data.boardId },
    })

    try {
      return await prisma.layer.findMany({
        where: {
          boardId: data.boardId,
          deletedAt: null,
        },
        orderBy: { zIndex: 'asc' },
      })
    } catch (err) {
      log.error(err, 'Layer list failed')
      throw ERR.INTERNAL('Failed to list layers')
    }
  },

  async findActiveById(data: { layerId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'layer.findActiveById',
      meta: { layerId: data.layerId },
    })

    try {
      return await prisma.layer.findFirst({
        where: {
          id: data.layerId,
          deletedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'Layer fetch failed')
      throw ERR.INTERNAL('Failed to fetch layer')
    }
  },

  async update(data: {
    layerId: string
    name?: string
    isLocked?: boolean
    isVisible?: boolean
    zIndex?: number
  }) {
    const log = createLogger({
      event: 'db',
      action: 'layer.update',
      meta: { layerId: data.layerId },
    })

    try {
      return await prisma.layer.update({
        where: { id: data.layerId },
        data,
      })
    } catch (err) {
      log.error(err, 'Layer update failed')
      throw ERR.INTERNAL('Failed to update layer')
    }
  },

  async softDelete(data: { layerId: string }) {
    const log = createLogger({
      event: 'db',
      action: 'layer.softDelete',
      meta: { layerId: data.layerId },
    })

    try {
      return await prisma.layer.update({
        where: { id: data.layerId },
        data: { deletedAt: new Date() },
      })
    } catch (err) {
      log.error(err, 'Layer delete failed')
      throw ERR.INTERNAL('Failed to delete layer')
    }
  },
}
