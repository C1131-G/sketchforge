import z from 'zod'

export const Id = {
  board: z.cuid(),
  layer: z.cuid(),
  shape: z.cuid(),
  stroke: z.cuid(),
  snapshot: z.cuid(),
  user: z.cuid(),
}

export const ZIndex = {
  layer: z.number().int().min(0),
  shape: z.number().int().min(0),
}
