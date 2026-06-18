import { createAgent, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'
import { indexPdf } from '../tools/index-pdf.ts'
import { searchDocs } from '../tools/search-docs.ts'

const agent = createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: 'Index the PDF if needed, then answer the question using only retrieved chunks. Cite page numbers.',
  tools: [indexPdf, searchDocs],
}))

const Answer = v.object({
  answer: v.string(),
  citations: v.array(v.object({
    page: v.number(),
    quote: v.string(),
  })),
})

export async function run({ init, payload }: FlueContext<{ url: string; question: string }>) {
  const harness = await init(agent)
  const session = await harness.session()

  const response = await session.prompt(
    `Index ${payload.url} if needed, then answer: ${payload.question}`,
    { result: Answer }
  )

  return response.data
}
