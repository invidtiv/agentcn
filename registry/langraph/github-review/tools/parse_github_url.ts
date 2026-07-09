export default async (inputData: { readonly url: string }) => {
  const { url } = inputData;
  const match = url.match(
    /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/
  );
  if (!match) {
    throw new Error(`Invalid GitHub PR URL: ${url}`);
  }
  return {
    owner: match[1],
    prNumber: Number.parseInt(match[3], 10),
    repo: match[2],
  };
};
