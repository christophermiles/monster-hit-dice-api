import { z } from '@hono/zod-openapi'
import { HIT_DICE_REGEX } from './constants'

export const HitDiceQuerySchema = z.object({
  hd: z.preprocess((arg) => {
    if (typeof arg === 'string') {
      return [arg.replace(' ', '+')]
    }

    if (Array.isArray(arg)) {
      return arg.map(s => s.replace(' ', '+'))
    }

    return arg
  }, z.array(z.string().regex(HIT_DICE_REGEX))).openapi({
    param: {
      name: 'hd',
      in: 'query',
    },
    example: ['2d8+8'],
  }),
})

export const HitPointResultsSchema = z.object({
  minimum: z.number(),
  weak: z.number(),
  average: z.number(),
  strong: z.number(),
  maximum: z.number(),
})

export const HitPointsResponseSchema = z.array(z.tuple([
  z.string().regex(HIT_DICE_REGEX),
  HitPointResultsSchema,
]))
