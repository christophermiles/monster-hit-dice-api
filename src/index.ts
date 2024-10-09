import type { HitPointResults } from 'roll-hit-dice/dist/types'
import { createRoute, OpenAPIHono } from '@hono/zod-openapi'
import { logger } from 'hono/logger'
import rollHitDice from 'roll-hit-dice/dist/roll-hit-dice'
import errorMiddleware from './middlewares/error'
import setHitDiceExpressionsFromQueryMiddleware from './middlewares/set-hit-dice-expressions-from-query'
import { HitDiceQuerySchema, HitPointsResponseSchema } from './schemas'
import parseHitDice from './util/parse-hit-dice-expression-string'

interface Variables {
  hitDiceExpressions: string[]
}

const app = new OpenAPIHono<{ Variables: Variables }>()
app.use(logger())
app.use('*', errorMiddleware)

function processHitDice(expressions: string[]): HitPointResultsResponse[] {
  return expressions.map((expression) => {
    const parsedHitDice = parseHitDice(expression)
    return {
      hitDice: expression,
      hitPointResults: rollHitDice(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier),
    }
  })
}

interface HitPointResultsResponse {
  hitDice: string
  hitPointResults: HitPointResults
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
  return c.json(processHitDice(c.get('hitDiceExpressions')))
})

app.get('/hp/csv', setHitDiceExpressionsFromQueryMiddleware, (c) => {
  const expressions = c.get('hitDiceExpressions')
  let csvResponse = 'hitDice,minimum,weak,average,strong,maximum'

  processHitDice(expressions).forEach(({ hitDice, hitPointResults }) => {
    csvResponse += `\n${hitDice},${hitPointResults.minimum},${hitPointResults.weak},${hitPointResults.average},${hitPointResults.strong},${hitPointResults.maximum}`
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

export default app
