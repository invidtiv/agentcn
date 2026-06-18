import { createAgent, defineAgentProfile, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'
import research from '../skills/research/SKILL.md' with { type: 'skill' }
import { webSearch } from '../tools/search.ts'

const searcher = defineAgentProfile({
  name: 'searcher',
  description: 'Runs web searches for a single sub-question.',
  instructions: 'Search the web for the sub-question and return findings with source URLs.',
})

const evaluator = defineAgentProfile({
  name: 'evaluator',
  description: 'Decides whether the findings answer the question.',
  instructions: 'List remaining gaps and decide if another round is needed.',
})

const orchestrator = createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  skills: [research],
  tools: [webSearch],
  subagents: [searcher, evaluator],
}))

const Answer = v.object({
  answer: v.string(),
  citations: v.array(v.object({
    claim: v.string(),
    url: v.string(),
  })),
  unverified: v.array(v.string()),
})

export async function run({ init, payload }: FlueContext<{ question: string; maxRounds?: number }>) {
  const harness = await init(orchestrator)
  const session = await harness.session()

  const response = await session.prompt(
    `Research this question and iterate until it is fully answered (max ${payload.maxRounds ?? 3} rounds): ${payload.question}`,
    { result: Answer }
  )

  return response.data
}
