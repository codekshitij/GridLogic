import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { getDriverColor } from "../../theme/f1Colors";

const PaceChart = ({ data, selectedDrivers }) => {
  // Performance check for M3 Pro: Disable heavy animations if many drivers are selected


  // Custom X-axis ticks:
  // - Laps 2-10: increment by 2
  // - Laps 12-30: increment by 4
  // - Laps 32-end: increment by 2
  const allLaps = data.map((d) => d.lap).filter((lap) => typeof lap === "number");
  const maxLap = Math.max(...allLaps, 0);
  let lapTicks = [];
  for (let i = 2; i <= 10 && i <= maxLap; i += 2) lapTicks.push(i);
  for (let i = 12; i <= 30 && i <= maxLap; i += 4) lapTicks.push(i);
  for (let i = 32; i <= maxLap; i += 2) lapTicks.push(i);

  // Find min/max lap times for all visible drivers and laps
  let minLapTime = Infinity;
  let maxLapTime = -Infinity;
  data.forEach((d) => {
    lapTicks.forEach((lap) => {
      if (d.lap === lap) {
        selectedDrivers.forEach((driver) => {
          const code = typeof driver === "object" ? driver.code : driver;
          const t = d[`${code}_time`];
          if (typeof t === "number" && !isNaN(t)) {
            if (t < minLapTime) minLapTime = t;
            if (t > maxLapTime) maxLapTime = t;
          }
        });
      }
    });
  });
  if (!isFinite(minLapTime)) minLapTime = 0;
  if (!isFinite(maxLapTime)) maxLapTime = 1;
  const yDomain = [minLapTime - 1, maxLapTime + 1];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.chartTitle}>Lap-by-Lap Pace Chart</h3>
        {selectedDrivers.length > 5 && (
          <span style={styles.perfBadge}>High Density Mode</span>
        )}
      </div>

      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 30, right: 30, left: 10, bottom: 40 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#222"
              vertical={false}
            />
            <XAxis
              dataKey="lap"
              stroke="#bbb"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              interval={0}
              ticks={lapTicks}
              tick={{ angle: 0, textAnchor: "middle", dy: 10 }}
              label={{ value: "Lap number", position: "insideBottom", offset: -10, fill: "#bbb", fontSize: 15 }}
            />
            <YAxis
              domain={yDomain}
              stroke="#bbb"
              fontSize={13}
              tickLine={false}
              axisLine={false}
              tickFormatter={(_val) => {
                // Use the first driver's formatted string for the tick if available
                if (!data.length || !selectedDrivers.length) return "";
                const code = typeof selectedDrivers[0] === "object" ? selectedDrivers[0].code : selectedDrivers[0];
                // Find the closest data point for this tick value
                let closest = data.reduce((prev, curr) => {
                  const t = curr[`${code}_time`];
                  if (typeof t !== "number" || isNaN(t)) return prev;
                  if (Math.abs(t - _val) < Math.abs((prev[`${code}_time`] ?? 0) - _val)) return curr;
                  return prev;
                }, {});
                return closest[`${code}_time_str`] || "";
              }}
              label={{ value: "Lap time", angle: -90, position: "insideLeft", fill: "#bbb", fontSize: 15 }}
            />
            <Tooltip
              contentStyle={styles.tooltip}
              itemStyle={styles.tooltipItem}
              cursor={{ stroke: "#333", strokeWidth: 0.7 }}
              formatter={(value, name, props) => {
                // Use the formatted string if available
                const code = name.replace('_time', '');
                const formatted = props.payload[`${code}_time_str`];
                return [formatted || value, "Lap time"];
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{
                fontSize: "13px",
                fontWeight: "900",
                paddingBottom: "20px",
              }}
            />
            {selectedDrivers.map((driver) => {
              const code = typeof driver === "object" ? driver.code : driver;
              // Custom dot: only show for laps in lapTicks
              const customDot = (props) => {
                const { cx, cy, payload } = props;
                if (!lapTicks.includes(payload.lap)) return null;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3}
                    stroke="#fff"
                    strokeWidth={2}
                    fill="#fff"
                  />
                );
              };
              return (
                <Line
                  key={code}
                  type="monotone"
                  dataKey={`${code}_time`}
                  stroke={getDriverColor(code)}
                  strokeWidth={1}
                  dot={customDot}
                  connectNulls
                  animationDuration={1200}
                />
              );
            })}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const styles = {
  container: {
    background: "#0a0a0a",
    border: "1px solid rgba(255,255,255,0.05)",
    padding: "1.5rem",
    borderRadius: "1.5rem",
    boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1.5rem",
  },
  chartTitle: {
    fontSize: "0.65rem",
    fontWeight: "900",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
  },
  perfBadge: {
    fontSize: "0.5rem",
    background: "#111",
    color: "#444",
    padding: "2px 6px",
    borderRadius: "4px",
    fontWeight: "900",
    border: "1px solid #222",
  },
  chartWrapper: {
    height: "600px", // Increased height for better visibility
    width: "100%",
    background: "#181818",
    borderRadius: "1.2rem",
    boxShadow: "0 8px 32px 0 rgba(0,0,0,0.25)",
    padding: "1rem",
  },
  tooltip: {
    backgroundColor: "#000",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "12px",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  },
  tooltipItem: {
    fontSize: "11px",
    fontWeight: "900",
    textTransform: "uppercase",
  },
};

export default PaceChart;
