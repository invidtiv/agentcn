import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

import { resolveInWorkspace } from "../lib/workspace";

export default async (inputData: {
  readonly path: string;
  readonly content: string;
}) => {
  const { path: filePath, content } = inputData;
  const target = resolveInWorkspace(filePath);
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, content, "utf-8");
  return { bytes: content.length, path: filePath };
};
