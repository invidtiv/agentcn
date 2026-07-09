import { redactPii } from "../lib/pii";
import { searchDocs } from "../lib/vector-store";

export default async (inputData: {
  readonly query: string;
  readonly topK?: number;
}) => {
  const { query, topK } = inputData;
  const hits = await searchDocs(query, topK);
  const results = hits.map((row) => ({
    content: redactPii(String(row.content)),
    score: row.score ? Number(row.score) : undefined,
    source: String(row.source),
    title: row.title ? String(row.title) : undefined,
    url: row.url ? String(row.url) : undefined,
  }));
  return { results };
};
