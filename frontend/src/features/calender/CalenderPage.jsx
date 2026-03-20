import React from "react";
import { useRaceCalendar } from "../../hooks/useRaceData";

const formatUtc = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toISOString().replace("T", " ").replace(".000Z", " UTC");
};

const CalenderPage = ({ year }) => {
  const calendar = useRaceCalendar(year);

  if (calendar.isLoading) {
    return <div style={styles.loading}>LOADING_CALENDER...</div>;
  }

  if (calendar.error) {
    return (
      <div style={styles.error}>CALENDER_ERROR: {calendar.error.message}</div>
    );
  }

  const events = calendar.data?.events || [];

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h2 style={styles.title}>{year} Race Calender</h2>
        <span style={styles.countBadge}>{events.length} races</span>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Rnd</th>
              <th style={styles.th}>Grand Prix</th>
              <th style={styles.th}>Country</th>
              <th style={styles.th}>Location</th>
              <th style={styles.th}>Format</th>
              <th style={styles.th}>Race UTC</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={`${event.RoundNumber}-${event.EventName}`}>
                <td style={styles.td}>{event.RoundNumber}</td>
                <td style={styles.tdStrong}>{event.EventName}</td>
                <td style={styles.td}>{event.Country}</td>
                <td style={styles.td}>{event.Location}</td>
                <td style={styles.td}>{event.EventFormat}</td>
                <td style={styles.td}>{formatUtc(event.Session5DateUtc)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.05)",
    borderRadius: "1rem",
    padding: "1rem",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "0.8rem",
  },
  title: {
    fontSize: "0.95rem",
    fontWeight: "900",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#ddd",
  },
  countBadge: {
    fontSize: "0.75rem",
    color: "#aaa",
    border: "1px solid #2a2a2a",
    borderRadius: "999px",
    padding: "0.2rem 0.6rem",
    fontWeight: "700",
  },
  tableWrap: {
    overflow: "auto",
    border: "1px solid #1d1d1d",
    borderRadius: "0.75rem",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "880px",
  },
  th: {
    textAlign: "left",
    fontSize: "0.68rem",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    color: "#888",
    fontWeight: "800",
    padding: "0.65rem 0.75rem",
    borderBottom: "1px solid #1e1e1e",
    background: "#0c0c0c",
  },
  td: {
    fontSize: "0.82rem",
    color: "#cfcfcf",
    padding: "0.6rem 0.75rem",
    borderBottom: "1px solid #171717",
  },
  tdStrong: {
    fontSize: "0.82rem",
    color: "#fff",
    fontWeight: "700",
    padding: "0.6rem 0.75rem",
    borderBottom: "1px solid #171717",
  },
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

export default CalenderPage;
