function angularDiff(a, b) {
  const diff = Math.abs(a - b) % 360;
  return Math.min(diff, 360 - diff);
}

function isDaylight(timeStr, daily) {
  const day = timeStr.slice(0, 10);
  const i = daily.time.indexOf(day);
  if (i === -1) return false;
  const t = new Date(timeStr);
  const sunrise = new Date(daily.sunrise[i]);
  const sunset = new Date(daily.sunset[i]);
  return t >= sunrise && t <= sunset;
}

function evaluateHours(raw, criteria) {
  const { hourly, daily } = raw;
  const { time, wind_speed_10m: speeds, wind_direction_10m: directions } = hourly;
  const gusts = hourly.wind_gusts_10m ?? time.map(() => null);

  return time.map((t, i) => {
    const speed = speeds[i];
    const direction = directions[i];
    const daylight = isDaylight(t, daily);
    const speedOk = speed != null && speed >= criteria.min_speed;
    const directionOk = direction != null && angularDiff(direction, criteria.direction_center) <= criteria.tolerance;

    return {
      time: t,
      wind_speed: speed,
      wind_direction: direction,
      wind_gusts: gusts[i],
      daylight,
      go: daylight && speedOk && directionOk,
    };
  });
}
