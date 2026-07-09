import { extractVideoId, formatTimestamp } from "../lib/youtube-utils";

export default async (inputData: { readonly url: string }) => {
  const { url } = inputData;
  const videoId = extractVideoId(url);

  if (!videoId) {
    return {
      error: "Invalid YouTube URL or video ID.",
      success: false,
    };
  }

  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });

    if (!response.ok) {
      return {
        error:
          "Could not fetch video page. The video may be private or unavailable.",
        success: false,
        videoId,
      };
    }

    const html = await response.text();

    // Extract ytInitialPlayerResponse which contains video details
    const playerMatch = html.match(/var ytInitialPlayerResponse = ({.+?});/s);

    if (!playerMatch) {
      return {
        error: "Could not parse video metadata from page.",
        success: false,
        videoId,
      };
    }

    const playerData = JSON.parse(playerMatch[1]);
    const videoDetails = playerData?.videoDetails;

    if (!videoDetails) {
      return {
        error: "Video details not found. The video may be unavailable.",
        success: false,
        videoId,
      };
    }

    const durationSeconds =
      Number.parseInt(videoDetails.lengthSeconds, 10) || 0;

    return {
      author: videoDetails.author || "",
      description: videoDetails.shortDescription || "",
      durationFormatted: formatTimestamp(durationSeconds),
      durationSeconds,
      success: true,
      title: videoDetails.title || "",
      videoId,
    };
  } catch (error) {
    return {
      error: `Failed to fetch metadata: ${error instanceof Error ? error.message : "Unknown error"}`,
      success: false,
      videoId,
    };
  }
};
