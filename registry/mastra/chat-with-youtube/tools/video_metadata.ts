import { createTool } from '@mastra/core/tools'
import { z } from 'zod'
import { unlock, videoId } from '../lib/brightdata'

export default createTool({
  id: 'video_metadata',
  description: "Fetches a YouTube video's title, author, and id from its URL.",
  inputSchema: z.object({
    url: z.string().url(),
  }),
  execute: async ({ context }) => {
    const { url } = context
    const raw = await unlock(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    )
    const meta = JSON.parse(raw) as { title?: string; author_name?: string }
    return { author: meta.author_name, id: videoId(url), title: meta.title }
  },
})
