import React, { useMemo } from "react";
import { useRaceMeta, useRaceAnalytics } from "../../hooks/useRaceData";
import DriverPanel from "../../components/DriverPanel";
import PaceChart from "./PaceChart";
import GapChart from "./GapChart";
import FastestLapCard from "../../components/FastestLapCard";
import { useWorkerizedData } from "./useWorkerizedData";

const LapTimeController = ({
  year,
  gp,
  selectedDrivers,
  onSelectionChange,
}) => {
  const meta = useRaceMeta(year, gp);
  const analytics = useRaceAnalytics(year, gp);


  const allDrivers = useMemo(() => meta.data?.drivers || [], [meta.data]);
  const driversToShow = selectedDrivers.length ? selectedDrivers : allDrivers.slice(0, 2).map((d) => d.code);

  // Use web worker for gap data transformation
  const gapSeries = useWorkerizedData(
    new URL("./gap.worker.js", import.meta.url),
    {
      gapData: analytics.data?.gaps_and_intervals,
      selectedDrivers: driversToShow,
    },
    [analytics.data, driversToShow]
  ) || [];

  // Use web worker for pace chart data transformation (per-lap mode)
  const paceChartData = useWorkerizedData(
    new URL("./pace.worker.js", import.meta.url),
    {
      paceData: analytics.data?.lap_times_and_splits?.drivers,
      selectedDrivers: driversToShow,
      mode: "per-lap",
    },
    [analytics.data, driversToShow]
  )?.chartData || [];
  // Fastest lap info
  const globalFastest = analytics.data?.lap_times_and_splits?.global_fastest;


  if (meta.isLoading || analytics.isLoading) {
    return <div style={styles.loading}>SYNCING_RACE_METRICS...</div>;
  }
  if (meta.error)
    return <div style={styles.error}>CONNECTION_LOST: {meta.error.message}</div>;
  if (analytics.error)
    return <div style={styles.error}>ANALYTICS_ERROR: {analytics.error.message}</div>;

  return (
    <div style={styles.container}>
      <DriverPanel
        allDrivers={allDrivers}
        selectedDrivers={selectedDrivers}
        onToggle={onSelectionChange}
        onClear={() => onSelectionChange([])}
      />

      {/* Fastest Lap Card */}
      {globalFastest && (
        <div style={{ marginBottom: "1.5rem", maxWidth: 320 }}>
          <FastestLapCard
            driver={globalFastest.driver}
            time={globalFastest.lap_time_s}
            lap={globalFastest.lap}
          />
        </div>
      )}

      {/* Pace Chart */}
      <div style={{ marginBottom: "2rem" }}>
        <PaceChart data={paceChartData} selectedDrivers={driversToShow} />
      </div>

      {/* Gap Chart */}
      <div style={{ marginBottom: "2rem" }}>
        <GapChart data={gapSeries} selectedDrivers={driversToShow} />
      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", gap: "2rem" },
  loading: {
    padding: "5rem",
    textAlign: "center",
    color: "#ff1801",
    fontWeight: "900",
    letterSpacing: "0.5em",
    textTransform: "uppercase",
  },
  error: {
    padding: "2rem",
    color: "#ef4444",
    background: "rgba(239, 68, 68, 0.1)",
    borderRadius: "1rem",
    textAlign: "center",
    fontWeight: "bold",
  },
  emptyState: {
    padding: "10rem",
    textAlign: "center",
    color: "#333",
    fontWeight: "900",
    border: "1px solid #111",
    borderRadius: "2rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
};

export default LapTimeController;

