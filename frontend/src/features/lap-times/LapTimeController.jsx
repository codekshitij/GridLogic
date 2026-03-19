import React, { useMemo } from "react";
import { useRaceMeta, useRaceAnalytics } from "../../hooks/useRaceData";
import DriverPanel from "../../components/DriverPanel";
import RaceAnalyticsDashboard from "./RaceAnalyticsDashboard";

const LapTimeController = ({
  year,
  gp,
  selectedDrivers,
  onSelectionChange,
}) => {
  const meta = useRaceMeta(year, gp);
  const analytics = useRaceAnalytics(year, gp);

  const allDrivers = useMemo(() => {
    return meta.data?.drivers || [];
  }, [meta.data]);

  if (meta.isLoading || analytics.isLoading) {
    return <div style={styles.loading}>SYNCING_RACE_METRICS...</div>;
  }

  if (meta.error)
    return (
      <div style={styles.error}>CONNECTION_LOST: {meta.error.message}</div>
    );
  if (analytics.error)
    return (
      <div style={styles.error}>ANALYTICS_ERROR: {analytics.error.message}</div>
    );

  return (
    <div style={styles.container}>
      <DriverPanel
        allDrivers={allDrivers}
        selectedDrivers={selectedDrivers}
        onToggle={onSelectionChange}
        onClear={() => onSelectionChange([])}
      />

      {analytics.data ? (
        <RaceAnalyticsDashboard
          analytics={analytics.data}
          selectedDrivers={selectedDrivers}
          allDrivers={allDrivers}
        />
      ) : (
        <div style={styles.emptyState}>NO ANALYTICS DATA AVAILABLE</div>
      )}
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

