import { createAgent, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'
import { fetchCsv } from '../tools/fetch-csv.ts'

const summarizer = createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: 'Load the CSV with fetch_csv and produce a compact summary: columns, types, ranges, and notable patterns.',
  tools: [fetchCsv],
}))

const questioner = createAgent(() => ({
  model: 'anthropic/claude-haiku-4-5',
  instructions: 'Given a dataset summary, generate focused analytical questions grounded in the listed columns.',
}))

const Questions = v.object({
  summary: v.string(),
  questions: v.array(v.string()),
})

export async function run({ init, payload }: FlueContext<{ url: string }>) {
  const summarySession = await (await init(summarizer)).session()
  const summary = await summarySession.prompt(`Summarize the CSV at ${payload.url}`)

  const questionSession = await (await init(questioner)).session()
  const response = await questionSession.prompt(
    `Generate analytical questions for this dataset:\n${summary.text}`,
    { result: Questions }
  )

  return response.data
}
