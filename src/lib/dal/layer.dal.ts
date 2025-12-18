import { prisma } from '@/lib/prisma/prisma'
import { withLogContext } from '@/lib/logger/helper'
import { ERR } from '@/lib/errors/error.map'

export const layerDal = {
  create: async (data: { boardId: string; name: string; zIndex: number }) => {
    const log = withLogContext({
      event: 'db',
      action: 'layer.create',
      meta: { boardId: data.boardId },
    })
    try {
      return await prisma.layer.create({
        data: {
          boardId: data.boardId,
          name: data.name,
          zIndex: data.zIndex,
        },
      })
    } catch (err) {
      log.error(err, 'Layer DAL: create failed')
      throw ERR.INTERNAL('Failed to create layer')
    }
  },

  listByBoard: async (data: { boardId: string }) => {
    const log = withLogContext({
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
        orderBy: {
          zIndex: 'asc',
        },
      })
    } catch (err) {
      log.error(err, 'Layer DAL: listByBoard failed')
      throw ERR.INTERNAL('Failed to find the layers of board')
    }
  },

  findById: async (data: { layerId: string }) => {
    const log = withLogContext({
      event: 'db',
      action: 'layer.findById',
      meta: { layerId: data.layerId },
    })
    try {
      return await prisma.layer.findUnique({
        where: {
          id: data.layerId,
          deletedAt: null,
        },
      })
    } catch (err) {
      log.error(err, 'Layer DAL: findById failed')
      throw ERR.INTERNAL('Failed to find the layer')
    }
  },

  update: async (data: {
    layerId: string
    name?: string
    isLocked?: boolean
    isVisible?: boolean
    zIndex?: number
  }) => {
    const log = withLogContext({
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
      log.error(err, 'Layer DAL: update failed')
      throw ERR.INTERNAL('Failed to update the layer')
    }
  },

  remove: async (data: { layerId: string }) => {
    const log = withLogContext({
      event: 'db',
      action: 'layer.remove',
      meta: { layerId: data.layerId },
    })
    try {
      return await prisma.layer.update({
        where: { id: data.layerId },
        data: {
          deletedAt: new Date(),
        },
      })
    } catch (err) {
      log.error(err, 'Layer DAL: remove failed')
      throw ERR.INTERNAL('Failed to remove the layer')
    }
  },
}
