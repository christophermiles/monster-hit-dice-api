import type { HitPointResultsResponse, HitPointResultsResponseItem } from '../types'
import rollHitDice from 'roll-hit-dice/dist/roll-hit-dice'

export function processHitDice(expressions: string[]): HitPointResultsResponse {
  return expressions.map((hitDice): HitPointResultsResponseItem => {
    return {
      hitDice,
      hitPoints: rollHitDice(hitDice),
    }
  })
}
