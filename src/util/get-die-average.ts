import type { DieType } from '../types'
import arrayFromNumber from './array-from-number'
import roundToNearestHalf from './round-to-nearest-half'

export default function getDieAverage(dieType: DieType): number {
  const array = arrayFromNumber(dieType)
  return roundToNearestHalf(array.reduce((accumulator, currentValue) => accumulator + currentValue, 0) / array.length)
}
