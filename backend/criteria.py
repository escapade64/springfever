from datetime import datetime


def _angular_diff(a: float, b: float) -> float:
    diff = abs(a - b) % 360
    return min(diff, 360 - diff)


def _is_daylight(time_str: str, daily: dict) -> bool:
    day = time_str[:10]
    for i, date in enumerate(daily["time"]):
        if date == day:
            sunrise = datetime.fromisoformat(daily["sunrise"][i])
            sunset = datetime.fromisoformat(daily["sunset"][i])
            t = datetime.fromisoformat(time_str)
            return sunrise <= t <= sunset
    return False


def evaluate_hours(raw: dict, criteria: dict) -> list[dict]:
    hourly = raw["hourly"]
    daily = raw["daily"]
    times = hourly["time"]
    speeds = hourly["wind_speed_10m"]
    directions = hourly["wind_direction_10m"]
    gusts = hourly.get("wind_gusts_10m", [None] * len(times))

    results = []
    for t, speed, direction, gust in zip(times, speeds, directions, gusts):
        daylight = _is_daylight(t, daily)
        speed_ok = speed is not None and speed >= criteria["min_speed"]
        direction_ok = direction is not None and _angular_diff(direction, criteria["direction_center"]) <= criteria["tolerance"]
        results.append({
            "time": t,
            "wind_speed": speed,
            "wind_direction": direction,
            "wind_gusts": gust,
            "daylight": daylight,
            "go": daylight and speed_ok and direction_ok,
        })
    return results
