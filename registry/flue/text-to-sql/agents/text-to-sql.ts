import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { introspectSchema } from '../tools/introspect-schema.ts'
import { runQuery } from '../tools/run-query.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You answer questions about a database by writing and running SQL.
    Always call introspect_schema first, then write one correct SELECT query and
    run it with run_query (read-only). Summarize results and show the SQL.
    Never invent tables or columns.
  `,
  tools: [introspectSchema, runQuery],
}))
