import { createMiddleware } from 'hono/factory'
import { BadRequestError } from '../classes/errors'
import { NO_HIT_DICE_MESSAGE } from '../constants'

export default createMiddleware(async (c, next) => {
  const hds = c.req.queries('hd')

  if (!hds?.length) {
    throw new BadRequestError(NO_HIT_DICE_MESSAGE)
  }

  c.set('hitDiceExpressions', hds.map((queryString: string) => {
    return queryString.replace(/\s/g, '+') // Handle + character in modifier (assumes browser has replaced with space))
  }))

  await next()
})
