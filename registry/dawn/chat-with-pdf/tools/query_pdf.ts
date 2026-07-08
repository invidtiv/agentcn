import { queryPdfChunks } from "../lib/vector-store";

export default async (inputData: {
  readonly queryText: string;
  readonly documentId?: string;
  readonly pageStart?: number;
  readonly pageEnd?: number;
}) => {
  const { queryText, documentId, pageStart, pageEnd } = inputData;

  if (pageStart === undefined || pageEnd === undefined) {
    const results = await queryPdfChunks({
      documentId,
      queryText,
      topK: 20,
    });

    return {
      chunks: results.map((r) => ({
        documentTitle: r.documentTitle,
        pageNumber: r.pageNumber,
        score: r.score,
        text: r.text,
      })),
      totalChunks: results.length,
    };
  }

  const rangeSize = pageEnd - pageStart + 1;
  const thirdSize = Math.ceil(rangeSize / 3);

  const earlyPages: number[] = [];
  const middlePages: number[] = [];
  const latePages: number[] = [];

  for (let page = pageStart; page <= pageEnd; page++) {
    const offset = page - pageStart;
    if (offset < thirdSize) {
      earlyPages.push(page);
    } else if (offset < thirdSize * 2) {
      middlePages.push(page);
    } else {
      latePages.push(page);
    }
  }

  const shuffle = <T>(arr: T[]): T[] => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  const pagesPerSection = 2;
  const selectedPages = [
    ...shuffle(earlyPages).slice(0, pagesPerSection),
    ...shuffle(middlePages).slice(0, pagesPerSection),
    ...shuffle(latePages).slice(0, pagesPerSection),
  ];

  const results: {
    text: string;
    pageNumber: number;
    score: number;
  }[] = [];

  for (const page of selectedPages) {
    try {
      const pageResults = await queryPdfChunks({
        documentId,
        pageNumber: page,
        queryText,
        topK: 2,
      });

      for (const r of pageResults) {
        results.push({
          pageNumber: page,
          score: r.score || 0,
          text: r.text,
        });
      }
    } catch {
      // Page may have no chunks
    }
  }

  const shuffledResults = shuffle(results);

  return {
    chunks: shuffledResults,
    note: "Stratified sample: chunks from early, middle, AND late pages. Each chunk has a pageNumber - use it for the hint.",
    pagesCovered: `${pageStart}-${pageEnd}`,
    pagesReturned: selectedPages.toSorted((a, b) => a - b),
    totalChunks: shuffledResults.length,
  };
};
