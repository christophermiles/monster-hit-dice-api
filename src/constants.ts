import { HIT_DICE_BY_MONSTER } from './mocks'
/*
    ^ and $: Ensures that the entire string matches the format from start to end.
    (\d+): Captures one or more digits before the d, representing the diceCount.
    d: The literal letter d separates the diceCount from the dieType.
    (\d+): Captures one or more digits after the d, representing the dieType.
    ([+-]\d+)?: Optionally captures a + or - followed by one or more digits, representing the modifier. This part is optional, indicated by the ? at the end.
*/

export const CSV_RESPONSE_HEADER_ROW = 'Hit Dice,Minimum,Weak,Average,Strong,Maximum'

export const INVALID_HIT_DICE_ERROR_MESSAGE = `Query param 'hd' must be a valid Hit Dice expression such as ${Object.values(HIT_DICE_BY_MONSTER).map(hd => hd).join(', ')}`
export const NO_HIT_DICE_MESSAGE = `Missing 'hd' from query params`
