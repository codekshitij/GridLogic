import fastf1
import pandas as pd
from typing import List, Dict
from pathlib import Path

class F1DataProcessor:
    def __init__(self, cache_dir: str | None = None):
        if cache_dir is None:
            # Consistent cache pathing
            cache_path = Path(__file__).resolve().parent.parent / "data_cache"
        else:
            cache_path = Path(cache_dir)
        cache_path.mkdir(parents=True, exist_ok=True)
        fastf1.Cache.enable_cache(str(cache_path))

    def get_minimal_meta(self, year: int, gp: str) -> Dict:
        """
        NEW: Fetches only the entry list and race basics.
        Extremely fast because it skips lap/telemetry loading.
        """
        session = fastf1.get_session(year, gp, 'R')
        # Load absolutely nothing but the headers
        session.load(laps=True, telemetry=False, weather=False)
        
        results = session.results
        drivers_list = []
        
        for _, row in results.iterrows():
            drivers_list.append({
                "code": str(row['Abbreviation']),
                "name": str(row['FullName']),
                "team": str(row['TeamName']),
                "color": f"#{str(row['TeamColor'])}",
                "number": int(row['DriverNumber'])
            })

        fastest_lap = session.laps.pick_fastest()
        fastest_lap_payload = None
        if fastest_lap is not None and not pd.isna(fastest_lap.get('LapTime')):
            fastest_lap_payload = {
                "driver": str(fastest_lap.get('Driver')),
                "time": float(fastest_lap.get('LapTime').total_seconds()),
                "lap": int(fastest_lap.get('LapNumber')) if not pd.isna(fastest_lap.get('LapNumber')) else 0
            }

        return {
            "drivers": drivers_list,
            "total_laps": int(session.total_laps) if hasattr(session, 'total_laps') else 0,
            "event_name": str(session.event['EventName']),
            "fastest_lap": fastest_lap_payload
        }

    def get_selective_telemetry(self, year: int, gp: str, driver_codes: List[str]) -> Dict:
        """
        NEW: Fetches lap times only for specific drivers.
        Used to power the Pace Evolution chart dynamically.
        """
        session = fastf1.get_session(year, gp, 'R')
        # Only load laps. Skipping telemetry saves ~80% processing time.
        session.load(laps=True, telemetry=False, weather=False)
        
        pace_evolution = {}
        for code in driver_codes:
            driver_laps = session.laps.pick_driver(code)
            pace_evolution[code] = [
                {"l": int(row['LapNumber']), "t": float(row['LapTime'].total_seconds())}
                for _, row in driver_laps.iterrows()
                if not pd.isna(row['LapTime'])
            ]
            
        return pace_evolution

    def _get_session(self, year: int, gp: str, session_type: str = 'R'):
        """Helper to load and load telemetry."""
        session = fastf1.get_session(year, gp, session_type)
        session.load()
        return session

    def get_race_insights(self, year: int, gp: str) -> Dict:
        """Processes Insight A (Stints) and Insight B (Pace)."""
        session = self._get_session(year, gp)
        laps = session.laps

        # --- Insight A: Stints (Strategy) ---
        # Grouping by driver and stint to find start/end laps and compound
        stints_df = laps.groupby(['Driver', 'Stint', 'Compound']).agg({
            'LapNumber': ['min', 'max']
        }).reset_index()

        stints_df.columns = ['Driver', 'Stint', 'Compound', 'StartLap', 'EndLap']
        stints_df = stints_df[['Driver', 'Compound', 'StartLap', 'EndLap']]
        stints_json = stints_df.to_dict(orient='records')

        # --- Insight B: Pace Evolution ---
        # Filter for 'QuickLaps' to remove SC and In/Out laps for cleaner charts
        quick_laps = laps.pick_quicklaps()
        
        # Convert LapTime (timedelta) to total seconds for charting
        pace_df = quick_laps[['LapNumber', 'Driver', 'LapTime']].copy()
        pace_df['LapTime'] = pace_df['LapTime'].dt.total_seconds()
        pace_df.columns = ['Lap', 'Driver', 'LapTime']
        pace_json = pace_df.to_dict(orient='records')

        return {
            "year": year,
            "gp": gp,
            "stints": stints_json,
            "pace_evolution": pace_json
        }

    def get_fastest_telemetry(self, year: int, gp: str, driver: str) -> List[Dict]:
        """Processes Insight C (Telemetry for the fastest lap)."""
        session = self._get_session(year, gp)
        
        # Get the fastest lap for the specific driver
        fastest_lap = session.laps.pick_driver(driver).pick_fastest()
        telemetry = fastest_lap.get_telemetry()

        # Select core channels and convert to dict
        # We use 'Distance' as the X-axis for charts
        tel_df = telemetry[['Distance', 'Speed', 'Throttle', 'Brake']].copy()
        
        return tel_df.to_dict(orient='records')

# --- Local Testing Block ---
if __name__ == "__main__":
    processor = F1DataProcessor()
    # Testing with 2024 Bahrain GP (first race of the season)
    print("Testing Insight A & B extraction...")
    insights = processor.get_race_insights(2024, 'Bahrain')
    print(f"Extracted {len(insights['stints'])} stints.")
    
    print("Testing Telemetry extraction for VER...")
    tel = processor.get_fastest_telemetry(2024, 'Bahrain', 'VER')
    print(f"Extracted {len(tel)} telemetry data points.")