import { readdir, stat } from "node:fs/promises";

import { resolveInWorkspace } from "../lib/workspace";

export default async (inputData: { readonly dirPath?: unknown }) => {
  const { dirPath = "." } = inputData;
  const target = resolveInWorkspace(dirPath);
  const entries = await readdir(target, { withFileTypes: true });
  const result = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = `${target}/${entry.name}`;
      const s = await stat(fullPath);
      return {
        name: entry.name,
        size: s.size,
        type: entry.isDirectory() ? ("directory" as const) : ("file" as const),
      };
    })
  );
  return { files: result };
};
