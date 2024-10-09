import type {Context} from "hono";
import type {HitPointResults} from "roll-hit-dice/dist/types";
import {processHitDice} from "../../util/process-hit-dice";
import {RouteHandler} from "@hono/zod-openapi";
import {GetHitPointsAsCsvRoute, GetHitPointsRoute} from "./hp.routes";
import {Variables} from "../../types";

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
    const expressions = c.get('hitDiceExpressions')
    let csvResponse = 'Hit Dice,Minimum,Weak,Average,Strong,Maximum'

    processHitDice(expressions).forEach((result) => {
        csvResponse += `\n${result[0]},${result[1].minimum},${result[1].weak},${result[1].average},${result[1].strong},${result[1].maximum}`
    })

    return c.text(csvResponse, 200, { 'Content-Type': 'text/csv; charset=utf-8' })
}