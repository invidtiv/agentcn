import { unlink } from "node:fs/promises";

import { resolveInWorkspace } from "../lib/workspace";

export default async (inputData: { readonly path: string }) => {
  const { path: filePath } = inputData;
  const target = resolveInWorkspace(filePath);
  await unlink(target);
  return { path: filePath, success: true };
};
