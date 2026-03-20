import React from "react";

const RaceWinnerCard = ({
  driver,
  fullName,
  team,
  number,
  label = "RACE WINNER",
}) => {
  return (
    <div style={styles.card}>
      <div style={styles.glowOverlay} />
      <div style={styles.headerContainer}>
        <p style={styles.label}>{label}</p>
        <span style={styles.badge}>CHECKERED FLAG</span>
      </div>
      <div style={styles.content}>
        <h2 style={styles.driverText}>{driver}</h2>
        <span style={styles.numberText}>#{number}</span>
      </div>
      <p style={styles.footerText}>
        {fullName} · {team}
      </p>
    </div>
  );
};

const styles = {
  card: {
    background: "linear-gradient(145deg, #111 0%, #050505 100%)",
    border: "1px solid rgba(255, 24, 1, 0.2)",
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
      "radial-gradient(circle, rgba(255, 24, 1, 0.2) 0%, transparent 70%)",
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
    color: "#ff1801",
    background: "rgba(255, 24, 1, 0.12)",
    padding: "2px 8px",
    borderRadius: "4px",
  },
  content: {
    display: "flex",
    alignItems: "baseline",
    gap: "0.75rem",
  },
  driverText: {
    fontSize: "2.25rem",
    fontWeight: "900",
    fontStyle: "italic",
    color: "#fff",
    letterSpacing: "-0.05em",
  },
  numberText: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#ff1801",
  },
  footerText: {
    fontSize: "0.7rem",
    color: "#8a8a8a",
    fontWeight: "700",
    marginTop: "0.5rem",
  },
};

export default RaceWinnerCard;
