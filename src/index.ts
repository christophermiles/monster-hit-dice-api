import { Hono } from 'hono'
import { logger } from 'hono/logger'
import errorMiddleware from './middlewares/error'
import setHitDiceExpressionsFromQueryMiddleware from './middlewares/set-hit-dice-expressions-from-query'
import parseHitDice from './util/parse-hit-dice-expression-string'
import rollHitDice from "roll-hit-dice/dist/roll-hit-dice";

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
      hitPointResults: rollHitDice(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier),
    }
  })
}

app.get('/', setHitDiceExpressionsFromQueryMiddleware, (c) => {
  return c.json(processHitDice(c.get('hitDiceExpressions')))
})

app.get('/csv', setHitDiceExpressionsFromQueryMiddleware, (c) => {
  const expressions = c.get('hitDiceExpressions')
  let csvResponse = 'hitDice,minimum,weak,average,strong,maximum'

  processHitDice(expressions).forEach(({ hitDice, hitPointResults }) => {
    csvResponse += `\n${hitDice},${hitPointResults.minimum},${hitPointResults.weak},${hitPointResults.average},${hitPointResults.strong},${hitPointResults.maximum}`
  })

  return c.text(csvResponse, 200, { 'Content-Type': 'text/csv; charset=utf-8' })
})

export default app