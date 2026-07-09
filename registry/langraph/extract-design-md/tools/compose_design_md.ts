import { composeDesignMd } from "../lib/compose";

export default async (inputData: { readonly domain: string }) => {
  const { domain } = inputData;
  const normalized = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  if (!normalized) {
    return { error: `"${domain}" is not a valid domain.` };
  }
  return await composeDesignMd(normalized);
};
