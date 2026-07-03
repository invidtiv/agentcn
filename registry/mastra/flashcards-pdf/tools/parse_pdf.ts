import { createTool } from '@mastra/core/tools'
import { extractText, getDocumentProxy } from 'unpdf'
import { z } from 'zod'

export default createTool({
  id: 'parse_pdf',
  description: 'Extracts the full text content from a PDF at the given URL.',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ context }) => {
    const { url } = context
    const buffer = await fetch(url).then((r) => r.arrayBuffer())
    const pdf = await getDocumentProxy(new Uint8Array(buffer))
    const { text } = await extractText(pdf, { mergePages: true })
    return { text }
  },
})
