import {createRoute, z} from '@hono/zod-openapi'
import {HitDiceQuerySchema, HitPointsResponseSchema} from "../../schemas";
import setHitDiceExpressionsFromQueryMiddleware from "../../middlewares/set-hit-dice-expressions-from-query";

export const getHitPointsRoute = createRoute({
    method: 'get',
    path: '/hp',
    request: {
        query: HitDiceQuerySchema,
    },
    middleware: setHitDiceExpressionsFromQueryMiddleware,
    responses: {
        200: {
            content: {
                'application/json': {
                    schema: HitPointsResponseSchema,
                },
            },
            description: 'Retrieve Hit Point results from Hit Dice expressions',
        },
    },
})

export const getHitPointsAsCsvRoute = createRoute({
    method: 'get',
    path: '/hp/csv',
    request: {
        query: HitDiceQuerySchema,
    },
    middleware: setHitDiceExpressionsFromQueryMiddleware,
    responses: {
        200: {
            content: {
                'text/csv': {
                    schema: z.string(),
                },
            },
            description: 'Retrieve Hit Point results from Hit Dice expressions as comma-separated values',
        },
    },
})

export type GetHitPointsRoute = typeof getHitPointsRoute
export type GetHitPointsAsCsvRoute = typeof getHitPointsAsCsvRoute