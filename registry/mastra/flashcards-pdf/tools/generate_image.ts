import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

export default createTool({
  id: 'generate_image',
  description:
    'Generates an illustrative image for a flash-card concept and returns its URL.',
  inputSchema: z.object({
    prompt: z.string(),
  }),
  execute: async ({ context }) => {
    const { prompt } = context
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1024' }),
    })
    const data = (await res.json()) as { data?: { url?: string }[] }
    return { url: data.data?.[0]?.url ?? '' }
  },
})
