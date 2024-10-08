import type { DiceCount, DieType, Modifier } from '../types'

export default function parseHitDice(expression: string): {
  diceCount: DiceCount
  dieType: DieType
  modifier: Modifier
} {
  const hitDiceRegex = /^(\d+)d(\d+)([+-]\d+)?$/

  /*
              ^ and $: Ensures that the entire string matches the format from start to end.
              (\d+): Captures one or more digits before the d, representing the diceCount.
              d: The literal letter d separates the diceCount from the dieType.
              (\d+): Captures one or more digits after the d, representing the dieType.
              ([+-]\d+)?: Optionally captures a + or - followed by one or more digits, representing the modifier. This part is optional, indicated by the ? at the end.
           */

  const match = expression.match(hitDiceRegex)

  if (match) {
    const diceCount: DiceCount = Number.parseInt(match[1], 10)
    const dieType: DieType = Number.parseInt(match[2], 10)
    const modifier: Modifier = match[3] ? Number.parseInt(match[3], 10) : 0

    return {
      diceCount,
      dieType,
      modifier,
    }
  }
  else {
    throw new Error(`🎲 ${expression} is not a valid Hit Dice expression`)
  }
}
