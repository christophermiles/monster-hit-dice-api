import { apiReference } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import errorMiddleware from './middlewares/error'
import {getHitPointsAsCsvRoute, getHitPointsRoute as getHitPointsRoute} from './routes/hp/hp.routes'
import {getHitPointsAsCsvHandler, getHitPointsHandler} from './routes/hp/hp.handlers'
import {OpenAPIHono} from '@hono/zod-openapi'
import { Variables} from "./types";

const app = new OpenAPIHono<{ Variables: Variables }>()
app.use(logger())
app.use('*', errorMiddleware)

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hit Dice App API',
  },
})

app.get('/', apiReference({
  spec: {
    url: '/doc',
  },
}))

app.openapi(getHitPointsRoute, getHitPointsHandler)
app.openapi(getHitPointsAsCsvRoute, getHitPointsAsCsvHandler)

export default app