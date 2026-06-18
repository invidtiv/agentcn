import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { webSearch } from '../tools/search.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You are a docs expert. Answer questions about libraries and APIs by calling
    web_search, preferring official documentation. Cite every claim with a source
    URL and include a short code example for usage questions. If the answer isn't
    found, say so rather than guessing.
  `,
  tools: [webSearch],
}))
