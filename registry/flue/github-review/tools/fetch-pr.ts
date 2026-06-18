import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

const GITHUB_API = 'https://api.github.com'

const headers = () => ({
  Accept: 'application/vnd.github+json',
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ''}`,
  'X-GitHub-Api-Version': '2022-11-28',
})

export const fetchPr = defineTool({
  name: 'fetch_pr',
  description:
    'Fetches a GitHub pull request — its metadata and the list of changed files with patches.',
  parameters: v.object({
    owner: v.string(),
    repo: v.string(),
    pullNumber: v.number(),
  }),
  execute: async ({ owner, repo, pullNumber }) => {
    const base = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${pullNumber}`
    const [pr, files] = await Promise.all([
      fetch(base, { headers: headers() }).then((r) => r.json()),
      fetch(`${base}/files?per_page=100`, { headers: headers() }).then((r) =>
        r.json()
      ),
    ])
    return JSON.stringify({ pr, files }, null, 2)
  },
})
