import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const postMessage = defineTool({
  name: 'post_message',
  description:
    'Posts a message to a Slack channel, optionally threaded under a parent message.',
  parameters: v.object({
    channel: v.string(),
    text: v.string(),
    threadTs: v.optional(v.string()),
  }),
  execute: async ({ channel, text, threadTs }) => {
    const res = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN ?? ''}`,
      },
      body: JSON.stringify({ channel, text, thread_ts: threadTs }),
    })
    return res.text()
  },
})
