import { createAgent } from '@flue/runtime'
import type { AgentRouteHandler } from '@flue/runtime'
import { videoMetadata } from '../tools/metadata.ts'
import { getTranscript } from '../tools/transcript.ts'

export const route: AgentRouteHandler = async (_c, next) => next()

export default createAgent(() => ({
  model: 'anthropic/claude-sonnet-4-6',
  instructions: `
    You answer questions about YouTube videos from their transcripts.
    Call video_metadata for context, then get_transcript, and answer grounded
    only in the transcript. Cite moments as clickable links:
    https://youtu.be/<id>?t=<seconds>.
  `,
  tools: [videoMetadata, getTranscript],
}))
