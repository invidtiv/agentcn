import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { generateImage } from '../tools/generate-image.ts'
import { parsePdf } from '../tools/parse-pdf.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You generate study flash cards from a PDF.
    Call parse_pdf to get the text, then produce concise front/back card pairs
    grounded in the document. Only call generate_image when the user asks for
    images, attaching the returned URL to the relevant card.
  `,
  tools: [parsePdf, generateImage],
}))
