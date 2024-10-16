import type { Context } from 'hono'
import type { Variables } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { HTTPException } from 'hono/http-exception'
import { logger } from 'hono/logger'
import serveEmojiFavicon from './middlewares/serve-emoji-favicon'
import { getHitPointsAsCsvHandler, getHitPointsHandler } from './routes/hp/hp.handlers'
import { getHitPointsAsCsvRoute, getHitPointsRoute } from './routes/hp/hp.routes'
import formatZodErrors from './util/format-zod-errors'

const app = new OpenAPIHono<{ Variables: Variables }>({
  strict: false,
  defaultHook: (result, c) => {
    if (!result.success) {
      return c.json(
        {
          message: formatZodErrors(result.error).message,
          status: 400,
        },
        400,
      )
    }
  },
})

app.use(logger())
app.use(serveEmojiFavicon)

app.onError((error: Error | HTTPException, c: Context) => {
  if (error instanceof HTTPException) {
    const { message, status } = error

    return c.json({
      message,
      status,
    }, error.status)
  }

  return c.json({
    message: error.message || 'Internal Server Error',
    status: 500,
  }, 500)
})

app.get('/', (c) => {
  return c.redirect('/docs')
})

app.doc('/schema', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hit Dice App API',
    description: ['A microservice for calculating the following Hit Point values from a [Dungeons &amp; Dragons creature’s Hit Dice expression](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/monsters#HitPoints):', '- **minimum** (lowest possible Hit Die roll, plus modifier)', '- **weak** (midway between minimum and average)', '- **average** (as listed in the stat block)', '- **strong** (midway between average and maximum)', '- **maximum** (highest possible Hit Die roll, plus modifier)', '## Why?', 'Using a creature’s average Hit Points works just fine for most combats.', 'But sometimes you might want to give your <abbr title="Big Bad Evil Guy">BBEG</abbr> (Big Bad Evil Guy) maximum Hit Points&nbsp;😈.', 'Or maybe you’re using multiple creatures of the same in a battle, and want them to have varying degrees of durability.', 'Or you want to tweak a creature’s Hit Points mid-battle ([Mike Shea at Sly Flourish explains why we might want to do this](https://slyflourish.com/tweaking_monster_hit_points.html)), but don’t feel comfortable choosing a *completely* arbitrary number.', 'These endpoints allow you to submit a Hit Dice expression&hellip;', '- `2d8+6` (Orc)', '&hellip;or even multiple Hit Dice expressions at once&hellip;', '- `2d6` (Goblin)', '- `2d8-2` (Skeleton)', '- `2d8+6` (Orc)', '- `8d10+40` (Gelatinous Cube)', '- `33d20+330` (Tarrasque)', '&hellip;and get back an array of Hit Point values.', 'See the documentation for the individual endpoints for more details.'].join('\n\n'),
    contact: {
      name: 'Christopher Miles',
      url: 'https://github.com/christophermiles/monster-hit-dice-api',
      email: 'mail@christophermiles.com.au',
    },
    license: {
      name: 'MIT',
      url: 'https://github.com/christophermiles/monster-hit-dice-api/blob/main/LICENSE',
    },
  },
})

app.get('/docs', apiReference({
  spec: {
    url: '/schema',
  },
  theme: 'mars',
}))

app.openapi(getHitPointsRoute, getHitPointsHandler)
app.openapi(getHitPointsAsCsvRoute, getHitPointsAsCsvHandler)

export default app
