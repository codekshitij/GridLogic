import fastf1
import os
import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from .processor import F1DataProcessor
from .schemas import RaceInsights, TelemetryPoint
from typing import List, Optional

app = FastAPI(title="Kidō F1 Analytics Engine")

# --- FastF1 Cache Setup ---
cache_dir = 'data_cache'
if not os.path.exists(cache_dir):
    os.makedirs(cache_dir)
fastf1.Cache.enable_cache(cache_dir)

# --- CORS Setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

processor = F1DataProcessor()

@app.get("/health")
def health_check():
    return {"status": "active", "engine": "Kidō"}

@app.get("/insights/{year}/{gp}", response_model=RaceInsights)
async def get_insights(year: int, gp: str):
    try:
        data = processor.get_race_insights(year, gp)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/telemetry/{year}/{gp}/{driver}", response_model=List[TelemetryPoint])
async def get_telemetry(year: int, gp: str, driver: str):
    try:
        data = processor.get_fastest_telemetry(year, gp, driver)
        return data
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Telemetry not found for {driver}")

@app.get("/races/{year}")
def get_races(year: int):
    try:
        schedule = fastf1.get_event_schedule(year)
        races = schedule[schedule['EventFormat'] != 'testing']
        return {
            "year": year,
            "events": races['EventName'].tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch schedule: {str(e)}")

@app.get("/races/{year}/{gp}/meta")
def get_race_meta(year: int, gp: str):
    return processor.get_minimal_meta(year, gp)

@app.get("/races/{year}/{gp}/telemetry")
def get_driver_telemetry(year: int, gp: str, drivers: str = Query(...)):
    driver_list = drivers.split(',')
    # Logic is now moved to the processor!
    data = processor.get_selective_telemetry(year, gp, driver_list)
    return {"pace_evolution": data}

@app.get("/races/{year}/{gp}/analytics")
def get_race_analytics(year: int, gp: str):
    try:
        return processor.get_race_analytics(year, gp)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compute analytics: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)