import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getPage, snapshot } from '../lib/browser'

export default createTool({
  id: 'browser_click',
  description:
    'Clicks the element matching the given selector (from a snapshot) and returns the resulting page snapshot.',
  inputSchema: z.object({
    selector: z.string(),
  }),
  execute: async ({ context }) => {
    const { selector } = context
    const page = await getPage()
    await page.click(selector)
    await page.waitForLoadState('domcontentloaded').catch(() => {})
    return snapshot(page)
  },
})
