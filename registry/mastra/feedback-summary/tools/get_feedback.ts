import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

const feedbackItemSchema = z.object({
  id: z.string(),
  text: z.string(),
  source: z.string(),
  date: z.string(),
  customer_tier: z.string(),
})

export default createTool({
  id: 'get_feedback',
  description:
    'Retrieves customer feedback from the database. Can filter by source, customer tier, or date range. Supports pagination via limit and offset. Use these to batch through large result sets without overwhelming the context window.',
  inputSchema: z.object({
    source: z
      .enum(['support_ticket', 'app_review', 'survey', 'social_media'])
      .optional()
      .describe('Filter by feedback source'),
    customer_tier: z.enum(['free', 'pro', 'enterprise']).optional().describe('Filter by customer tier'),
    start_date: z.string().optional().describe('Filter feedback from this date onwards (YYYY-MM-DD)'),
    end_date: z.string().optional().describe('Filter feedback up to this date (YYYY-MM-DD)'),
    limit: z.number().optional().default(40).describe('Maximum number of items to return (default: 40)'),
    offset: z.number().optional().default(0).describe('Number of items to skip for pagination (default: 0)'),
  }),
  outputSchema: z.object({
    feedback: z.array(feedbackItemSchema),
    total: z.number().describe('Total matching items (before pagination)'),
    returned: z.number().describe('Number of items in this page'),
    limit: z.number(),
    offset: z.number(),
    has_more: z.boolean().describe('Whether more items are available'),
    filters_applied: z.record(z.string(), z.string()),
  }),
  execute: async ({ context }) => {
    const { source, customer_tier, start_date, end_date, limit = 40, offset = 0 } = context

    // In a real implementation, this would query a database
    // For now, we'll return a mock response structure
    const filtersApplied: Record<string, string> = {}

    if (source) {
      filtersApplied.source = source
    }

    if (customer_tier) {
      filtersApplied.customer_tier = customer_tier
    }

    if (start_date) {
      filtersApplied.start_date = start_date
    }

    if (end_date) {
      filtersApplied.end_date = end_date
    }

    // Return empty array - in production this would query a real data source
    return {
      feedback: [],
      total: 0,
      returned: 0,
      limit,
      offset,
      has_more: false,
      filters_applied: filtersApplied,
    }
  },
})