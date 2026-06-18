import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { fetchPr } from '../tools/fetch-pr.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You review GitHub pull requests. Call fetch_pr for the PR's files and patches,
    adapt depth to PR size, skip generated/lock/vendored files, and give feedback
    grouped by file (correctness, then security, then style/tests). End with a
    summary and an approve / request-changes recommendation. Comment only on the diff.
  `,
  tools: [fetchPr],
}))
