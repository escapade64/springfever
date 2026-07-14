from pathlib import Path
from typing import Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from config import get_activity_defaults, get_spot
from criteria import evaluate_hours
from weather import fetch_forecast

app = FastAPI(title="SpringFever - Fenetres meteo outdoor")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/forecast")
def forecast(
    spot: str = "default",
    activity: str = "windsurf",
    min_speed: Optional[float] = None,
    direction_center: Optional[float] = None,
    tolerance: Optional[float] = None,
    days: int = 7,
):
    spot_cfg = get_spot(spot)
    defaults = get_activity_defaults(activity)

    criteria = {
        "min_speed": min_speed if min_speed is not None else defaults["min_speed"],
        "direction_center": direction_center if direction_center is not None else defaults["direction_center"],
        "tolerance": tolerance if tolerance is not None else defaults["tolerance"],
    }

    raw = fetch_forecast(spot_cfg["lat"], spot_cfg["lon"], days=days)
    hours = evaluate_hours(raw, criteria)

    return {
        "spot": spot_cfg,
        "activity": activity,
        "criteria": criteria,
        "hours": hours,
    }


frontend_dir = Path(__file__).resolve().parent.parent / "frontend"
app.mount("/", StaticFiles(directory=frontend_dir, html=True), name="frontend")
