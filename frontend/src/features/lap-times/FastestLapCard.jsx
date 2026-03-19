import React from "react";

const FastestLapCard = ({ driver, time, lap, label = "FASTEST LAP" }) => {
  return (
    <div style={styles.card}>
      <div style={styles.glowOverlay} />
      <div style={styles.headerContainer}>
        <p style={styles.label}>{label}</p>
        <span style={styles.badge}>PURPLE SECTOR</span>
      </div>
      <div style={styles.content}>
        <h2 style={styles.timeText}>{time}s</h2>
        <span style={styles.driverText}>{driver}</span>
      </div>
      <p style={styles.footerText}>SET ON LAP {lap}</p>
    </div>
  );
};

const styles = {
  card: {
    background: "linear-gradient(145deg, #111 0%, #050505 100%)",
    border: "1px solid rgba(168, 85, 247, 0.2)", // Purple border
    padding: "1.5rem",
    borderRadius: "1.5rem",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 10px 30px -10px rgba(0,0,0,0.7)",
  },
  glowOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100px",
    height: "100px",
    background:
      "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)",
  },
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  label: {
    fontSize: "0.65rem",
    fontWeight: "900",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  },
  badge: {
    fontSize: "0.6rem",
    fontWeight: "900",
    color: "#a855f7",
    background: "rgba(168, 85, 247, 0.1)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  content: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
  },
  timeText: {
    fontSize: "2.25rem",
    fontWeight: "900",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: "-0.05em",
  },
  driverText: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#a855f7",
  },
  footerText: {
    fontSize: "0.6rem",
    color: "#444",
    fontWeight: "700",
    marginTop: "0.5rem",
  },
};

export default FastestLapCard;
