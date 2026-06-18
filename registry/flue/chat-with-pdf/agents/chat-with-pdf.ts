import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { indexPdf } from '../tools/index-pdf.ts'
import { searchDocs } from '../tools/search-docs.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You answer questions about PDF documents using retrieval.
    Call index_pdf for any PDF URL that has not been indexed yet.
    Answer questions by calling search_docs and using only the retrieved chunks,
    citing the page number for every claim. Never answer from memory.
  `,
  tools: [indexPdf, searchDocs],
}))
