import type { DiceCount, DieType, Modifier } from 'roll-hit-dice/dist/types'
import { HIT_DICE_REGEX } from '../constants'

export default function parseHitDice(expression: string): {
  diceCount: DiceCount
  dieType: DieType
  modifier: Modifier
} {
  const match = expression.match(HIT_DICE_REGEX)

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
