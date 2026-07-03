import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { getPage, snapshot } from '../lib/browser'

export default createTool({
  id: 'browser_type',
  description:
    'Types text into the input matching the selector (optionally pressing Enter), then returns a snapshot.',
  inputSchema: z.object({
    selector: z.string(),
    text: z.string(),
    submit: z.boolean().default(false),
  }),
  execute: async ({ context }) => {
    const { selector, text, submit } = context
    const page = await getPage()
    await page.fill(selector, text)
    if (submit) {
      await page.press(selector, 'Enter')
      await page.waitForLoadState('domcontentloaded').catch(() => {})
    }
    return snapshot(page)
  },
})
