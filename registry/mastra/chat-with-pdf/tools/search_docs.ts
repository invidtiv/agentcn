import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { search } from '../lib/vector-store'

export default createTool({
  id: 'search_docs',
  description:
    'Retrieves the most relevant PDF chunks for a question, including the page number of each chunk for citation.',
  inputSchema: z.object({
    query: z.string(),
    topK: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ context }) => {
    const { query, topK } = context
    const hits = await search(query, topK)
    return { hits }
  },
})
