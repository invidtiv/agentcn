import { createAgent, type FlueContext } from '@flue/runtime'
import * as v from 'valibot'
import { generateImage } from '../tools/generate-image.ts'
import { parsePdf } from '../tools/parse-pdf.ts'

const agent = createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: 'Parse the PDF and produce concise flash cards grounded in the document. Add an image per card only when requested.',
  tools: [parsePdf, generateImage],
}))

const Flashcards = v.object({
  cards: v.array(v.object({
    front: v.string(),
    back: v.string(),
    imageUrl: v.optional(v.string()),
  })),
})

export async function run({ init, payload }: FlueContext<{ url: string; withImages?: boolean }>) {
  const harness = await init(agent)
  const session = await harness.session()

  const response = await session.prompt(
    `Create flash cards from ${payload.url}${payload.withImages ? ' with an image per card' : ''}.`,
    { result: Flashcards }
  )

  return response.data
}
