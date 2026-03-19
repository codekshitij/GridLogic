self.onmessage = (e) => {
  const { gapData, selectedDrivers } = e.data;
  if (!gapData || !selectedDrivers || !selectedDrivers.length) {
    self.postMessage([]);
    return;
  }

  const byLap = gapData.by_lap || {};
  const laps = Object.keys(byLap)
    .map(Number)
    .sort((a, b) => a - b);

  const gapSeries = laps.map((lapNo) => {
    const row = { lap: lapNo };
    const cars = byLap[lapNo]?.cars || [];
    selectedDrivers.forEach((driver) => {
      const found = cars.find((c) => c.driver === driver);
      row[`${driver}_gap`] = found?.gap_to_leader_s ?? null;
    });
    return row;
  });

  self.postMessage(gapSeries);
};
