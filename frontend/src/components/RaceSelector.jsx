import React, { useEffect, useState } from "react";
import axios from "axios";

const RaceSelector = ({
  selectedYear,
  onYearChange,
  selectedGP,
  onGPChange,
}) => {
  const [availableGPs, setAvailableGPs] = useState([]);
  const years = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];

  useEffect(() => {
    // Fetch races for the selected year from your backend
    const fetchRaces = async () => {
      try {
        const { data } = await axios.get(
          `http://127.0.0.1:8000/races/${selectedYear}`,
        );
        setAvailableGPs(data.events);

        // Auto-select the first race if the current selection isn't in the new list
        if (!data.events.includes(selectedGP)) {
          onGPChange(data.events[0]);
        }
      } catch (err) {
        console.error("Failed to fetch schedule", err);
      }
    };
    fetchRaces();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  return (
    <nav className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
      <div className="max-w-[1600px] mx-auto flex justify-between items-center">
        <div className="font-black italic text-xl tracking-tighter">KIDŌ</div>

        <div className="flex gap-4">
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-[#111] text-xs font-bold p-2 rounded border border-white/10"
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={selectedGP}
            onChange={(e) => onGPChange(e.target.value)}
            className="bg-[#111] text-xs font-bold p-2 rounded border border-white/10"
          >
            {availableGPs.map((gp) => (
              <option key={gp} value={gp}>
                {gp}
              </option>
            ))}
          </select>
        </div>
      </div>
    </nav>
  );
};

export default RaceSelector;
