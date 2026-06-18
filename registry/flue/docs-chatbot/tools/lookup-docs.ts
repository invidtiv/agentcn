import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

interface FunctionDoc {
  name: string
  signature: string
  description: string
}

const DATA_URL = new URL('../data/functions.json', import.meta.url)

export const lookupDocs = defineTool({
  name: 'lookup_docs',
  description:
    'Looks up library functions matching a name or keyword and returns their documentation.',
  parameters: v.object({
    query: v.string(),
  }),
  execute: async ({ query }) => {
    const docs = JSON.parse(
      await readFile(fileURLToPath(DATA_URL), 'utf-8')
    ) as FunctionDoc[]
    const q = query.toLowerCase()
    const matches = docs.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.description.toLowerCase().includes(q)
    )
    return JSON.stringify(matches.length ? matches : docs.map((d) => d.name))
  },
})
