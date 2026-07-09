export const PDF_INDEX_NAME = "pdf_sections";

export interface PdfChunk {
  readonly documentId: string;
  readonly documentTitle: string;
  readonly pageNumber: number;
  readonly text: string;
  readonly totalPages: number;
}

const chunks: PdfChunk[] = [];

export async function addPdfChunks(
  nextChunks: readonly PdfChunk[]
): Promise<void> {
  chunks.push(...nextChunks);
}

export async function listPdfDocuments() {
  const documents = new Map<
    string,
    { documentId: string; title: string; totalPages: number }
  >();

  for (const chunk of chunks) {
    if (!documents.has(chunk.documentId)) {
      documents.set(chunk.documentId, {
        documentId: chunk.documentId,
        title: chunk.documentTitle,
        totalPages: chunk.totalPages,
      });
    }
  }

  return [...documents.values()];
}

export async function queryPdfChunks(input: {
  readonly documentId?: string;
  readonly pageNumber?: number;
  readonly queryText: string;
  readonly topK?: number;
}) {
  const terms = input.queryText.toLowerCase().split(/\s+/).filter(Boolean);

  return chunks
    .filter(
      (chunk) => !input.documentId || chunk.documentId === input.documentId
    )
    .filter(
      (chunk) =>
        input.pageNumber === undefined || chunk.pageNumber === input.pageNumber
    )
    .map((chunk) => {
      const haystack = chunk.text.toLowerCase();
      const score = terms.reduce(
        (total, term) => total + (haystack.includes(term) ? 1 : 0),
        0
      );
      return { ...chunk, score };
    })
    .filter((chunk) => chunk.score > 0)
    .toSorted((a, b) => b.score - a.score)
    .slice(0, input.topK ?? 20);
}

export async function ensureIndex(): Promise<void> {
  // Kept for parity with recipes that call an indexing setup step.
}
