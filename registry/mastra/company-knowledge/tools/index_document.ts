import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { indexDoc } from '../lib/vector-store'

export default createTool({
  id: 'index_document',
  description:
    'Adds a document to the knowledge corpus by chunking and embedding it.',
  inputSchema: z.object({
    source: z.string(),
    content: z.string(),
  }),
  execute: async ({ context }) => {
    const { source, content } = context
    const chunks = await indexDoc({ source, content })
    return { chunks, source }
  },
})
