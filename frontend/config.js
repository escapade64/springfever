const SPOTS = {
  default: {
    id: "default",
    name: "La Corderie - Bréhat",
    lat: 48.8531149173526,
    lon: -3.011233363141454,
  },
};

const ACTIVITY_DEFAULTS = {
  windsurf: {
    min_speed: 15,
    direction_center: 270,
    tolerance: 30,
  },
};

function getSpot(spotId) {
  return SPOTS[spotId] ?? SPOTS.default;
}

function getActivityDefaults(activity) {
  return ACTIVITY_DEFAULTS[activity] ?? ACTIVITY_DEFAULTS.windsurf;
}
