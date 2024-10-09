import type { HitPointResults } from 'roll-hit-dice/dist/types'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import rollHitDice from 'roll-hit-dice/dist/roll-hit-dice'
import errorMiddleware from './middlewares/error'
import setHitDiceExpressionsFromQueryMiddleware from './middlewares/set-hit-dice-expressions-from-query'
import { HitDiceQuerySchema, HitPointsResponseSchema } from './schemas'
import parseHitDice from './util/parse-hit-dice-expression-string'

interface Variables {
  hitDiceExpressions: string[]
}

type HitPointResultsResponse = [string, HitPointResults][]

const app = new OpenAPIHono<{ Variables: Variables }>()
app.use(logger())
app.use('*', errorMiddleware)

function processHitDice(expressions: string[]): HitPointResultsResponse {
  return expressions.map((expression) => {
    const parsedHitDice = parseHitDice(expression)
    return [expression, rollHitDice(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier)]
  })
}

const indexRoute = createRoute({
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

app.openapi(indexRoute, (c) => {
  const response: [string, HitPointResults][] = []
  processHitDice(c.get('hitDiceExpressions')).forEach((result) => {
    response.push([result[0], result[1]])
  })
  return c.json(response)
})

app.get('/hp/csv', setHitDiceExpressionsFromQueryMiddleware, (c) => {
  const expressions = c.get('hitDiceExpressions')
  let csvResponse = 'hitDice,minimum,weak,average,strong,maximum'

  processHitDice(expressions).forEach((result) => {
    csvResponse += `\n${result[0]},${result[1].minimum},${result[1].weak},${result[1].average},${result[1].strong},${result[1].maximum}`
  })

  return c.text(csvResponse, 200, { 'Content-Type': 'text/csv; charset=utf-8' })
})

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hit Point Range API',
  },
})

app.get('/reference', apiReference({
  spec: {
    url: '/doc',
  },
}))

export default app
