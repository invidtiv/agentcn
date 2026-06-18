import { defineTool } from '@flue/runtime'
import { extractText, getDocumentProxy } from 'unpdf'
import * as v from 'valibot'

export const parsePdf = defineTool({
  name: 'parse_pdf',
  description: 'Extracts the full text content from a PDF at the given URL.',
  parameters: v.object({
    url: v.string(),
  }),
  execute: async ({ url }) => {
    const buffer = await fetch(url).then((r) => r.arrayBuffer())
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })
    return text
  },
})
