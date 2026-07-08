import pdf from "pdf-parse";

export default async (inputData: { readonly url: string }) => {
  const { url } = inputData;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to download PDF: ${response.status} ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const data = await pdf(buffer);

    return {
      pageCount: data.numpages,
      text: data.text.slice(0, 10_000),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    throw new Error(`Failed to parse PDF: ${errorMessage}`, { cause: error });
  }
};
