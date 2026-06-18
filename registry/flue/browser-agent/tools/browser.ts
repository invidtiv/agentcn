import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { getPage, snapshot } from '../lib/browser.ts'

export const browserGoto = defineTool({
  name: 'browser_goto',
  description: 'Navigates the browser to a URL and returns a snapshot of the page.',
  parameters: v.object({ url: v.string() }),
  execute: async ({ url }) => {
    const page = await getPage()
    await page.goto(url, { waitUntil: 'domcontentloaded' })
    return JSON.stringify(await snapshot(page))
  },
})

export const browserSnapshot = defineTool({
  name: 'browser_snapshot',
  description:
    'Returns the current page snapshot: title, URL, visible text, and interactive elements with selectors.',
  parameters: v.object({}),
  execute: async () => {
    const page = await getPage()
    return JSON.stringify(await snapshot(page))
  },
})

export const browserClick = defineTool({
  name: 'browser_click',
  description:
    'Clicks the element matching the selector (from a snapshot) and returns the resulting page snapshot.',
  parameters: v.object({ selector: v.string() }),
  execute: async ({ selector }) => {
    const page = await getPage()
    await page.click(selector)
    await page.waitForLoadState('domcontentloaded').catch(() => {})
    return JSON.stringify(await snapshot(page))
  },
})

export const browserType = defineTool({
  name: 'browser_type',
  description:
    'Types text into the input matching the selector (optionally pressing Enter), then returns a snapshot.',
  parameters: v.object({
    selector: v.string(),
    text: v.string(),
    submit: v.optional(v.boolean(), false),
  }),
  execute: async ({ selector, text, submit }) => {
    const page = await getPage()
    await page.fill(selector, text)
    if (submit) {
      await page.press(selector, 'Enter')
      await page.waitForLoadState('domcontentloaded').catch(() => {})
    }
    return JSON.stringify(await snapshot(page))
  },
})
