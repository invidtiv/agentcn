import { exec } from 'node:child_process'
import { promisify } from 'node:util'
import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { WORKSPACE } from '../lib/workspace.ts'

const run = promisify(exec)

export const runShell = defineTool({
  name: 'run_shell',
  description:
    'Runs a shell command inside the workspace directory and returns its stdout/stderr.',
  parameters: v.object({
    command: v.string(),
  }),
  execute: async ({ command }) => {
    try {
      const { stdout, stderr } = await run(command, {
        cwd: WORKSPACE,
        timeout: 60_000,
      })
      return JSON.stringify({ stdout, stderr })
    } catch (error) {
      return JSON.stringify({ error: String(error) })
    }
  },
})
