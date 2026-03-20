self.onmessage = (e) => {
  // Helper to format seconds as min:sec.sss
  function formatLapTime(val) {
    if (typeof val !== "number" || isNaN(val)) return "";
    const min = Math.floor(val / 60);
    const sec = (val % 60).toFixed(3).padStart(6, "0");
    return `${min}:${sec}`;
  }

  const {
    paceData,
    selectedDrivers,
    mode = "per-lap",
    bucketSize = 5,
  } = e.data;
  if (!paceData || !selectedDrivers.length) return;

  let chartData = [];
  let fastest = null;
  const totalLaps = paceData[selectedDrivers[0]]?.length || 0;

  if (mode === "per-lap") {
    // Per-lap chart: one entry per lap, skip pit-in laps
    for (let i = 0; i < totalLaps; i++) {
      const lapEntry = { lap: i + 1 };
      let hasValid = false;
      selectedDrivers.forEach((code) => {
        const driverLaps = paceData[code];
        if (!driverLaps || !driverLaps[i]) return;
        const lap = driverLaps[i];
        if (lap.pit_in || lap.pit_out) return; // skip pit-in and pit-out laps
        if (typeof lap?.lap_time_s !== "number") return;
        lapEntry[`${code}_time`] = parseFloat(lap.lap_time_s.toFixed(3));
        lapEntry[`${code}_time_str`] = formatLapTime(lap.lap_time_s);
        hasValid = true;
        if (!fastest || lap.lap_time_s < fastest.Time) {
          fastest = {
            Driver: code,
            Time: lap.lap_time_s,
            Lap: Number.isFinite(lap.lap) ? lap.lap : 0,
          };
        }
      });
      if (hasValid) chartData.push(lapEntry);
    }
  } else {
    // 5-lap average mode (default fallback)
    for (let i = 0; i < totalLaps; i += bucketSize) {
      const bucketLabel = `Laps ${i + 1}-${Math.min(i + bucketSize, totalLaps)}`;
      const lapEntry = { lap: bucketLabel, lapSort: i };
      selectedDrivers.forEach((code) => {
        const driverLaps = paceData[code];
        if (!driverLaps) return;
        driverLaps.forEach((lap) => {
          if (typeof lap?.lap_time_s !== "number") return;
          if (!fastest || lap.lap_time_s < fastest.Time) {
            fastest = {
              Driver: code,
              Time: lap.lap_time_s,
              Lap: Number.isFinite(lap.lap) ? lap.lap : 0,
            };
          }
        });
        const slice = driverLaps.slice(i, i + bucketSize);
        const sum = slice.reduce((acc, curr) => acc + curr.lap_time_s, 0);
        if (slice.length > 0) {
          lapEntry[`${code}_time`] = parseFloat(
            (sum / slice.length).toFixed(3),
          );
        }
      });
      chartData.push(lapEntry);
    }
  }
  self.postMessage({ chartData, fastest });
};
