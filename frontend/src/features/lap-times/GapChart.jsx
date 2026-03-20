import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getDriverColor } from "../../theme/f1Colors";

const GapChart = ({ data, selectedDrivers }) => {
  if (!selectedDrivers?.length) {
    return (
      <div style={styles.container}>
        <h3 style={styles.chartTitle}>Interval Gaps (Seconds)</h3>
        <div style={styles.emptyState}>
          Select at least one driver to plot gaps.
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h3 style={styles.chartTitle}>
        Interval Gaps vs {selectedDrivers[0]} (Seconds)
      </h3>
      <div style={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              {selectedDrivers.map((code) => (
                <linearGradient
                  key={`grad_${code}`}
                  id={`grad_${code}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={getDriverColor(code)}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="95%"
                    stopColor={getDriverColor(code)}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a1a1a"
              vertical={false}
            />
            <XAxis
              dataKey="lap"
              stroke="#444"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#444"
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={styles.tooltip}
              itemStyle={styles.tooltipItem}
              cursor={{ stroke: "#333", strokeWidth: 1 }}
            />
            {selectedDrivers.map((code) => (
              <Area
                key={code}
                type="stepAfter"
                dataKey={`${code}_gap`}
                stroke={getDriverColor(code)}
                fill={`url(#grad_${code})`}
                strokeWidth={2}
                connectNulls
                animationDuration={1500}
              />
            ))}
          </AreaChart>
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
  chartTitle: {
    fontSize: "0.65rem",
    fontWeight: "900",
    color: "#555",
    textTransform: "uppercase",
    letterSpacing: "0.2em",
    marginBottom: "1.5rem",
  },
  chartWrapper: {
    height: "250px",
    width: "100%",
  },
  tooltip: {
    backgroundColor: "#000",
    border: "1px solid #222",
    borderRadius: "12px",
    padding: "10px",
  },
  tooltipItem: {
    fontSize: "12px",
    fontWeight: "900",
  },
  emptyState: {
    minHeight: "180px",
    border: "1px dashed #222",
    borderRadius: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
    fontSize: "0.85rem",
    fontWeight: "700",
  },
};

export default GapChart;
