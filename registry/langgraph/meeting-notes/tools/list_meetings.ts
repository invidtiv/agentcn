const ZOOM_API = "https://api.zoom.us/v2";

const headers = () => ({
  Authorization: `Bearer ${process.env.ZOOM_JWT_TOKEN ?? ""}`,
  "Content-Type": "application/json",
});

export default async (inputData: {
  readonly userId?: unknown;
  readonly limit?: unknown;
}) => {
  const { userId = "me", limit = 30 } = inputData;
  const url = new URL(`${ZOOM_API}/users/${userId}/meetings`);
  url.searchParams.set("type", "scheduled");
  url.searchParams.set("page_size", String(Math.min(limit, 300)));
  const data = await fetch(url.toString(), { headers: headers() }).then((r) =>
    r.json()
  );
  return {
    meetings: ((data.meetings ?? []) as any[]).map((m) => ({
      duration: m.duration as number,
      id: String(m.id),
      startTime: m.start_time as string,
      topic: m.topic as string,
    })),
  };
};
