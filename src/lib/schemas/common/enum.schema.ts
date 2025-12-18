import { z } from 'zod'
import {
  RoleType,
  ShapeType,
  SnapshotKind,
  BoardVisibility,
} from '@/prisma/generated/prisma/enums'

export const RoleSchema = z.enum(RoleType)
export const ShapeSchema = z.enum(ShapeType)
export const SnapshotKindSchema = z.enum(SnapshotKind)
export const BoardVisibilitySchema = z.enum(BoardVisibility)
