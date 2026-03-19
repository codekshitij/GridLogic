import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import PageSidebar from "./components/PageSidebar";
import RaceSelector from "./components/RaceSelector";
import LapTimesPage from "./features/lap-times/LapTimesPage";
import RaceControlPage from "./features/race-control/RaceControlPage";
import StrategyPage from "./features/strategy/StrategyPage";
import TechnicalPage from "./features/technical/TechnicalPage";

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [gp, setGp] = useState(null);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  const handleDriverToggle = (driverCode) => {
    // If driverCode is an empty array (from a "Clear All" button), reset the state
    if (Array.isArray(driverCode) && driverCode.length === 0) {
      setSelectedDrivers([]);
      return;
    }

    const code = typeof driverCode === "object" ? driverCode.code : driverCode;
    setSelectedDrivers((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code],
    );
  };

  const renderPage = (page) => {
    if (!gp) {
      return (
        <div style={styles.emptyState}>
          SELECT A SEASON AND GRAND PRIX TO BEGIN ANALYSIS
        </div>
      );
    }

    return page;
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <TopNavbar />

      <RaceSelector
        selectedYear={year}
        onYearChange={(newYear) => {
          setYear(newYear);
          setGp(null); // Reset GP when year changes
          setSelectedDrivers([]);
        }}
        selectedGP={gp}
        onGPChange={(newGp) => {
          setGp(newGp);
          setSelectedDrivers([]);
        }}
      />

      <div style={styles.layout}>
        <div style={styles.sidebarCol}>
          <PageSidebar />
        </div>

        <main style={styles.contentCol}>
          <Routes>
            <Route path="/" element={<Navigate to="/lap-times" replace />} />
            <Route
              path="/lap-times"
              element={renderPage(
                <LapTimesPage
                  year={year}
                  gp={gp}
                  selectedDrivers={selectedDrivers}
                  onSelectionChange={handleDriverToggle}
                />,
              )}
            />
            <Route
              path="/race-control"
              element={renderPage(<RaceControlPage year={year} gp={gp} />)}
            />
            <Route
              path="/strategy"
              element={renderPage(
                <StrategyPage
                  year={year}
                  gp={gp}
                  selectedDrivers={selectedDrivers}
                  onSelectionChange={handleDriverToggle}
                />,
              )}
            />
            <Route
              path="/technical"
              element={renderPage(
                <TechnicalPage
                  year={year}
                  gp={gp}
                  selectedDrivers={selectedDrivers}
                  onSelectionChange={handleDriverToggle}
                />,
              )}
            />
            <Route path="*" element={<Navigate to="/lap-times" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

const styles = {
  layout: {
    maxWidth: "1600px",
    margin: "0 auto",
    padding: "1rem 2rem 2rem",
    display: "grid",
    gridTemplateColumns: "230px 1fr",
    gap: "1rem",
    alignItems: "start",
  },
  sidebarCol: {
    minWidth: 0,
  },
  contentCol: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  emptyState: {
    padding: "15rem",
    textAlign: "center",
    color: "#222",
    fontWeight: "900",
    border: "2px dashed #111",
    borderRadius: "2rem",
    letterSpacing: "0.2em",
    textTransform: "uppercase",
  },
};

export default App;
