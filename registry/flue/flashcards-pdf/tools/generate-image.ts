import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const generateImage = defineTool({
  name: 'generate_image',
  description: 'Generates an illustrative image for a flash-card concept and returns its URL.',
  parameters: v.object({
    prompt: v.string(),
  }),
  execute: async ({ prompt }) => {
    const res = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ''}`,
      },
      body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1024' }),
    })
    const data = (await res.json()) as { data?: { url?: string }[] }
    return data.data?.[0]?.url ?? ''
  },
})
