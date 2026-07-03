import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { db } from '../lib/db'

export default createTool({
  id: 'run_query',
  description: 'Executes a read-only SELECT query and returns the rows as JSON.',
  inputSchema: z.object({
    sql: z.string(),
  }),
  execute: async ({ context }) => {
    const { sql } = context
    if (!/^\s*select/i.test(sql)) {
      return { error: 'Refused: only read-only SELECT queries are allowed.' }
    }
    const result = await db.execute(sql)
    return { rows: result.rows }
  },
})
