import type { HitPointResultsResponse } from '../types'
import { CSV_RESPONSE_HEADER_ROW } from '../constants'

export function hitPointResultsResponseAsCsv(hitPointResultsResponse: HitPointResultsResponse) {
  let template = `${CSV_RESPONSE_HEADER_ROW}`
  hitPointResultsResponse.forEach((result) => {
    template += `\n${result[0]},${result[1].minimum},${result[1].weak},${result[1].average},${result[1].strong},${result[1].maximum}`
  })
  return template
}
