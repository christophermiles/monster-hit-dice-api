import { createMiddleware } from 'hono/factory'

export default createMiddleware(async (c, next) => {
  try {
    await next()
  }
  catch (error: any) {
    return c.json({
      error: error.message,
      status: 400,
    }, 400)
  }
})
