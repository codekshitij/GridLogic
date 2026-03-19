import React from "react";

const TopNavbar = () => {
  return (
    <header style={styles.header}>
      <div style={styles.inner}>
        <div style={styles.brandBlock}>
          <h1 style={styles.brand}>GridLogic</h1>
          <p style={styles.subtitle}>F1 Analytics Workspace</p>
        </div>
      </div>
    </header>
  );
};

const styles = {
  header: {
    borderBottom: "1px solid #101010",
    background: "#050505",
  },
  inner: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "1rem 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  brandBlock: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
  },
  brand: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 900,
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  subtitle: {
    margin: 0,
    color: "#8a8a8a",
    fontSize: "0.74rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontWeight: 700,
  },
};

export default TopNavbar;