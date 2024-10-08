import { Hono } from 'hono'
import { logger } from 'hono/logger'
import errorMiddleware from './middlewares/error'
import parseHitDiceMiddleware from './middlewares/parse-hit-dice'
import calculateResults from './util/calculate-hit-points'
import parseHitDice from './util/parse-hit-dice-expression-string'

interface Variables {
  hitDiceExpressions: string[]
}

const app = new Hono<{ Variables: Variables }>()
app.use(logger())
app.use('*', errorMiddleware)

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
