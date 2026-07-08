import { db } from "../lib/db";

const BLOCKED_PATTERNS = [
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|REPLACE)\b/i,
  /\b(ATTACH|DETACH)\b/i,
  /\b(PRAGMA)\b/i,
  /;.*\S/, // multiple statements
];

export default async (inputData: { readonly query: string }) => {
  const { query } = inputData;
  const trimmed = query.trim().replace(/;$/, "");

  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(trimmed)) {
      throw new Error("Only SELECT queries are allowed.");
    }
  }

  if (!/^\s*SELECT\b/i.test(trimmed)) {
    throw new Error("Query must start with SELECT.");
  }

  const result = await db.execute(trimmed);

  return {
    rowCount: result.rows.length,
    rows: result.rows as Record<string, unknown>[],
  };
};
