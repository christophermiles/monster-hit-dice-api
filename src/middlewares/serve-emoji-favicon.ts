// Inspired by w3cj https://github.com/w3cj/stoker/blob/main/src/middlewares/serve-emoji-favicon.ts

import { createMiddleware } from 'hono/factory'

export default createMiddleware(async (c, next) => {
  if (c.req.path === '/favicon.ico') {
    c.header('Content-Type', 'image/svg+xml')
    return c.body(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" x=".075em" font-size="90">🎲</text></svg>`)
  }
  return next()
})
