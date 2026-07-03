import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { redactPii } from '../lib/pii'
import { searchDocs } from '../lib/vector-store'

export default createTool({
  id: 'search_knowledge',
  description:
    'Searches the company knowledge corpus and returns the most relevant passages (with PII redacted) and their sources.',
  inputSchema: z.object({
    query: z.string(),
    topK: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ context }) => {
    const { query, topK } = context
    const hits = await searchDocs(query, topK)
    const results = hits.map((row) => ({
      content: redactPii(String(row.content)),
      source: row.source,
    }))
    return { results }
  },
})
