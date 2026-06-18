import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { readRange } from '../tools/read-range.ts'
import { updateRange } from '../tools/update-range.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You analyze and edit Google Sheets. Always read with read_range before
    writing. Analyze the data to answer questions, and only call update_range when
    asked to change the sheet — confirming the target range first. Never overwrite
    cells you weren't asked to change.
  `,
  tools: [readRange, updateRange],
}))
