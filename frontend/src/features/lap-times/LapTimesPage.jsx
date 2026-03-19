import React from "react";
import LapTimeController from "./LapTimeController";

const LapTimesPage = ({ year, gp, selectedDrivers, onSelectionChange }) => {
  return (
    <LapTimeController
      year={year}
      gp={gp}
      selectedDrivers={selectedDrivers}
      onSelectionChange={onSelectionChange}
      visibleSections={["lap-times", "gaps"]}
    />
  );
};

export default LapTimesPage;
