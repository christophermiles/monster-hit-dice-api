import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { logger } from 'hono/logger'
import calculateResults from './util/calculate-hit-points'
import parseHitDice from './util/parse-hit-dice-expression-string'

interface Variables {
  hitDiceExpressions: string[]
}

const app = new Hono<{ Variables: Variables }>()
app.use(logger())

const parseHitDiceMiddleware = createMiddleware(async (c, next) => {
  const hds = c.req.queries('hd')

  if (!hds?.length) {
    throw new TypeError('🎲 No Hit Dice expression was provided')
  }

  c.set('hitDiceExpressions', hds.map((queryString: string) => {
    return queryString.replace(/\s/g, '+') // Handle + character in modifier (assumes browser has replaced with space))
  }))

  await next()
})

// Middleware for error handling
app.use('*', async (c, next) => {
  try {
    await next()
  }
  catch (error: any) {
    return c.json({
      error: error.message,
      status: 400,
    }, 400)
  }
})

function processHitDice(expressions: string[]) {
  return expressions.map((expression) => {
    const parsedHitDice = parseHitDice(expression)
    return {
      hitDice: expression,
      hitPointResults: calculateResults(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier),
    }
  })
}

app.get('/', parseHitDiceMiddleware, (c) => {
  return c.json(processHitDice(c.get('hitDiceExpressions')))
})

app.get('/csv', parseHitDiceMiddleware, (c) => {
  const expressions = c.get('hitDiceExpressions')
  let csvResponse = 'hitDice,minimum,weak,average,strong,maximum'

  processHitDice(expressions).forEach(({ hitDice, hitPointResults }) => {
    csvResponse += `\n${hitDice},${hitPointResults.minimum},${hitPointResults.weak},${hitPointResults.average},${hitPointResults.strong},${hitPointResults.maximum}`
  })

  return c.text(csvResponse, 200, { 'Content-Type': 'text/csv; charset=utf-8' })
})

export default app
