import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import {
  browserClick,
  browserGoto,
  browserSnapshot,
  browserType,
} from '../tools/browser.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You are a browser-using agent. Open pages with browser_goto, see them with
    browser_snapshot, and act with browser_click / browser_type using selectors
    from the latest snapshot. Always re-snapshot after navigation or a change,
    and never guess selectors. Report the result when the task is done.
  `,
  tools: [browserGoto, browserSnapshot, browserClick, browserType],
}))
