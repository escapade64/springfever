const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

async function fetchForecast(lat, lon, days = 7) {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    hourly: "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
    daily: "sunrise,sunset",
    timezone: "auto",
    wind_speed_unit: "kn",
    forecast_days: days,
  });

  const res = await fetch(`${OPEN_METEO_URL}?${params}`);
  if (!res.ok) throw new Error(`Open-Meteo a répondu ${res.status}`);
  return res.json();
}
