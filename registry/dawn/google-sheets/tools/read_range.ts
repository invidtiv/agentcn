const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

export default async (inputData: {
  readonly spreadsheetId: string;
  readonly range: string;
}) => {
  const { spreadsheetId, range } = inputData;
  const res = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN ?? ""}`,
      },
    }
  );
  return res.json();
};
