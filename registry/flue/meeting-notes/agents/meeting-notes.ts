import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: `
    You turn a raw meeting transcript into structured notes:
    a short summary, the key decisions, action items as owner/task pairs
    (mark "unassigned" when no owner is named), and open questions.
    Only include items grounded in the transcript.
  `,
}))
