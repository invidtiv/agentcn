import { readFile } from "node:fs/promises";

import { resolveInWorkspace } from "../lib/workspace";

export default async (inputData: { readonly path: string }) => {
  const { path: filePath } = inputData;
  const content = await readFile(resolveInWorkspace(filePath), "utf-8");
  return { content, path: filePath };
};
