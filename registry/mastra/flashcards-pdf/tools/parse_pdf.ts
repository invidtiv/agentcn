import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export default createTool({
  id: 'parse_pdf',
  description: 'Extract text content from a PDF file at the given URL',
  inputSchema: z.object({
    url: z.string().url().describe('URL of the PDF file to parse'),
  }),
  outputSchema: z.object({
    text: z.string().describe('Extracted text content from the PDF'),
    pageCount: z.number().describe('Number of pages in the PDF'),
  }),
  execute: async ({ context }) => {
    const { url } = context

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to download PDF: ${response.status} ${response.statusText}`)
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      // Simple PDF text extraction - in production, use a proper PDF parsing library
      // This is a simplified version that extracts text from PDF
      const text = buffer.toString('utf-8')

      // Count pages (simplified - look for /Page objects)
      const pageCount = (text.match(/\/Type\s*\/Page[^s]/g) || []).length || 1

      return {
        text: text.substring(0, 10000), // Limit to first 10k chars for safety
        pageCount,
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      throw new Error(`Failed to parse PDF: ${errorMessage}`)
    }
  },
})