import {processHitDice} from "./util/process-hit-dice";
import { HitPointResultsResponse} from "./types";

export const HIT_DICE_BY_MONSTER: Record<string, string> = {
    ['Goblin']: '2d6',
    ['Skeleton']: '2d8-2',
    ['Orc']: '2d8+6',
    ['Gelatinous Cube']: '8d10+40',
    ['Tarrasque']: '33d20+330'
}

export const HIT_POINT_RESULTS_MOCKS: HitPointResultsResponse = processHitDice(Object.values(HIT_DICE_BY_MONSTER))
