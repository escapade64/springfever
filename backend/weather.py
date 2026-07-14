import httpx

OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast"


def fetch_forecast(lat: float, lon: float, days: int = 7) -> dict:
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "wind_speed_10m,wind_direction_10m,wind_gusts_10m",
        "daily": "sunrise,sunset",
        "timezone": "auto",
        "wind_speed_unit": "kn",
        "forecast_days": days,
    }
    response = httpx.get(OPEN_METEO_URL, params=params, timeout=10)
    response.raise_for_status()
    return response.json()
