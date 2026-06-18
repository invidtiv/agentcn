import { defineTool } from '@flue/runtime'
import * as v from 'valibot'
import { YoutubeTranscript } from 'youtube-transcript'

export const getTranscript = defineTool({
  name: 'get_transcript',
  description:
    'Fetches the timestamped transcript of a YouTube video as an array of { text, seconds } segments.',
  parameters: v.object({
    url: v.string(),
  }),
  execute: async ({ url }) => {
    const segments = await YoutubeTranscript.fetchTranscript(url)
    return JSON.stringify(
      segments.map((s) => ({ text: s.text, seconds: Math.floor(s.offset / 1000) }))
    )
  },
})
