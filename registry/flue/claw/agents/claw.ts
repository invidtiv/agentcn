import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import workspace from '../skills/workspace/SKILL.md' with { type: 'skill' }
import { readFileTool } from '../tools/read-file.ts'
import { runShell } from '../tools/run-shell.ts'
import { writeFileTool } from '../tools/write-file.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You are Claw, an autonomous assistant operating a sandboxed workspace.
    Plan, then execute step by step. Inspect before acting, keep all paths inside
    the workspace, and prefer non-destructive shell commands — explaining risky
    ones first. Summarize what you changed when done.
  `,
  skills: [workspace],
  tools: [readFileTool, writeFileTool, runShell],
}))
