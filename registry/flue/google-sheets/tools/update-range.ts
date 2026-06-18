import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

const SHEETS_API = 'https://sheets.googleapis.com/v4/spreadsheets'

export const updateRange = defineTool({
  name: 'update_range',
  description:
    'Writes a 2D array of values to a range in a Google Sheet using A1 notation.',
  parameters: v.object({
    spreadsheetId: v.string(),
    range: v.string(),
    values: v.array(v.array(v.union([v.string(), v.number()]))),
  }),
  execute: async ({ spreadsheetId, range, values }) => {
    const res = await fetch(
      `${SHEETS_API}/${spreadsheetId}/values/${encodeURIComponent(range)}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GOOGLE_ACCESS_TOKEN ?? ''}`,
        },
        body: JSON.stringify({ range, values }),
      }
    )
    return res.text()
  },
})
