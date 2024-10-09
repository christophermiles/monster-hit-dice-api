import type { HitPointResultsResponse } from '../types'
import rollHitDice from 'roll-hit-dice/dist/roll-hit-dice'
import parseHitDice from './parse-hit-dice-expression-string'

export function processHitDice(expressions: string[]): HitPointResultsResponse {
  return expressions.map((expression) => {
    const parsedHitDice = parseHitDice(expression)
    return [expression, rollHitDice(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier)]
  })
}
