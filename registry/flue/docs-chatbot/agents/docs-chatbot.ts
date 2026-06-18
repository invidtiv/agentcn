import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { lookupDocs } from '../tools/lookup-docs.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: `
    You are a documentation assistant for a code library.
    Call lookup_docs to retrieve a function's signature, description, and example,
    then answer using only the returned documentation. If nothing matches, say so
    and suggest the closest function names. Never invent functions or parameters.
  `,
  tools: [lookupDocs],
}))
