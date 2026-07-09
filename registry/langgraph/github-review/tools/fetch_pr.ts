const GITHUB_API = "https://api.github.com";

const headers = () => ({
  Accept: "application/vnd.github+json",
  Authorization: `Bearer ${process.env.GITHUB_TOKEN ?? ""}`,
  "X-GitHub-Api-Version": "2022-11-28",
});

function mapPRResponse(data: any) {
  return {
    additions: data.additions as number,
    author: (data.user?.login as string) ?? "ghost",
    baseBranch: data.base.ref as string,
    body: (data.body as string) ?? null,
    changedFiles: data.changed_files as number,
    createdAt: data.created_at as string,
    deletions: data.deletions as number,
    headBranch: data.head.ref as string,
    headSha: data.head.sha as string,
    labels: ((data.labels ?? []) as { name: string }[]).map((l) => l.name),
    state: data.state as string,
    title: data.title as string,
    updatedAt: data.updated_at as string,
  };
}

function mapFilesResponse(data: any[]) {
  return data.map((f) => ({
    additions: f.additions as number,
    changes: f.changes as number,
    deletions: f.deletions as number,
    filename: f.filename as string,
    status: f.status as string,
    ...(f.patch !== undefined ? { patch: f.patch as string } : {}),
  }));
}

export default async (inputData: {
  readonly owner: string;
  readonly pullNumber: number;
  readonly repo: string;
}) => {
  const { owner, repo, pullNumber } = inputData;
  const base = `${GITHUB_API}/repos/${owner}/${repo}/pulls/${pullNumber}`;
  const [prResponse, filesResponse] = await Promise.all([
    fetch(base, { headers: headers() }).then((r) => r.json()),
    fetch(`${base}/files?per_page=100`, { headers: headers() }).then((r) =>
      r.json()
    ),
  ]);
  return {
    files: mapFilesResponse(filesResponse),
    pr: mapPRResponse(prResponse),
  };
};
