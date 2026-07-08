import { runAudit } from "../lib/audit";
import { normalizeAuditUrl } from "../lib/url";

export default async (inputData: { readonly url: string }) => {
  const { url } = inputData;
  const normalized = normalizeAuditUrl(url);
  if (!normalized) {
    return { error: `"${url}" is not a valid URL.` };
  }
  return await runAudit(normalized, process.env.CONTEXT_DEV_API_KEY ?? "");
};
