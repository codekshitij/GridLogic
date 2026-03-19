self.onmessage = (e) => {
  const { paceData, selectedDrivers, bucketSize = 5 } = e.data;
  if (!paceData || !selectedDrivers.length) return;

  const chartData = [];
  const totalLaps = paceData[selectedDrivers[0]]?.length || 0;
  let fastest = null;

  // Loop through laps in increments of 5
  for (let i = 0; i < totalLaps; i += bucketSize) {
    const bucketLabel = `Laps ${i + 1}-${Math.min(i + bucketSize, totalLaps)}`;
    const lapEntry = { lap: bucketLabel, lapSort: i }; // lapSort helps Recharts keep order

    selectedDrivers.forEach((code) => {
      const driverLaps = paceData[code];
      if (!driverLaps) return;

      driverLaps.forEach((lap) => {
        if (typeof lap?.t !== "number") return;
        if (!fastest || lap.t < fastest.Time) {
          fastest = {
            Driver: code,
            Time: lap.t,
            Lap: Number.isFinite(lap.l) ? lap.l : 0,
          };
        }
      });

      // Get the 5-lap window
      const slice = driverLaps.slice(i, i + bucketSize);
      const sum = slice.reduce((acc, curr) => acc + curr.t, 0);

      // Calculate average for this bucket
      if (slice.length > 0) {
        lapEntry[`${code}_time`] = parseFloat((sum / slice.length).toFixed(3));
      }
    });

    chartData.push(lapEntry);
  }

  self.postMessage({ chartData, fastest });
};
