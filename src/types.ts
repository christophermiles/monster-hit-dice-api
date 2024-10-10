import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { HitPointResults } from 'roll-hit-dice/dist/types'

export type HitPointResultsResponse = [string, HitPointResults][]

export interface Variables {
  hitDiceExpressions: string[]
}

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>
