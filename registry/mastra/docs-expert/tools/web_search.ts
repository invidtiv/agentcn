import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export default createTool({
  id: 'web_search',
  description:
    'Searches the web for documentation and returns ranked results with titles, URLs, and text snippets.',
  inputSchema: z.object({
    query: z.string(),
    numResults: z.number().min(1).max(10).default(5),
  }),
  execute: async ({ context }) => {
    const { query, numResults } = context
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXA_API_KEY ?? '',
      },
      body: JSON.stringify({
        query,
        numResults,
        contents: { text: true },
      }),
    })
    return res.json()
  },
})
