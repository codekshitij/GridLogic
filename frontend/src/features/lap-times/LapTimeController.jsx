import React, { useState, useEffect, useMemo } from 'react';
import { useRaceMeta, useDriverTelemetry } from '../../hooks/useRaceData';
import PaceChart from './PaceChart';
import FastestLapCard from './FastestLapCard';
import DriverPanel from '../../components/DriverPanel';

const LapTimeController = ({ year, gp, selectedDrivers, onSelectionChange }) => {
  // 1. Hook #1: Fetch metadata (instant, populates the DriverPanel)
  const meta = useRaceMeta(year, gp);
  
  // 2. Hook #2: Fetch telemetry (selective, only runs when drivers are clicked)
  const telemetry = useDriverTelemetry(year, gp, selectedDrivers);

  const [processed, setProcessed] = useState(null);

  // Derive state from the telemetry hook
  const hasValidSelection = !!telemetry.data?.pace_evolution && selectedDrivers.length > 0;
  
  // Check if we are waiting for the Meta (initial load) or Telemetry (worker processing)
  const isProcessing = (hasValidSelection && !processed) || telemetry.isFetching;

  // 3. Logic: Extract available drivers for the Panel grid
  const allDrivers = useMemo(() => {
    // Now pulling from the clean 'drivers' object array in the meta endpoint
    return meta.data?.drivers || [];
  }, [meta.data]);

  const fastestData = useMemo(() => {
  if (processed?.fastest) {
    return {
      driver: processed.fastest.Driver,
      time: processed.fastest.Time,
      lap: processed.fastest.Lap,
      isGlobal: false // fastest among selected
    };
  }
  
  if (meta.data?.fastest_lap) {
    return {
      driver: meta.data.fastest_lap.driver,
      time: meta.data.fastest_lap.time,
      lap: meta.data.fastest_lap.lap || 0,
      isGlobal: true // absolute fastest in race
    };
  }

  return null;
}, [processed, meta.data]);

  // 4. The Worker Effect: Runs when telemetry data changes
  useEffect(() => {
    if (!hasValidSelection || !telemetry.data) return;

    const worker = new Worker(new URL('./pace.worker.js', import.meta.url));
    
    // Pass the specific evolution data from the new hook
    worker.postMessage({ 
      paceData: telemetry.data.pace_evolution, 
      selectedDrivers 
    });

    worker.onmessage = (e) => {
      setProcessed(e.data);
      worker.terminate();
    };

    worker.onerror = (err) => {
      console.error("Worker Error:", err);
      worker.terminate();
    };

    return () => {
      worker.terminate();
      setProcessed(null); 
    };
  }, [telemetry.data, selectedDrivers, hasValidSelection]);

  // Handle Meta-level loading and errors
  if (meta.isLoading) return <div style={styles.loading}>SYNCING_RACE_METRICS...</div>;
  if (meta.error) return <div style={styles.error}>CONNECTION_LOST: {meta.error.message}</div>;

  return (
    <div style={styles.container}>
      <DriverPanel 
        allDrivers={allDrivers} 
        selectedDrivers={selectedDrivers} 
        onToggle={onSelectionChange} 
        onClear={() => onSelectionChange([])}
      />

      

      {!hasValidSelection && !telemetry.isFetching ? (
        <div style={styles.emptyState}>SELECT DRIVERS TO INITIALIZE ANALYSIS</div>
      ) : (isProcessing || !processed) ? (
        <div style={styles.loading}>ANALYZING_DATA_STREAM...</div>
      ) : (
        <div style={styles.grid}>
          <div style={styles.topRow}>
            <div style={styles.sidebar}>
              <FastestLapCard 
                driver={fastestData?.driver || '---'}
                time={typeof fastestData?.time === 'number' ? fastestData.time.toFixed(3) : '0.000'}
                lap={fastestData?.lap || 0}
                label={fastestData?.isGlobal ? 'RACE FASTEST' : 'SELECTION FASTEST'}
              />
            </div>
            <div style={styles.mainChart}>
              <PaceChart data={processed?.chartData} selectedDrivers={selectedDrivers} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: { display: 'flex', flexDirection: 'column', gap: '2rem' },
  grid: { display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeIn 0.5s ease-out' },
  topRow: { display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1.5rem' },
  sidebar: { gridColumn: 'span 3' },
  mainChart: { gridColumn: 'span 9' },
  loading: { padding: '5rem', textAlign: 'center', color: '#ff1801', fontWeight: '900', letterSpacing: '0.5em', textTransform: 'uppercase' },
  error: { padding: '2rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '1rem', textAlign: 'center', fontWeight: 'bold' },
  emptyState: { padding: '10rem', textAlign: 'center', color: '#333', fontWeight: '900', border: '1px solid #111', borderRadius: '2rem', letterSpacing: '0.1em', textTransform: 'uppercase' }
};

export default LapTimeController;