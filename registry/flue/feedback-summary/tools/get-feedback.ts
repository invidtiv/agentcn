import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const getFeedback = defineTool({
  name: 'get_feedback',
  description: 'Retrieves a page of customer feedback entries from the feedback data source.',
  parameters: v.object({
    page: v.optional(v.number(), 1),
    pageSize: v.optional(v.number(), 50),
    segment: v.optional(v.string()),
  }),
  execute: async ({ page, pageSize, segment }) => {
    const url = new URL(process.env.FEEDBACK_API_URL ?? 'http://localhost:4111/feedback')
    url.searchParams.set('page', String(page))
    url.searchParams.set('pageSize', String(pageSize))
    if (segment) {
      url.searchParams.set('segment', segment)
    }
    const res = await fetch(url)
    return res.text()
  },
})
