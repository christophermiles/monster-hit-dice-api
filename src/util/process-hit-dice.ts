import type { HitPointResultsResponse, HitPointResultsResponseItem } from '../types'
import { rollHitDice } from 'roll-hit-dice'

export function processHitDice(expressions: string[]): HitPointResultsResponse {
  try {
    return expressions.map((hitDice): HitPointResultsResponseItem => {
      return {
        hitDice,
        hitPoints: rollHitDice(hitDice),
      }
    })
  }
  catch (e: any) {
    throw new Error(e)
  }
}
