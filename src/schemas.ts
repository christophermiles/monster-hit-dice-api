import { z } from '@hono/zod-openapi'
import { HIT_DICE_REGEX } from 'roll-hit-dice'
import { INVALID_HIT_DICE_ERROR_MESSAGE } from './constants'
import { HIT_DICE_BY_MONSTER } from './mocks'

export const HitDiceQuerySchema = z.object({
  hd: z.preprocess((arg) => {
    if (typeof arg === 'string') {
      return [arg.replace(' ', '+')]
    }

    if (Array.isArray(arg)) {
      return arg.map(s => s.replace(' ', '+'))
    }

    return arg
  }, z.array(z.string().regex(HIT_DICE_REGEX, INVALID_HIT_DICE_ERROR_MESSAGE))).openapi({
    param: {
      name: 'hd',
      in: 'query',
      description: 'One or more Hit Dice expressions, eg: `?hd=2d8-2` or `?hd=2d8-2&hd=2d8+6&hd=8d10+40&hd=33d20+330` \n\nNote: the application will decode `+` symbols that have been URL-encoded as `%2B`.',
    },
    example: Object.values(HIT_DICE_BY_MONSTER)[0],
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
  }),
})

export const HitPointsResponseSchema = z.array(HitPointsResponseItemSchema)

export const ErrorResponseSchema = z.object({
  message: z.string(),
  status: z.number().int(),
})
