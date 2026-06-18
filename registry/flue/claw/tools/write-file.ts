import { mkdir, writeFile } from 'node:fs/promises'
import { dirname } from 'node:path'
import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { resolveInWorkspace } from '../lib/workspace.ts'

export const writeFileTool = defineTool({
  name: 'write_file',
  description: 'Writes (or overwrites) a UTF-8 file in the workspace.',
  parameters: v.object({
    path: v.string(),
    content: v.string(),
  }),
  execute: async ({ path, content }) => {
    const target = resolveInWorkspace(path)
    await mkdir(dirname(target), { recursive: true })
    await writeFile(target, content, 'utf-8')
    return `Wrote ${content.length} bytes to ${path}.`
  },
})
