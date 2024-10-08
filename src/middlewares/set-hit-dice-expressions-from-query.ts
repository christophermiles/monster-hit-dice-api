import { createMiddleware } from 'hono/factory'

export default createMiddleware(async (c, next) => {
  const hds = c.req.queries('hd')

  if (!hds?.length) {
    throw new TypeError('🎲 No Hit Dice expression was provided')
  }

  c.set('hitDiceExpressions', hds.map((queryString: string) => {
    return queryString.replace(/\s/g, '+') // Handle + character in modifier (assumes browser has replaced with space))
  }))

  await next()
})
