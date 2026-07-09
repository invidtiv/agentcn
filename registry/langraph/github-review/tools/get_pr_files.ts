const GITHUB_API = "https://api.github.com";

const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

export default async (inputData: {
  readonly owner: string;
  readonly repo: string;
  readonly prNumber: number;
}) => {
  const { owner, repo, prNumber } = inputData;
  const url = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${prNumber}/files?per_page=100`;
  const data = await fetch(url, { headers: headers() }).then((r) => r.json());
  return {
    files: (data as any[]).map((f) => ({
      additions: f.additions as number,
      deletions: f.deletions as number,
      filename: f.filename as string,
      status: f.status as string,
    })),
  };
};
