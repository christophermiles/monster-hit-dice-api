import type { HitPointResults } from 'roll-hit-dice/dist/types'
import type { OpenAPIHono, RouteConfig, RouteHandler } from "@hono/zod-openapi";

export type HitPointResultsResponse = [string, HitPointResults][]

export interface Variables {
    hitDiceExpressions: string[]
}

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R>;