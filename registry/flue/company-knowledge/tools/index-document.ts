import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { indexDoc } from '../lib/vector-store.ts'

export const indexDocument = defineTool({
  name: 'index_document',
  description: 'Adds a document to the knowledge corpus by chunking and embedding it.',
  parameters: v.object({
    source: v.string(),
    content: v.string(),
  }),
  execute: async ({ source, content }) => {
    const chunks = await indexDoc({ source, content })
    return `Indexed ${chunks} chunks from "${source}".`
  },
})
