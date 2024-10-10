import type { RouteHandler } from '@hono/zod-openapi'
import type { Context } from 'hono'
import type { HitPointResults } from 'roll-hit-dice/dist/types'
import type { Variables } from '../../types'
import type { GetHitPointsAsCsvRoute, GetHitPointsRoute } from './hp.routes'
import { hitPointResultsResponseAsCsv } from '../../util/hit-point-results-response-as-csv'
import { processHitDice } from '../../util/process-hit-dice'

interface AppBindings {
  Variables: Variables
}

export const getHitPointsHandler: RouteHandler<GetHitPointsRoute, AppBindings> = (c: Context) => {
  const response: [string, HitPointResults][] = []
  processHitDice(c.get('hitDiceExpressions')).forEach((result) => {
    response.push([result[0], result[1]])
  })
  return c.json(response)
}

export const getHitPointsAsCsvHandler: RouteHandler<GetHitPointsAsCsvRoute, AppBindings> = (c: Context) => {
  return c.text(
    hitPointResultsResponseAsCsv(processHitDice(c.get('hitDiceExpressions'))),
    200,
    {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  )
}