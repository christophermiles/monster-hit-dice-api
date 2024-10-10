import type {HitPointResultsResponse, HitPointResultsResponseItem} from '../types'
import rollHitDice from 'roll-hit-dice/dist/roll-hit-dice'
import parseHitDice from './parse-hit-dice-expression-string'

export function processHitDice(expressions: string[]): HitPointResultsResponse {
  return expressions.map((expression): HitPointResultsResponseItem => {
    const parsedHitDice = parseHitDice(expression)
    return {
      hitDice: expression,
      hitPoints: rollHitDice(parsedHitDice.diceCount, parsedHitDice.dieType, parsedHitDice.modifier)
    }
  })
}