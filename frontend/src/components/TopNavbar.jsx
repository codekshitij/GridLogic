import React from "react";
import { NavLink } from "react-router-dom";

const navLinks = [
  { to: "/lap-times", label: "Live Timing" },
  { to: "/race-control", label: "Calendar" },
  { to: "/strategy", label: "Drivers" },
  { to: "/technical", label: "Teams" },
];

const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];


const styles = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: "rgba(10,10,15,0.40)",
    backdropFilter: "blur(16px)",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    width: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    padding: "20px 40px",
    boxSizing: "border-box",
  },
  brandNav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "4rem",
    minWidth: 0,
  },
  brand: {
    fontSize: "2.2rem",
    fontWeight: 900,
    letterSpacing: "-0.04em",
    color: "#fff",
    fontStyle: "italic",
    cursor: "pointer",
    transition: "color 0.2s",
    userSelect: "none",
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },
  brandDot: {
    color: "#e10600",
    marginLeft: 2,
    fontWeight: 900,
    fontSize: "1.5rem",
  },
  nav: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "2rem",
  },
  navLink: (isActive) => ({
    position: "relative",
    fontFamily: "sans-serif",
    textTransform: "uppercase",
    letterSpacing: "0.18em",
    fontSize: "1rem",
    fontWeight: 700,
    padding: "0.5rem 0",
    color: isActive ? "#e10600" : "rgba(255,255,255,0.5)",
    transition: "color 0.2s, font-size 0.2s",
    background: "none",
    border: "none",
    outline: "none",
    cursor: "pointer",
    marginRight: "0.5rem",
    textDecoration: "none",
  }),
  navUnderline: (isActive) => ({
    position: "absolute",
    left: 0,
    bottom: -2,
    height: 2,
    background: "#e10600",
    boxShadow: "0 0 12px #e10600",
    width: isActive ? "100%" : 0,
    opacity: isActive ? 1 : 0,
    transition: "width 0.3s, opacity 0.3s",
  }),
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "1.2rem",
    background: "rgba(30,30,40,0.55)",
    boxShadow: "0 2px 16px 0 rgba(0,0,0,0.18)",
    padding: "0.5rem 1.2rem",
    borderRadius: "1.5rem",
    border: "1.5px solid rgba(255,255,255,0.13)",
    backdropFilter: "blur(8px)",
    minWidth: 220,
    marginLeft: 16,
  },
  controlGroup: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    padding: "0 1.1rem 0 0",
    borderRight: "1.5px solid rgba(255,255,255,0.10)",
    height: 36,
  },
  controlGroupLast: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    padding: "0 0 0 1.1rem",
    height: 36,
  },
  controlLabel: {
    fontSize: "0.7rem",
    color: "#e10600",
    textTransform: "uppercase",
    fontWeight: 900,
    letterSpacing: "0.13em",
    marginRight: 2,
    opacity: 0.85,
    textShadow: "0 1px 4px #000a",
  },
  select: {
    background: "rgba(19,19,27,0.95)",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.97rem",
    outline: "none",
    border: "1.5px solid #23232e",
    borderRadius: "0.7rem",
    cursor: "pointer",
    appearance: "none",
    maxWidth: 140,
    minWidth: 70,
    textOverflow: "ellipsis",
    padding: "0.35rem 0.7rem",
    boxShadow: "0 1px 6px 0 #0004",
    marginLeft: 2,
    marginRight: 2,
    transition: "border 0.2s, box-shadow 0.2s",
  },
  option: {
    background: "#13131b",
    color: "#fff",
    fontWeight: 700,
    fontSize: "0.97rem",
  },
};

const TopNavbar = ({ selectedYear, onYearChange, selectedGP, onGPChange, availableGPs = [] }) => {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* Brand + Nav */}
        <div style={styles.brandNav}>
          <span style={styles.brand}>
            KIDŌ<span style={styles.brandDot}>.</span>
          </span>
          <nav style={styles.nav}>
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => styles.navLink(isActive)}
              >
                {({ isActive }) => (
                  <>
                    {item.label}
                    <span style={styles.navUnderline(isActive)} />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
        {/* Dynamic Controls */}
        <div style={styles.controls}>
          <div style={styles.controlGroup}>
            <span style={styles.controlLabel}>Year</span>
            <select
              value={selectedYear ?? ""}
              onChange={(e) => onYearChange(Number(e.target.value))}
              style={styles.select}
            >
              {years.map((y) => <option key={y} value={y} style={styles.option}>{y}</option>)}
            </select>
          </div>
          <div style={styles.controlGroupLast}>
            <span style={styles.controlLabel}>GP</span>
            <select
              value={selectedGP ?? ""}
              onChange={(e) => onGPChange(e.target.value)}
              style={styles.select}
            >
              {availableGPs.map((gp) => <option key={gp} value={gp} style={styles.option}>{gp}</option>)}
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopNavbar;