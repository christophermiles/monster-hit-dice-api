import type {Context} from "hono";
import type {HitPointResults} from "roll-hit-dice/dist/types";
import {processHitDice} from "../../util/process-hit-dice";
import {RouteHandler} from "@hono/zod-openapi";
import {GetHitPointsAsCsvRoute, GetHitPointsRoute} from "./hp.routes";
import {Variables} from "../../types";
import {CSV_RESPONSE_HEADER_ROW} from "../../constants";
import {hitPointResultsResponseAsCsv} from "../../util/hit-point-results-response-as-csv";

type AppBindings = {
    Variables: Variables
}

export const getHitPointsHandler: RouteHandler<GetHitPointsRoute, AppBindings> = (c: Context) => {
    const response: [string, HitPointResults][] = []
    processHitDice(c.get('hitDiceExpressions')).forEach((result) => {
        response.push([result[0], result[1]])
    })
    return c.json(response)
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