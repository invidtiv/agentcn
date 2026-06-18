import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export const readRange = defineTool({
  name: 'read_range',
  description:
    'Reads a range of cells from a Google Sheet using A1 notation (e.g. "Sheet1!A1:F100").',
  parameters: v.object({
    spreadsheetId: v.string(),
    range: v.string(),
  }),
  execute: async ({ spreadsheetId, range }) => {
    const res = await fetch(
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN ?? ''}`,
        },
      }
    )
    return res.text()
  },
})
