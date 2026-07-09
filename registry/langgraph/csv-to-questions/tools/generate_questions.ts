export default async (inputData: {
  readonly csv_text: string;
  readonly num_questions?: number;
}) => {
  const { csv_text, num_questions = 5 } = inputData;
  const count = Math.max(5, Math.min(10, num_questions));
  const [headerLine = "", ...rows] = csv_text.trim().split(/\r?\n/);
  const columns = headerLine
    .split(",")
    .map((column: string) => column.trim())
    .filter(Boolean);
  const sampleCount = rows.length;

  return {
    questions: Array.from({ length: count }, (_, index) => {
      const column =
        columns[index % Math.max(columns.length, 1)] ?? "the dataset";
      const difficulty =
        index % 3 === 0 ? "easy" : index % 3 === 1 ? "medium" : "hard";
      return {
        answer_hint: `Use the CSV header and the ${sampleCount} available rows as evidence.`,
        difficulty,
        question:
          difficulty === "easy"
            ? `What does the ${column} column describe?`
            : difficulty === "medium"
              ? `How does ${column} vary across the ${sampleCount} sampled rows?`
              : `What relationship between ${column} and another column would be worth testing?`,
      };
    }),
  };
};
