import { createRoute } from '@hono/zod-openapi'
import setHitDiceExpressionsFromQueryMiddleware from '../middlewares/set-hit-dice-expressions-from-query'
import { HitDiceQuerySchema, HitPointsResponseSchema } from '../schemas'

export const getHitPointsRoute = createRoute({
  method: 'get',
  path: '/hp',
  request: {
    query: HitDiceQuerySchema,
  },
  middleware: setHitDiceExpressionsFromQueryMiddleware,
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HitPointsResponseSchema,
        },
      },
      description: 'Retrieve Hit Point results from Hit Dice expressions',
    },
  },
})
