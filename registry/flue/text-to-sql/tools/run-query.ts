import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { db } from '../lib/db.ts'

export const runQuery = defineTool({
  name: 'run_query',
  description: 'Executes a read-only SELECT query and returns the rows as JSON.',
  parameters: v.object({
    sql: v.string(),
  }),
  execute: async ({ sql }) => {
    if (!/^\s*select/i.test(sql)) {
      return 'Refused: only read-only SELECT queries are allowed.'
    }
    const result = await db.execute(sql)
    return JSON.stringify(result.rows, null, 2)
  },
})
