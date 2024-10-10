import type { HitPointResults } from 'roll-hit-dice/dist/types'

export interface HitPointResultsResponseItem {
  hitDice: string
  hitPoints: HitPointResults
}

export type HitPointResultsResponse = HitPointResultsResponseItem[]

export interface Variables {
  hitDiceExpressions: string[]
}
