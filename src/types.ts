import type { RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { HitPointResults } from 'roll-hit-dice/dist/types'
import { RouteConfig, RouteHandler, z} from "@hono/zod-openapi";

export type HitPointResultsResponseItem = {
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
