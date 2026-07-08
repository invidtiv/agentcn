const SHEETS_API = "https://sheets.googleapis.com/v4/spreadsheets";

export default async (inputData: {
  readonly spreadsheetId: string;
  readonly range: string;
  readonly values: string;
}) => {
  const { spreadsheetId, range, values } = inputData;
  const res = await fetch(
    `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
    {
      body: JSON.stringify({ range, values }),
      headers: {
        Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN ?? ""}`,
        "Content-Type": "application/json",
      },
      method: "PUT",
    }
  );
  return res.json();
};
