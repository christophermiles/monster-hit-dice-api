import { createMiddleware } from 'hono/factory'
import { BadRequestError } from '../classes/errors'

export default createMiddleware(async (c, next) => {
  const hds = c.req.queries('hd')

  if (!hds?.length) {
    throw new BadRequestError('🎲 No Hit Dice expression was provided')
  }

  c.set('hitDiceExpressions', hds.map((queryString: string) => {
    return queryString.replace(/\s/g, '+') // Handle + character in modifier (assumes browser has replaced with space))
  }))

  await next()
})
