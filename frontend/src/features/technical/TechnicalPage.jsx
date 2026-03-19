import React from "react";
import LapTimeController from "../lap-times/LapTimeController";

const TechnicalPage = ({ year, gp, selectedDrivers, onSelectionChange }) => {
  return (
    <LapTimeController
      year={year}
      gp={gp}
      selectedDrivers={selectedDrivers}
      onSelectionChange={onSelectionChange}
      visibleSections={["comparisons", "weather", "setup"]}
    />
  );
};

export default TechnicalPage;
