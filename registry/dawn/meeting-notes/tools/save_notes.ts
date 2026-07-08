export default async (inputData: {
  readonly summary: string;
  readonly decisions: string;
  readonly actionItems: unknown[];
  readonly owner: string;
  readonly task: string;
  readonly openQuestions: string;
}) => inputData;
