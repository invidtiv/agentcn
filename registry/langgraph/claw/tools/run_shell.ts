import { exec } from "node:child_process";
import { promisify } from "node:util";

import { WORKSPACE } from "../lib/workspace";

const run = promisify(exec);

export default async (inputData: { readonly command: string }) => {
  const { command } = inputData;
  try {
    const { stdout, stderr } = await run(command, {
      cwd: WORKSPACE,
      timeout: 60_000,
    });
    return { stderr, stdout };
  } catch (error) {
    return { error: String(error) };
  }
};
