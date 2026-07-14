SPOTS = {
    "default": {
        "id": "default",
        "name": "La Corderie - Bréhat",
        "lat": 48.8531149173526,
        "lon": -3.011233363141454,
    },
}

ACTIVITY_DEFAULTS = {
    "windsurf": {
        "min_speed": 15,
        "direction_center": 270,
        "tolerance": 30,
    },
}


def get_spot(spot_id: str) -> dict:
    return SPOTS.get(spot_id, SPOTS["default"])


def get_activity_defaults(activity: str) -> dict:
    return ACTIVITY_DEFAULTS.get(activity, ACTIVITY_DEFAULTS["windsurf"])
