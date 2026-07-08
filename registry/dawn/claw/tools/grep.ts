import { readdir, readFile, stat } from "node:fs/promises";
import { join, relative } from "node:path";

import { resolveInWorkspace } from "../lib/workspace";

async function walk(dir: string): Promise<string[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === ".git") {
        continue;
      }
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

export default async (inputData: {
  readonly pattern: string;
  readonly dirPath?: unknown;
}) => {
  const { pattern, dirPath = "." } = inputData;
  const root = resolveInWorkspace(dirPath);
  const re = new RegExp(pattern, "gi");
  const files = await walk(root);
  const matches: { file: string; line: number; content: string }[] = [];
  for (const filePath of files) {
    try {
      const content = await readFile(filePath, "utf-8");
      const lines = content.split("\n");
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          matches.push({
            content: lines[i],
            file: relative(process.cwd(), filePath),
            line: i + 1,
          });
        }
        re.lastIndex = 0;
      }
    } catch {
      // skip unreadable files
    }
  }
  return { matches };
};
