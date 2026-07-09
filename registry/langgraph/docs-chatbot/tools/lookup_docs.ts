import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

interface FunctionDoc {
  name: string;
  signature: string;
  description: string;
}

const DATA_URL = new URL("../data/functions.json", import.meta.url);

export default async (inputData: { readonly query: string }) => {
  const { query } = inputData;
  const docs = JSON.parse(
    await readFile(fileURLToPath(DATA_URL), "utf-8")
  ) as FunctionDoc[];
  const q = query.toLowerCase();
  const matches = docs.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.description.toLowerCase().includes(q)
  );
  return matches.length
    ? { matches }
    : { suggestions: docs.map((d) => d.name) };
};
