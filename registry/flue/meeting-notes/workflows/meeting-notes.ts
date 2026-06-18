import { createAgent, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'

const notetaker = createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: 'Extract structured notes from a meeting transcript. Only include items grounded in the transcript.',
}))

const Notes = v.object({
  summary: v.string(),
  decisions: v.array(v.string()),
  actionItems: v.array(v.object({
    owner: v.string(),
    task: v.string(),
  })),
  openQuestions: v.array(v.string()),
})

export async function run({ init, payload }: FlueContext<{ transcript: string }>) {
  const harness = await init(notetaker)
  const session = await harness.session()

  const response = await session.prompt(
    `Produce structured meeting notes from this transcript:\n\n${payload.transcript}`,
    { result: Notes }
  )

  return response.data
}
