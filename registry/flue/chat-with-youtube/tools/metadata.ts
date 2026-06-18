import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const videoMetadata = defineTool({
  name: 'video_metadata',
  description: "Fetches a YouTube video's title, author, and id from its URL.",
  parameters: v.object({
    url: v.string(),
  }),
  execute: async ({ url }) => {
    const res = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
    )
    const meta = (await res.json()) as { title?: string; author_name?: string }
    const id = new URL(url).searchParams.get('v') ?? url.split('/').pop()
    return JSON.stringify({ id, title: meta.title, author: meta.author_name })
  },
})
