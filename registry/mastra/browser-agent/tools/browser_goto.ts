import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getPage, snapshot } from '../lib/browser'

export default createTool({
  id: 'browser_goto',
  description: 'Navigates the browser to a URL and returns a snapshot of the page.',
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ context }) => {
    const { url } = context
    const page = await getPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    return snapshot(page)
  },
})
