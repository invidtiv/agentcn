import { indexDoc } from "../lib/vector-store";

export default async (inputData: {
  readonly source: string;
  readonly content: string;
}) => {
  const { source, content } = inputData;
  const chunks = await indexDoc({ content, source });
  return { chunks, source };
};
