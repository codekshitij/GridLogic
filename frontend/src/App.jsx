import React, { useState } from "react";
import RaceSelector from "./components/RaceSelector";
import LapTimeController from "./features/lap-times/LapTimeController";

function App() {
  // 1. Initialize as null/empty to allow user to drive the selection
  const [year, setYear] = useState(new Date().getFullYear()); // Defaults to current year
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

  return (
    <div className="min-h-screen bg-[#050505] text-white">
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

      <main className="max-w-[1600px] mx-auto p-8">
        {/* 2. Guard: Only show the analysis if a GP has been selected */}
        {!gp ? (
          <div style={styles.emptyState}>
            SELECT A SEASON AND GRAND PRIX TO BEGIN ANALYSIS
          </div>
        ) : (
          <LapTimeController
            year={year}
            gp={gp}
            selectedDrivers={selectedDrivers}
            onSelectionChange={handleDriverToggle}
          />
        )}
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
