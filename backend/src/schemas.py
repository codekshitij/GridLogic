from pydantic import BaseModel
from typing import List

class Stint(BaseModel):
    Driver: str
    Compound: str
    StartLap: int
    EndLap: int

class Pace(BaseModel):
    Lap: int
    Driver: str
    LapTime: float

class TelemetryPoint(BaseModel):
    Distance: float
    Speed: float
    Throttle: float
    Brake: float

class RaceInsights(BaseModel):
    year: int
    gp: str
    stints: List[Stint]
    pace_evolution: List[Pace]