import React from "react";
import LapTimeController from "../lap-times/LapTimeController";

const StrategyPage = ({ year, gp, selectedDrivers, onSelectionChange }) => {
  return (
    <LapTimeController
      year={year}
      gp={gp}
      selectedDrivers={selectedDrivers}
      onSelectionChange={onSelectionChange}
      visibleSections={["strategy", "pit-fuel"]}
    />
  );
};

export default StrategyPage;
