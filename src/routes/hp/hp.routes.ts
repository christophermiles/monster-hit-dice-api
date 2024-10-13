import { createRoute, z } from '@hono/zod-openapi'
import { INVALID_HIT_DICE_ERROR_MESSAGE } from '../../constants'
import setHitDiceExpressionsFromQueryMiddleware from '../../middlewares/set-hit-dice-expressions-from-query'
import { HIT_POINT_RESULTS_MOCKS } from '../../mocks'
import { ErrorResponseSchema, HitDiceQuerySchema, HitPointsResponseSchema } from '../../schemas'
import { hitPointResultsResponseAsCsv } from '../../util/hit-point-results-response-as-csv'

const tags = ['Hit Points']

const ERROR_400 = {
  content: {
    'application/json': {
      schema: ErrorResponseSchema,
      example: {
        message: INVALID_HIT_DICE_ERROR_MESSAGE,
        status: 400,
      },
    },
  },
  description: 'Bad request',
}

export const getHitPointsRoute = createRoute({
  method: 'get',
  path: '/hp',
  tags,
  request: {
    query: HitDiceQuerySchema,
  },
  middleware: [
    setHitDiceExpressionsFromQueryMiddleware,
  ],
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
    400: ERROR_400,
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
          example: hitPointResultsResponseAsCsv([HIT_POINT_RESULTS_MOCKS[0]]),
        },
      },
      description: 'Retrieve Hit Point results from Hit Dice expressions as comma-separated values',
    },
    400: ERROR_400,
  },
})

export type GetHitPointsRoute = typeof getHitPointsRoute
export type GetHitPointsAsCsvRoute = typeof getHitPointsAsCsvRoute
