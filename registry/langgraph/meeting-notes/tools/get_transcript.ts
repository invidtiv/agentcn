const ZOOM_API = "https://api.zoom.us/v2";

const headers = () => ({
  Authorization: `Bearer ${process.env.ZOOM_JWT_TOKEN ?? ""}`,
  "Content-Type": "application/json",
});

export default async (inputData: { readonly meetingId: string }) => {
  const { meetingId } = inputData;
  const url = `${ZOOM_API}/meetings/${meetingId}/recordings`;
  const data = await fetch(url, { headers: headers() }).then((r) => r.json());
  const recording = ((data.recording_files ?? []) as any[]).find(
    (r: any) => r.recording_type === "audio_transcript"
  );
  if (!recording?.download_url) {
    return { transcript: [] };
  }
  const transcriptText = await fetch(
    `${recording.download_url}?access_token=${process.env.ZOOM_JWT_TOKEN ?? ""}`
  ).then((r) => r.text());
  const lines = transcriptText.split("\n").filter(Boolean);
  return {
    transcript: lines.map((line) => {
      const match = line.match(/^(.+?)\s*\((\d{2}:\d{2}:\d{2})\)\s*(.+)$/);
      if (!match) {
        return { speaker: "Unknown", text: line, timestamp: "" };
      }
      return {
        speaker: match[1].trim(),
        text: match[3].trim(),
        timestamp: match[2],
      };
    }),
  };
};
