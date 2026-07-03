import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export default createTool({
  id: 'fetch_csv',
  description: 'Fetches a CSV file from a URL and returns its raw text content.',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ context }) => {
    const { url } = context
    const content = await fetch(url).then((r) => r.text())
    return { content, url }
  },
})
