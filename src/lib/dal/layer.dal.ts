// import { prisma } from '@/lib/prisma/prisma'
// import { logError } from '@/lib/logger/helper'
//
// export const layerDal = {
//   create: async (boardId: string, name: string, zIndex: number) => {
//     try {
//       return await prisma.layer.create({
//         data: {
//           boardId,
//           name,
//           zIndex,
//         },
//       })
//     } catch (err) {
//       logError(
//         {
//           event: 'db',
//           action: 'layer.create',
//           meta: { boardId, name, zIndex },
//         },
//         err,
//         'Layer DAL create crashed',
//       )
//       return null
//     }
//   },
//
//   listByBoard: async (boardId: string) => {
//     try {
//       return await prisma.layer.findMany({
//         where: {
//           boardId,
//           deletedAt: null,
//         },
//         orderBy: {
//           zIndex: 'asc',
//         },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'layer.listByBoard', meta: { boardId } },
//         err,
//         'Layer DAL listByBoard crashed',
//       )
//       return null
//     }
//   },
//
//   findById: async (layerId: string) => {
//     try {
//       return await prisma.layer.findFirst({
//         where: {
//           id: layerId,
//           deletedAt: null,
//         },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'layer.findById', meta: { layerId } },
//         err,
//         'Layer DAL findById crashed',
//       )
//       return null
//     }
//   },
//
//   update: async (
//     layerId: string,
//     data: {
//       name?: string
//       isLocked?: boolean
//       isVisible?: boolean
//       zIndex?: number
//     },
//   ) => {
//     try {
//       return await prisma.layer.update({
//         where: { id: layerId },
//         data,
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'layer.update', meta: { layerId } },
//         err,
//         'Layer DAL update crashed',
//       )
//       return null
//     }
//   },
//
//   remove: async (layerId: string) => {
//     try {
//       return await prisma.layer.update({
//         where: { id: layerId },
//         data: {
//           deletedAt: new Date(),
//         },
//       })
//     } catch (err) {
//       logError(
//         { event: 'db', action: 'layer.remove', meta: { layerId } },
//         err,
//         'Layer DAL remove crashed',
//       )
//       return null
//     }
//   },
// }
