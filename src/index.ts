import type { Variables } from './types'
import { OpenAPIHono } from '@hono/zod-openapi'
import { apiReference } from '@scalar/hono-api-reference'
import { logger } from 'hono/logger'
import errorMiddleware from './middlewares/error'
import serveEmojiFavicon from './middlewares/serve-emoji-favicon'
import { getHitPointsAsCsvHandler, getHitPointsHandler } from './routes/hp/hp.handlers'
import { getHitPointsAsCsvRoute, getHitPointsRoute } from './routes/hp/hp.routes'

const app = new OpenAPIHono<{ Variables: Variables }>({
  strict: false,
})

app.use(logger())
app.use(serveEmojiFavicon)
app.use('*', errorMiddleware)

app.get('/', c => c.redirect('/reference'))

app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'Hit Dice App API',
    description: 'An API for calculating the following Hit Point values from a [Dungeons &amp; Dragons creature’s Hit Dice expression](https://www.dndbeyond.com/sources/dnd/basic-rules-2014/monsters#HitPoints):\n\n'
      + '- **minimum** (lowest possible Hit Die roll, plus modifier)\n\n'
      + '- **weak** (midway between minimum and average)\n\n'
      + '- **average** (as listed in the stat block)\n\n'
      + '- **strong** (midway between average and maximum)\n\n'
      + '- **maximum** (highest possible Hit Die roll, plus modifier)\n\n'
      + '## Why?\n\n'
      + 'Using a creature’s average Hit Points works just fine for most combats.\n\n'
      + 'But sometimes you might want to give your <abbr title="Big Bad Evil Guy">BBEG</abbr> (Big Bad Evil Guy) maximum Hit Points&nbsp;😈.\n\n'
      + 'Or maybe you’re using multiple creatures of the same in a battle, and want them to have varying degrees of durability.\n\n'
      + 'Or you want to tweak a creature’s Hit Points mid-battle ([Mike Shea at Sly Flourish explains why we might want to do this](https://slyflourish.com/tweaking_monster_hit_points.html)), but don’t feel comfortable choosing a *completely* arbitrary number.\n\n'
      + 'These endpoints allow you to submit a Hit Dice expression&hellip;\n\n'
      + '- `2d8-2` (Skeleton)\n\n'
      + '&hellip;or even multiple Hit Dice expressions at once&hellip;\n\n'
      + '- `2d8-2` (Skeleton)\n\n'
      + '- `2d8+6` (Orc)\n\n'
      + '- `8d10+40` (Gelatinous Cube)\n\n'
      + '- `33d20+330` (Tarrasque)\n\n'
      + '&hellip;and get back an array of Hit Point values.'
      + 'See the documentation of the individual endpoints for more details.',
  },
})

app.get('/reference', apiReference({
  spec: {
    url: '/doc',
  },
  theme: 'mars',
}))

app.openapi(getHitPointsRoute, getHitPointsHandler)
app.openapi(getHitPointsAsCsvRoute, getHitPointsAsCsvHandler)

export default app
