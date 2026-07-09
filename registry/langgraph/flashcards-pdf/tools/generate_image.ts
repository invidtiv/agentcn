export default async (inputData: {
  readonly concept: string;
  readonly subjectArea: string;
}) => {
  const { concept, subjectArea } = inputData;
  const prompt = `Create a clear, educational diagram or illustration about "${concept}" in the subject of ${subjectArea}. The image should be suitable for a study flash card. Use clean visuals, labels where helpful, and no walls of text. Style: educational, clean, minimal.`;

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    body: JSON.stringify({
      model: "dall-e-3",
      prompt,
      size: "1024x1024",
    }),
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(
      `Image generation failed: ${response.status} ${response.statusText}`
    );
  }

  const data = (await response.json()) as {
    data?: { url?: string; revised_prompt?: string }[];
  };

  return {
    imagePath: data.data?.[0]?.url ?? "",
    revisedPrompt: data.data?.[0]?.revised_prompt ?? prompt,
  };
};
