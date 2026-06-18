import type { FlueContext } from '@flue/runtime'
import { indexDoc } from '../lib/vector-store.ts'

/**
 * Scheduled re-index: feed it the documents pulled from your sources (Linear,
 * Notion, wiki) and it embeds them into the corpus. Run on a cron (e.g. every 6h).
 */
export async function run({
  payload,
}: FlueContext<{ documents: { source: string; content: string }[] }>) {
  let indexed = 0
  for (const doc of payload.documents) {
    indexed += await indexDoc(doc)
  }
  return { documents: payload.documents.length, chunks: indexed }
}
