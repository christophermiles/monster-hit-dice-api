import { z } from '@hono/zod-openapi'
import { HIT_DICE_REGEX } from './constants'
import { HIT_POINT_RESULTS_MOCKS} from "./mocks";

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
      description: 'One or more Hit Dice expressions, eg: `?hd=2d6` or `?hd=2d6&hd=2d8-2&hd=2d8+6&hd=8d10+40&hd=33d20+330`.'
    },
    example: HIT_POINT_RESULTS_MOCKS,
  }),
})

export const HitPointsResponseItemSchema = z.object({
  hitDice: z.string().regex(HIT_DICE_REGEX),
  hitPoints: z.object({
    minimum: z.number(),
    weak: z.number(),
    average: z.number(),
    strong: z.number(),
    maximum: z.number(),
  })
})

export const HitPointsResponseSchema = z.array(HitPointsResponseItemSchema)