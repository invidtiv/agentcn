const GITHUB_API = "https://api.github.com";

const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

export default async (inputData: {
  readonly owner: string;
  readonly repo: string;
  readonly filePath: string;
  readonly ref?: unknown;
}) => {
  const { owner, repo, filePath, ref } = inputData;
  const url = new URL(
    `${GITHUB_API}/repos/${owner}/${repo}/contents/${filePath}`
  );
  if (ref) {
    url.searchParams.set("ref", ref);
  }
  const data = await fetch(url.toString(), { headers: headers() }).then((r) =>
    r.json()
  );
  if (data.encoding === "base64") {
    return {
      content: Buffer.from(data.content as string, "base64").toString("utf-8"),
      encoding: "utf-8",
    };
  }
  return {
    content: (data.content as string) ?? "",
    encoding: (data.encoding as string) ?? "none",
  };
};
