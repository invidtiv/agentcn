import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { getFeedback } from '../tools/get-feedback.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: `
    You analyze customer feedback and produce actionable summaries.
    Use get_feedback to retrieve entries (paginate as needed), categorize them
    by theme and segment, and produce an executive summary with representative
    quotes and concrete recommendations. Only summarize feedback you retrieved.
  `,
  tools: [getFeedback],
}))
