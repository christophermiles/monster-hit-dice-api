import type { HitPointResultsResponse } from '../types'
import { CSV_RESPONSE_HEADER_ROW } from '../constants'

export function hitPointResultsResponseAsCsv(hitPointResultsResponse: HitPointResultsResponse) {
  let template = `${CSV_RESPONSE_HEADER_ROW}`
  hitPointResultsResponse.forEach((result) => {
    template += `\n${result.hitDice},${result.hitPoints.minimum},${result.hitPoints.weak},${result.hitPoints.average},${result.hitPoints.strong},${result.hitPoints.maximum}`
  })
  return template
}
