import React from "react";
import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/lap-times", label: "Lap Times" },
  { to: "/race-control", label: "Race Control" },
  { to: "/strategy", label: "Strategy" },
  { to: "/technical", label: "Technical" },
];

const PageSidebar = () => {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.sidebarTitle}>Pages</div>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

const styles = {
  sidebar: {
    border: "1px solid #111",
    borderRadius: "1rem",
    background: "#0a0a0a",
    padding: "1rem",
    position: "sticky",
    top: "1rem",
  },
  sidebarTitle: {
    fontSize: "0.72rem",
    color: "#7a7a7a",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontWeight: 800,
    marginBottom: "0.75rem",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
  },
  link: {
    border: "1px solid #1e1e1e",
    borderRadius: "0.65rem",
    textDecoration: "none",
    color: "#b4b4b4",
    background: "#0f0f0f",
    padding: "0.6rem 0.75rem",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    fontWeight: 700,
  },
  linkActive: {
    borderColor: "#ff1801",
    color: "#fff",
    background: "#171717",
  },
};

export default PageSidebar;