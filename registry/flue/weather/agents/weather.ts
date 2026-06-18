import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { getWeather } from '../tools/get-weather.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: `
    You are a helpful weather assistant. Call get_weather with the location, then
    report current conditions plainly. Ask which place is meant if it's ambiguous.
  `,
  tools: [getWeather],
}))
