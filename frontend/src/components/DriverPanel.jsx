import React from "react";

const DriverPanel = ({ allDrivers, selectedDrivers, onToggle, onClear }) => {
  return (
    <div style={styles.panelContainer}>
      <div style={styles.header}>
        <h3 style={styles.title}>Driver Selection</h3>
        <button onClick={onClear} style={styles.resetBtn}>
          RESET GRID
        </button>
      </div>

      <div style={styles.grid}>
        {allDrivers.map((driver) => {
          // 1. Identify if active and get their team color
          const code = typeof driver === "object" ? driver.code : driver;
          const isActive = selectedDrivers.includes(code);
          const teamColor = driver.color || "#444";

          return (
            <button
              key={code}
              onClick={() => onToggle(code)}
              style={{
                ...styles.driverButton,
                // 2. Dynamic Border & Glow
                borderColor: isActive ? teamColor : "rgba(255,255,255,0.05)",
                color: isActive ? "#fff" : "#444",
                boxShadow: isActive ? `0 0 15px ${teamColor}44` : "none",
                background: isActive ? `${teamColor}15` : "transparent",
              }}
            >
              <span style={styles.codeText}>{code}</span>
              {/* Optional: Add a small team-colored indicator bar */}
              {isActive && (
                <div style={{ ...styles.activeBar, background: teamColor }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  panelContainer: {
    background: "rgba(20,20,30,0.85)",
    border: "1.5px solid #23232e",
    boxShadow: "0 4px 32px 0 #000a, 0 0 0 1.5px #e1060033 inset",
    padding: "1.8rem 1.9rem 1.9rem 1.9rem",
    borderRadius: "2rem",
    backdropFilter: "blur(8px)",
    marginBottom: "2rem",
    marginTop: "1rem",
    minWidth: 320,
    maxWidth: 1600,
    marginLeft: "auto",
    marginRight: "auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  title: {
    fontSize: "1.25rem",
    fontWeight: 900,
    letterSpacing: "0.12em",
    color: "#fff",
    textTransform: "uppercase",
    textShadow: "0 2px 12px #e1060033, 0 1px 0 #000a",
    margin: 0,
  },
  resetBtn: {
    background: "linear-gradient(90deg, #e10600 60%, #ff8000 100%)",
    color: "#fff",
    border: "none",
    borderRadius: "0.7rem",
    fontWeight: 900,
    fontSize: "0.85rem",
    padding: "0.5rem 1.2rem",
    cursor: "pointer",
    letterSpacing: "0.08em",
    boxShadow: "0 2px 12px #e1060044",
    transition: "background 0.18s, box-shadow 0.18s, color 0.18s",
    outline: "none",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: "0.7rem",
    marginTop: "0.2rem",
    paddingBottom: "0.2rem",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "98vw",
    maxWidth: "1400px",
    minHeight: "40px",
    marginLeft: "calc(-1.2rem)",
  },
  driverButton: {
    position: "relative",
    minWidth: "60px",
    maxWidth: "85px",
    height: "32px",
    border: "2px solid",
    borderRadius: "0.5rem",
    cursor: "pointer",
    transition: "all 0.18s cubic-bezier(.4,2,.6,1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 900,
    fontSize: "0.85rem",
    background: "rgba(30,30,40,0.85)",
    boxShadow: "0 2px 10px 0 #0006, 0 0 0 2px #e1060011 inset",
    textTransform: "uppercase",
    letterSpacing: "0.09em",
    overflow: "hidden",
    outline: "none",
    marginRight: "0.2rem",
  },
  codeText: {
    zIndex: 2,
    fontWeight: 900,
    fontSize: "1.1rem",
    color: "inherit",
    textShadow: "0 2px 8px #000a, 0 1px 0 #fff2",
    letterSpacing: "0.09em",
    userSelect: "none",
  },
  activeBar: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    width: "60%",
    height: "3px",
    borderRadius: "0 0 0.4rem 0.4rem",
    boxShadow: "0 0 10px 2px #fff8, 0 0 8px 0 #e10600",
    opacity: 0.95,
    zIndex: 1,
    transition: "background 0.18s, box-shadow 0.18s",
  },
};

export default DriverPanel;
