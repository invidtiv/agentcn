import { readFile, writeFile } from "node:fs/promises";

import { resolveInWorkspace } from "../lib/workspace";

export default async (inputData: {
  readonly path: string;
  readonly oldContent: string;
  readonly newContent: string;
}) => {
  const { path: filePath, oldContent, newContent } = inputData;
  const target = resolveInWorkspace(filePath);
  const content = await readFile(target, "utf-8");
  if (!content.includes(oldContent)) {
    throw new Error(`oldContent not found in ${filePath}`);
  }
  await writeFile(target, content.replace(oldContent, newContent), "utf-8");
  return { path: filePath, success: true };
};
