import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { fetchCsv } from '../tools/fetch-csv.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: `
    You turn a CSV dataset into insightful analytical questions.
    Use fetch_csv to load the data, summarize it to compress large files,
    then generate focused, answerable questions grounded in real columns.
  `,
  tools: [fetchCsv],
}))
