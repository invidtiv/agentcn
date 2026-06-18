import { defineTool } from '@flue/runtime'
import { extractText, getDocumentProxy } from 'unpdf'
import * as v from 'valibot'
import { chunkText, upsertChunks } from '../lib/vector-store.ts'

export const indexPdf = defineTool({
  name: 'index_pdf',
  description:
    'Downloads a PDF, splits each page into chunks, embeds them, and stores them for retrieval.',
  parameters: v.object({
    url: v.string(),
    doc: v.optional(v.string()),
  }),
  execute: async ({ url, doc }) => {
    const buffer = await fetch(url).then((r) => r.arrayBuffer())
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: false })

    const chunks = text.flatMap((pageText, i) =>
      chunkText(pageText).map((content) => ({
        doc: doc ?? url,
        page: i + 1,
        content,
      }))
    )

    await upsertChunks(chunks)
    return `Indexed ${chunks.length} chunks across ${text.length} pages.`
  },
})
