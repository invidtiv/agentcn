import { agentConfig } from '@mastra/core/agent'
import { AgentBrowser } from '@mastra/agent-browser'

const browser = new AgentBrowser({
  headless: process.env.BROWSER_HEADLESS !== 'false',
  ...(process.env.BROWSER_CDP_URL
    ? { cdpUrl: process.env.BROWSER_CDP_URL, scope: 'shared' as const }
    : {}),
})

export default agentConfig({
  model: 'openai/gpt-5-mini',
  browser,
  defaultOptions: {
    maxSteps: 100,
  },
})
