export const teamColors = {
  MER: "#27F4D2", // Mercedes
  RBR: "#3671C6", // Red Bull
  FER: "#E8002D", // Ferrari
  MCL: "#ff8000", // McLaren
  AST: "#229971", // Aston Martin
  ALP: "#00A1E8", // Alpine
  AUD: "#FF2D00", // Audi (Replaced Sauber)
  WIL: "#1868DB", // Williams
  HAA: "#DEE1E2", // Haas
  RAB: "#6692FF", // Racing Bulls (VCARB)
  CAD: "#AAAAAD", // Cadillac (If applicable)
};

// Mapping drivers to their respective teams for color lookup
const driverToTeam = {
  VER: "RBR",
  HAD: "RBR",
  NOR: "MCL",
  PIA: "MCL",
  HAM: "FER",
  LEC: "FER",
  RUS: "MER",
  ANT: "MER",
  SAI: "WIL",
  ALB: "WIL",
  ALO: "AST",
  STR: "AST",
  GAS: "ALP",
  COL: "ALP",
  OCO: "HAA",
  BEA: "HAA",
  LAW: "RAB",
  LIN: "RAB",
  // Add 2024 drivers if testing old data
  PER: "RBR",
  TSU: "RAB",
  RIC: "RAB",
};

export const getDriverColor = (driverCode) => {
  const teamCode = driverToTeam[driverCode?.toUpperCase()];
  return teamColors[teamCode] || "#FFFFFF"; // Default to white if not found
};
