import type { Context } from 'hono'
import type { HitPointResults } from 'roll-hit-dice/dist/types'
import { createRoute, OpenAPIHono, z } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import errorMiddleware from './middlewares/error'
import setHitDiceExpressionsFromQueryMiddleware from './middlewares/set-hit-dice-expressions-from-query'
import { getHitPointsRoute } from './routes/get-hit-points'
import { HitDiceQuerySchema } from './schemas'
import { processHitDice } from './util/process-hit-dice'

interface Variables {
  hitDiceExpressions: string[]
}

const app = new OpenAPIHono<{ Variables: Variables }>()
app.use(logger())
app.use('*', errorMiddleware)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Roll Hit Dice API',
  },
})

app.get('/', apiReference({
  spec: {
    url: '/doc',
  },
}))

app.openapi(getHitPointsRoute, (c: Context) => {
  const response: [string, HitPointResults][] = []
  processHitDice(c.get('hitDiceExpressions')).forEach((result) => {
    response.push([result[0], result[1]])
  })
  return c.json(response)
})

app.openapi(createRoute({
  method: 'get',
  path: '/hp/csv',
  request: {
    query: HitDiceQuerySchema,
  },
  middleware: setHitDiceExpressionsFromQueryMiddleware,
  responses: {
    200: {
      content: {
        'text/csv': {
          schema: z.string(),
        },
      },
      description: 'Retrieve Hit Point results from Hit Dice expressions as comma-separated values',
    },
  },
}), (c) => {
  const expressions = c.get('hitDiceExpressions')
  let csvResponse = 'Hit Dice,Minimum,Weak,Average,Strong,Maximum'

  processHitDice(expressions).forEach((result) => {
    csvResponse += `\n${result[0]},${result[1].minimum},${result[1].weak},${result[1].average},${result[1].strong},${result[1].maximum}`
  })

  return c.text(csvResponse, 200, { 'Content-Type': 'text/csv; charset=utf-8' })
})

export default app
