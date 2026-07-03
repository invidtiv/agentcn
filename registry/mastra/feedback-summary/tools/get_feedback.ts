import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export default createTool({
  id: 'get_feedback',
  description:
    'Retrieves a page of customer feedback entries from the feedback data source.',
  inputSchema: z.object({
    page: z.number().min(1).default(1),
    pageSize: z.number().min(1).max(100).default(50),
    segment: z.string().optional(),
  }),
  execute: async ({ context }) => {
    const { page, pageSize, segment } = context
    const url = new URL(process.env.FEEDBACK_API_URL ?? 'http://localhost:4111/feedback')
    url.searchParams.set('page', String(page))
    url.searchParams.set('pageSize', String(pageSize))
    if (segment) {
      url.searchParams.set('segment', segment)
    }
    const res = await fetch(url)
    return { entries: await res.json() }
  },
})
