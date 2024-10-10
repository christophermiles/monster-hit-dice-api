import { createRoute, z } from '@hono/zod-openapi'
import setHitDiceExpressionsFromQueryMiddleware from '../../middlewares/set-hit-dice-expressions-from-query'
import { HIT_POINT_RESULTS_MOCKS } from '../../mocks'
import { HitDiceQuerySchema, HitPointsResponseSchema } from '../../schemas'
import { hitPointResultsResponseAsCsv } from '../../util/hit-point-results-response-as-csv'

const tags = ['Hit Points']

export const getHitPointsRoute = createRoute({
  method: 'get',
  path: '/hp',
  tags,
  request: {
    query: HitDiceQuerySchema,
  },
  middleware: setHitDiceExpressionsFromQueryMiddleware,
  responses: {
    200: {
      content: {
        'application/json': {
          schema: HitPointsResponseSchema,
          examples: {
            'Single query (Skeleton)': HIT_POINT_RESULTS_MOCKS[0],
            'Multiple queries (Skeleton, Orc, Gelatinous Cube, Tarrasque': HIT_POINT_RESULTS_MOCKS,
          },
        },
      },
      description: 'Retrieve Hit Point results from Hit Dice expressions',
    },
  },
})

export const getHitPointsAsCsvRoute = createRoute({
  method: 'get',
  path: '/hp/csv',
  tags,
  request: {
    query: HitDiceQuerySchema,
  },
  middleware: setHitDiceExpressionsFromQueryMiddleware,
  responses: {
    200: {
      content: {
        'text/plain': {
          schema: z.string(),
          example: hitPointResultsResponseAsCsv(HIT_POINT_RESULTS_MOCKS),
        },
      },
      description: 'Retrieve Hit Point results from Hit Dice expressions as comma-separated values',
    },
  },
})

export type GetHitPointsRoute = typeof getHitPointsRoute
export type GetHitPointsAsCsvRoute = typeof getHitPointsAsCsvRoute