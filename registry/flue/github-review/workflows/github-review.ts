import { createAgent, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'
import { fetchPr } from '../tools/fetch-pr.ts'

const reviewer = createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: 'Fetch the PR and review it. Comment only on the diff, grouped by file.',
  tools: [fetchPr],
}))

const Review = v.object({
  summary: v.string(),
  recommendation: v.picklist(['approve', 'request_changes', 'comment']),
  comments: v.array(v.object({
    file: v.string(),
    severity: v.picklist(['bug', 'security', 'style', 'nit']),
    comment: v.string(),
  })),
})

export async function run({
  init,
  payload,
}: FlueContext<{ owner: string; repo: string; pullNumber: number }>) {
  const harness = await init(reviewer)
  const session = await harness.session()

  const response = await session.prompt(
    `Review pull request ${payload.owner}/${payload.repo}#${payload.pullNumber}.`,
    { result: Review }
  )

  return response.data
}
