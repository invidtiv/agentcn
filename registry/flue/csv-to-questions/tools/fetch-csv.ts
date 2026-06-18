import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const fetchCsv = defineTool({
  name: 'fetch_csv',
  description: 'Fetches a CSV file from a URL and returns its raw text content.',
  parameters: v.object({
    url: v.string(),
  }),
  execute: async ({ url }) => {
    const res = await fetch(url)
    return res.text()
  },
})
