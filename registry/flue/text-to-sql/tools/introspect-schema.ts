import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { db } from '../lib/db.ts'

export const introspectSchema = defineTool({
  name: 'introspect_schema',
  description:
    'Lists the database tables and their columns so you can write correct SQL.',
  parameters: v.object({}),
  execute: async () => {
    const tables = await db.execute(
      "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%'"
    )
    const schema: Record<string, unknown> = {}
    for (const row of tables.rows) {
      const name = String(row.name)
      const info = await db.execute(`PRAGMA table_info(${name})`)
      schema[name] = info.rows.map((c) => ({ name: c.name, type: c.type }))
    }
    return JSON.stringify(schema, null, 2)
  },
})
