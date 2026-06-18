import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const webSearch = defineTool({
  name: 'web_search',
  description:
    'Searches the web and returns ranked results with titles, URLs, and text snippets.',
  parameters: v.object({
    query: v.string(),
    numResults: v.optional(v.number(), 5),
  }),
  execute: async ({ query, numResults }) => {
    const res = await fetch('https://api.exa.ai/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.EXA_API_KEY ?? '',
      },
      body: JSON.stringify({ query, numResults, contents: { text: true } }),
    })
    return res.text()
  },
})
