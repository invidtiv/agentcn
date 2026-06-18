import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { search } from '../lib/vector-store.ts'

export const searchDocs = defineTool({
  name: 'search_docs',
  description:
    'Retrieves the most relevant PDF chunks for a question, including the page number of each chunk for citation.',
  parameters: v.object({
    query: v.string(),
    topK: v.optional(v.number(), 5),
  }),
  execute: async ({ query, topK }) => {
    const hits = await search(query, topK)
    return JSON.stringify(hits, null, 2)
  },
})
