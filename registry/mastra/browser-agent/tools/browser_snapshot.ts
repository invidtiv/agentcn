import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getPage, snapshot } from '../lib/browser'

export default createTool({
  id: 'browser_snapshot',
  description:
    'Returns the current page snapshot: title, URL, visible text, and interactive elements with selectors.',
  inputSchema: z.object({}),
  execute: async () => {
    const page = await getPage()
    return snapshot(page)
  },
})
