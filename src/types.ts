import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { HitPointResults } from 'roll-hit-dice/dist/types'

export interface HitPointResultsResponseItem {
  hitDice: string
  hitPoints: HitPointResults
}

export type HitPointResultsResponse = HitPointResultsResponseItem[]

export type HitPointByMonsterNameResultsResponseItem = HitPointResultsResponseItem & {
  monster: {
    name: string
    source: string
  }
}

export type HitPointByMonsterNameResultsResponse = HitPointByMonsterNameResultsResponseItem[]

export interface Variables {
  hitDiceExpressions: string[]
}

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>
