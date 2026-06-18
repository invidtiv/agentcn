import { defineTool } from '@flue/runtime'
import * as v from 'valibot'

export const getWeather = defineTool({
  name: 'get_weather',
  description: 'Gets the current weather for a named location.',
  parameters: v.object({
    location: v.string(),
  }),
  execute: async ({ location }) => {
    const geo = (await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1`
    ).then((r) => r.json())) as {
      results?: { latitude: number; longitude: number; name: string }[]
    }
    const place = geo.results?.[0]
    if (!place) {
      return `No location found for "${location}".`
    }
    const weather = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,apparent_temperature,wind_speed_10m,weather_code`
    ).then((r) => r.json())
    return JSON.stringify({ place: place.name, ...weather })
  },
})
