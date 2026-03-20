import React from "react";
import { useRaceAnalytics } from "../../hooks/useRaceData";
import RaceAnalyticsDashboard from "../lap-times/RaceAnalyticsDashboard";

const RaceControlPage = ({ year, gp }) => {
  const analytics = useRaceAnalytics(year, gp);

  if (analytics.isLoading) {
    return <div style={styles.loading}>LOADING_RACE_CONTROL...</div>;
  }

  if (analytics.error) {
    return (
      <div style={styles.error}>
        RACE_CONTROL_ERROR: {analytics.error.message}
      </div>
    );
  }

  return (
    <RaceAnalyticsDashboard
      analytics={analytics.data}
      selectedDrivers={[]}
      allDrivers={[]}
      visibleSections={["race-control"]}
    />
  );
};

const styles = {
  loading: {
    padding: "5rem",
    textAlign: "center",
    color: "#ff1801",
    fontWeight: "900",
    letterSpacing: "0.3em",
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
};

export default RaceControlPage;
