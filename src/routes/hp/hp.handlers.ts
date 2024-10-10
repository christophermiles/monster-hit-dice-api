import type {Context} from "hono";
import {processHitDice} from "../../util/process-hit-dice";
import {RouteHandler} from "@hono/zod-openapi";
import {GetHitPointsAsCsvRoute, GetHitPointsRoute} from "./hp.routes";
import {Variables} from "../../types";
import {hitPointResultsResponseAsCsv} from "../../util/hit-point-results-response-as-csv";

type AppBindings = {
    Variables: Variables
}

export const getHitPointsHandler: RouteHandler<GetHitPointsRoute, AppBindings> = (c: Context) => {
    return c.json(processHitDice(c.get('hitDiceExpressions')))
}

export const getHitPointsAsCsvHandler: RouteHandler<GetHitPointsAsCsvRoute, AppBindings> = (c: Context) => {
    return c.text(
        hitPointResultsResponseAsCsv(processHitDice(c.get('hitDiceExpressions'))),
        200,
        {
            'Content-Type': 'text/plain; charset=utf-8'
        }
    )
}