import { createAgent, defineAgentProfile } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import research from '../skills/research/SKILL.md' with { type: 'skill' }
import { webSearch } from '../tools/search.ts'

const searcher = defineAgentProfile({
  name: 'searcher',
  description: 'Runs web searches for a single sub-question and returns sourced findings.',
  instructions: 'Search the web for the given sub-question and return concise findings with source URLs. Report only what the sources support.',
})

const evaluator = defineAgentProfile({
  name: 'evaluator',
  description: 'Critiques the current findings and decides whether more research is needed.',
  instructions: 'Given the question and findings so far, list remaining gaps, weak evidence, and contradictions. Decide if another search round is required.',
})

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You are a deep research orchestrator.
    Break the question into sub-questions and dispatch the searcher subagent for each.
    Send the findings to the evaluator subagent and search again until it reports no gaps.
    Produce a final cited answer grounded only in the sources.
  `,
  skills: [research],
  tools: [webSearch],
  subagents: [searcher, evaluator],
}))
