import { readFile } from 'node:fs/promises'
import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { resolveInWorkspace } from '../lib/workspace.ts'

export const readFileTool = defineTool({
  name: 'read_file',
  description: 'Reads a UTF-8 file from the workspace.',
  parameters: v.object({
    path: v.string(),
  }),
  execute: async ({ path }) => readFile(resolveInWorkspace(path), 'utf-8'),
})
