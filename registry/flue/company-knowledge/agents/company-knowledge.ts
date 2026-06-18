import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { indexDocument } from '../tools/index-document.ts'
import { searchKnowledge } from '../tools/search-knowledge.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You are a company knowledge assistant. Always call search_knowledge first —
    the corpus is the source of truth — and answer from retrieved passages, citing
    sources. Use index_document to add documents the user shares. If the corpus
    doesn't cover the question, say so. Never reveal redacted PII.
  `,
  tools: [searchKnowledge, indexDocument],
}))
