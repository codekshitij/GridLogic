import React, { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import TopNavbar from "./components/TopNavbar";
import LapTimesPage from "./features/lap-times/LapTimesPage";
import RaceControlPage from "./features/race-control/RaceControlPage";
import StrategyPage from "./features/strategy/StrategyPage";
import TechnicalPage from "./features/technical/TechnicalPage";

import { useEffect } from "react";
import axios from "axios";

function App() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [gp, setGp] = useState(null);
  const [availableGPs, setAvailableGPs] = useState([]);
  const [selectedDrivers, setSelectedDrivers] = useState([]);

  useEffect(() => {
    // Fetch races for the selected year from your backend
    const fetchRaces = async () => {
      try {
        const { data } = await axios.get(`http://127.0.0.1:8000/races/${year}`);
        setAvailableGPs(data.events);
        // Auto-select the first race if the current selection isn't in the new list
        if (!data.events.includes(gp)) {
          setGp(data.events[0]);
        }
      } catch (err) {
        setAvailableGPs([]);
        setGp(null);
        console.error("Failed to fetch schedule", err);
      }
    };
    fetchRaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year]);

  const handleDriverToggle = (driverCode) => {
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
      <TopNavbar
        selectedYear={year}
        onYearChange={(newYear) => {
          setYear(newYear);
          setSelectedDrivers([]);
        }}
        selectedGP={gp}
        onGPChange={(newGp) => {
          setGp(newGp);
          setSelectedDrivers([]);
        }}
        availableGPs={availableGPs}
      />
      <main className="max-w-[1600px] mx-auto p-8 pt-32">
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
  );
}

const styles = {
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
