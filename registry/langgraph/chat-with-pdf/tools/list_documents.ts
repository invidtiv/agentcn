import { listPdfDocuments } from "../lib/vector-store";

export default async () => {
  try {
    const documents = await listPdfDocuments();

    if (documents.length === 0) {
      return {
        documents: [],
        message:
          "No documents have been indexed yet. Add an indexing workflow or populate the PDF chunk store before asking questions.",
      };
    }

    return {
      count: documents.length,
      documents,
    };
  } catch {
    return {
      documents: [],
      message:
        "Could not retrieve documents. The vector index may not exist yet.",
    };
  }
};
