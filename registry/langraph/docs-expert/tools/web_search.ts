const trimTrailingSlash = (value: string) =>
  value.endsWith("/") ? value.slice(0, -1) : value;

const getGatewayUrl = () =>
  trimTrailingSlash(
    process.env.DAWN_GATEWAY_URL ??
      process.env.MASTRA_GATEWAY_URL ??
      "https://gateway-api.mastra.ai"
  );

const getGatewayChatCompletionsUrl = () => {
  const gatewayUrl = getGatewayUrl();

  if (gatewayUrl.endsWith("/v1")) {
    return `${gatewayUrl}/chat/completions`;
  }

  return `${gatewayUrl}/v1/chat/completions`;
};

interface GatewayAnnotation {
  type?: string;
  url_citation?: {
    title?: string;
    url?: string;
  };
}

interface GatewayResponse {
  choices?: {
    message?: {
      content?: string | { type?: string; text?: string }[];
      annotations?: GatewayAnnotation[];
    };
  }[];
}

const parseContent = (
  content: string | { type?: string; text?: string }[] | undefined
) => {
  if (typeof content === "string") {
    return content;
  }

  if (Array.isArray(content)) {
    return content
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .filter(Boolean)
      .join("\n");
  }

  return "";
};

const parseSources = (annotations: GatewayAnnotation[] = []) => {
  const seen = new Set<string>();

  return annotations
    .map((annotation) => annotation.url_citation)
    .filter((citation): citation is { title?: string; url?: string } =>
      Boolean(citation?.url)
    )
    .map((citation) => ({
      title: citation.title ?? citation.url!,
      url: citation.url!,
    }))
    .filter((source) => {
      if (seen.has(source.url)) {
        return false;
      }

      seen.add(source.url);
      return true;
    });
};

export default async (inputData: { readonly query: string }) => {
  const apiKey =
    process.env.DAWN_GATEWAY_API_KEY ?? process.env.MASTRA_GATEWAY_API_KEY;

  if (!apiKey) {
    throw new Error("DAWN_GATEWAY_API_KEY is required to use web_search.");
  }

  const response = await fetch(getGatewayChatCompletionsUrl(), {
    body: JSON.stringify({
      messages: [
        {
          content:
            "Search the web for the user query. Return a concise factual summary and preserve source citations in the response metadata.",
          role: "system",
        },
        {
          content: inputData.query,
          role: "user",
        },
      ],
      model: "openai/gpt-5-mini",
      tools: [
        {
          search_context_size: "medium",
          type: "openrouter:web_search",
        },
      ],
    }),
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Gateway web search failed: ${response.status} ${response.statusText}`.trim()
    );
  }

  const data = (await response.json()) as GatewayResponse;
  const message = data.choices?.[0]?.message;

  return {
    answer: parseContent(message?.content),
    sources: parseSources(message?.annotations),
  };
};
