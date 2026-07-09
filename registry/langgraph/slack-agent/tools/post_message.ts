export default async (inputData: { readonly text: string }) => {
  const { text } = inputData;
  return [...text].toReversed().join("");
};
