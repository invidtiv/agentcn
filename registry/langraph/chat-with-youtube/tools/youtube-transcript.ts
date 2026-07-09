import { YoutubeTranscript } from "youtube-transcript-scraper";

import { extractVideoId, formatTimestamp } from "../lib/youtube-utils";

export default async (inputData: { readonly url: string }) => {
  const { url } = inputData;
  const videoId = extractVideoId(url);

  if (!videoId) {
    return {
      error:
        "Invalid YouTube URL or video ID. Please provide a valid YouTube URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID or https://youtu.be/VIDEO_ID) or an 11-character video ID.",
      success: false,
    };
  }

  try {
    const fullUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const transcriptSegments = await YoutubeTranscript.fetchTranscript(fullUrl);

    if (!transcriptSegments || transcriptSegments.length === 0) {
      return {
        error:
          "No transcript available for this video. The video may not have captions enabled.",
        success: false,
        videoId,
      };
    }

    // Combine segments with timestamps for attribution
    const transcript = transcriptSegments
      .map((segment) => `[${formatTimestamp(segment.start)}] ${segment.text}`)
      .join("\n");

    // Calculate video duration from last segment
    const lastSegment = transcriptSegments.at(-1);
    const totalDuration = lastSegment.start + lastSegment.duration;
    const durationFormatted = formatTimestamp(totalDuration);

    return {
      durationFormatted,
      segmentCount: transcriptSegments.length,
      success: true,
      transcript,
      videoId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    if (errorMessage.includes("Could not find captions")) {
      return {
        error: "No captions/transcript available for this video.",
        success: false,
        videoId,
      };
    }

    if (errorMessage.includes("Video unavailable")) {
      return {
        error:
          "Video is unavailable. It may be private, deleted, or region-restricted.",
        success: false,
        videoId,
      };
    }

    return {
      error: `Failed to fetch transcript: ${errorMessage}`,
      success: false,
      videoId,
    };
  }
};
