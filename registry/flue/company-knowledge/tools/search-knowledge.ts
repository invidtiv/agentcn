import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { redactPii } from '../lib/pii.ts'
import { searchDocs } from '../lib/vector-store.ts'

export const searchKnowledge = defineTool({
  name: 'search_knowledge',
  description:
    'Searches the company knowledge corpus and returns the most relevant passages (with PII redacted) and their sources.',
  parameters: v.object({
    query: v.string(),
    topK: v.optional(v.number(), 5),
  }),
  execute: async ({ query, topK }) => {
    const hits = await searchDocs(query, topK)
    const safe = hits.map((row) => ({
      source: row.source,
      content: redactPii(String(row.content)),
    }))
    return JSON.stringify(safe, null, 2)
  },
})
