import { createTool } from '@mastra/core/tools'
import { z } from 'zod'

const GITHUB_API = 'https://api.github.com'

const headers = () => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
  'X-GitHub-Api-Version': '2022-11-28',
})

export default createTool({
  id: 'fetch_pr',
  description:
    'Fetches a GitHub pull request — its metadata and the list of changed files with patches.',
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    pullNumber: z.number(),
  }),
  execute: async ({ context }) => {
    const { owner, repo, pullNumber } = context
    const base = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${pullNumber}`
    const [pr, files] = await Promise.all([
      fetch(base, { headers: headers() }).then((r) => r.json()),
      fetch(`${base}/files?per_page=100`, { headers: headers() }).then((r) =>
        r.json()
      ),
    ])
    return { files, pr }
  },
})
