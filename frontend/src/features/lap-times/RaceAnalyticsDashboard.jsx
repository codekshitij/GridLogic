import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

const sectionStyle = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "1rem",
  padding: "1rem",
};

const tinyLabel = {
  fontSize: "0.65rem",
  textTransform: "uppercase",
  letterSpacing: "0.1em",
  color: "#777",
  fontWeight: 800,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.75rem",
};

const cellStyle = {
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  textAlign: "left",
  padding: "0.45rem 0.35rem",
};

const sorters = {
  avg_lap_s: (a, b) => a.avg_lap_s - b.avg_lap_s,
  best_lap_s: (a, b) => a.best_lap_s - b.best_lap_s,
  consistency_std_s: (a, b) => a.consistency_std_s - b.consistency_std_s,
  overtakes_estimate: (a, b) => b.overtakes_estimate - a.overtakes_estimate,
};

const ALL_SECTIONS = [
  "lap-times",
  "gaps",
  "strategy",
  "pit-fuel",
  "comparisons",
  "weather",
  "race-control",
  "setup",
];

const RaceAnalyticsDashboard = ({
  analytics,
  selectedDrivers,
  allDrivers,
  visibleSections = ALL_SECTIONS,
}) => {
  const [sortBy, setSortBy] = useState("avg_lap_s");
  const visible = useMemo(() => new Set(visibleSections), [visibleSections]);

  const fallbackDrivers = useMemo(
    () => allDrivers?.slice(0, 2).map((d) => d.code) || [],
    [allDrivers],
  );

  const activeDrivers = selectedDrivers.length
    ? selectedDrivers
    : fallbackDrivers;

  const lapSeries = useMemo(() => {
    const byDriver = analytics?.lap_times_and_splits?.drivers || {};
    const lapSet = new Set();
    activeDrivers.forEach((driver) => {
      (byDriver[driver] || []).forEach((lap) => lapSet.add(lap.lap));
    });
    const laps = [...lapSet].sort((a, b) => a - b);

    return laps.map((lapNo) => {
      const row = { lap: lapNo };
      activeDrivers.forEach((driver) => {
        const found = (byDriver[driver] || []).find((x) => x.lap === lapNo);
        row[`${driver}_lap`] = found?.lap_time_s ?? null;
      });
      return row;
    });
  }, [analytics, activeDrivers]);

  const gapSeries = useMemo(() => {
    const byLap = analytics?.gaps_and_intervals?.by_lap || {};
    const laps = Object.keys(byLap)
      .map((x) => Number(x))
      .sort((a, b) => a - b);

    return laps.map((lapNo) => {
      const row = { lap: lapNo };
      const cars = byLap[lapNo]?.cars || [];
      activeDrivers.forEach((driver) => {
        const found = cars.find((c) => c.driver === driver);
        row[`${driver}_gap`] = found?.gap_to_leader_s ?? null;
      });
      return row;
    });
  }, [analytics, activeDrivers]);

  const compoundPace = analytics?.tire_usage_and_strategy?.compound_pace || [];
  const stintRows = analytics?.tire_usage_and_strategy?.stints || [];
  const pitRows = analytics?.pit_stop_analysis?.events || [];
  const pitStrategies = analytics?.pit_stop_analysis?.strategies || [];
  const pitTeamPerf = analytics?.pit_stop_analysis?.team_crew_performance || [];
  const fuelModel = analytics?.fuel_consumption?.model;
  const fuelDrivers = analytics?.fuel_consumption?.drivers || {};
  const weatherImpact = analytics?.weather_and_track?.lap_impact || [];
  const weatherSamples = analytics?.weather_and_track?.samples || [];
  const battles = analytics?.tire_usage_and_strategy?.pit_window_battles || [];
  const timeline = analytics?.replay?.timeline || [];
  const setupNotes = analytics?.setup?.notes || "No setup feed available.";

  const comparisonRows = useMemo(() => {
    const rows = [...(analytics?.driver_comparisons?.driver_metrics || [])];
    const sorter = sorters[sortBy] || sorters.avg_lap_s;
    return rows.sort(sorter);
  }, [analytics, sortBy]);

  const teammateHeadToHead =
    analytics?.driver_comparisons?.teammate_head_to_head || [];
  const sessionBreakdown = analytics?.session_breakdowns || {};
  const globalFastest = analytics?.lap_times_and_splits?.global_fastest;
  const lapRecords = analytics?.lap_times_and_splits?.lap_records || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {visible.has("lap-times") && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <div style={tinyLabel}>Lap Times And Splits</div>
            <div style={{ height: 280, marginTop: "0.5rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lapSeries}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#222" />
                  <XAxis dataKey="lap" stroke="#888" />
                  <YAxis reversed stroke="#888" />
                  <Tooltip />
                  <Legend />
                  {activeDrivers.map((driver) => (
                    <Line
                      key={driver}
                      dataKey={`${driver}_lap`}
                      name={`${driver} lap`}
                      dot={false}
                      strokeWidth={2}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <div
              style={{
                border: "1px solid #222",
                borderRadius: "0.75rem",
                padding: "0.75rem",
              }}
            >
              <div style={tinyLabel}>Fastest Lap</div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 900,
                  marginTop: "0.3rem",
                }}
              >
                {globalFastest?.lap_time_s ?? "--"}s
              </div>
              <div style={{ color: "#aaa", fontSize: "0.8rem" }}>
                {globalFastest?.driver || "---"} · Lap{" "}
                {globalFastest?.lap || "--"}
              </div>
            </div>

            <div
              style={{
                border: "1px solid #222",
                borderRadius: "0.75rem",
                padding: "0.75rem",
              }}
            >
              <div style={tinyLabel}>Lap Records Preview</div>
              <div
                style={{
                  maxHeight: 140,
                  overflow: "auto",
                  marginTop: "0.35rem",
                }}
              >
                {(lapRecords || []).slice(0, 10).map((item) => (
                  <div
                    key={`record-${item.lap}`}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.75rem",
                      padding: "0.15rem 0",
                    }}
                  >
                    <span>L{item.lap}</span>
                    <span>{item.driver}</span>
                    <span>{item.lap_time_s}s</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        </section>
      )}

      {visible.has("gaps") && (
        <section style={sectionStyle}>
        <div style={tinyLabel}>Gaps And Intervals</div>
        <div style={{ height: 260, marginTop: "0.5rem" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={gapSeries}>
              <CartesianGrid strokeDasharray="2 2" stroke="#222" />
              <XAxis dataKey="lap" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip />
              <Legend />
              {activeDrivers.map((driver) => (
                <Line
                  key={driver}
                  dataKey={`${driver}_gap`}
                  name={`${driver} gap`}
                  dot={false}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        </section>
      )}

      {visible.has("strategy") && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <div style={tinyLabel}>Tire Usage And Strategy</div>
            <div style={{ height: 240, marginTop: "0.5rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={compoundPace}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#222" />
                  <XAxis dataKey="compound" stroke="#888" />
                  <YAxis reversed stroke="#888" />
                  <Tooltip />
                  <Bar dataKey="avg_lap_s" fill="#8b5cf6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <div style={tinyLabel}>Undercut And Overcut</div>
            <div
              style={{ maxHeight: 220, overflow: "auto", marginTop: "0.4rem" }}
            >
              {battles.length === 0 ? (
                <div style={{ color: "#888", fontSize: "0.8rem" }}>
                  No clear pit-window pass detected.
                </div>
              ) : (
                battles.map((b, idx) => (
                  <div
                    key={`battle-${idx}`}
                    style={{
                      padding: "0.35rem 0",
                      borderBottom: "1px solid #222",
                      fontSize: "0.8rem",
                    }}
                  >
                    <strong>{b.type.toUpperCase()}</strong> · {b.attacker} on{" "}
                    {b.target} (L{b.attacker_pit_lap} vs L{b.target_pit_lap})
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div style={{ marginTop: "0.7rem", maxHeight: 160, overflow: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Driver</th>
                <th style={cellStyle}>Stint</th>
                <th style={cellStyle}>Compound</th>
                <th style={cellStyle}>Laps</th>
                <th style={cellStyle}>Wear s/lap</th>
              </tr>
            </thead>
            <tbody>
              {stintRows.slice(0, 24).map((row, idx) => (
                <tr key={`stint-${idx}`}>
                  <td style={cellStyle}>{row.driver}</td>
                  <td style={cellStyle}>{row.stint}</td>
                  <td style={cellStyle}>{row.compound}</td>
                  <td style={cellStyle}>
                    {row.start_lap}-{row.end_lap}
                  </td>
                  <td style={cellStyle}>{row.wear_s_per_lap ?? "--"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </section>
      )}

      {visible.has("pit-fuel") && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          <div>
            <div style={tinyLabel}>Fuel Consumption (Proxy Model)</div>
            <div
              style={{
                fontSize: "0.8rem",
                color: "#9ca3af",
                marginTop: "0.4rem",
              }}
            >
              Burn: {fuelModel?.estimated_burn_kg_per_lap ?? "--"} kg/lap ·
              Start: {fuelModel?.estimated_starting_fuel_kg ?? "--"} kg
            </div>
            <div
              style={{ maxHeight: 160, overflow: "auto", marginTop: "0.45rem" }}
            >
              {activeDrivers.map((driver) => (
                <div
                  key={`fuel-${driver}`}
                  style={{
                    borderBottom: "1px solid #222",
                    padding: "0.35rem 0",
                    fontSize: "0.8rem",
                  }}
                >
                  <strong>{driver}</strong> ·{" "}
                  {fuelDrivers[driver]?.strategy_hint || "No recommendation"}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={tinyLabel}>Pit Stop Analysis</div>
            <div
              style={{ maxHeight: 160, overflow: "auto", marginTop: "0.45rem" }}
            >
              {pitStrategies.map((row) => (
                <div
                  key={`strategy-${row.driver}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.8rem",
                    padding: "0.22rem 0",
                  }}
                >
                  <span>{row.driver}</span>
                  <span>{row.strategy}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginTop: "0.7rem",
          }}
        >
          <div style={{ maxHeight: 170, overflow: "auto" }}>
            <div style={tinyLabel}>Team Crew Performance</div>
            {(pitTeamPerf || []).map((team) => (
              <div
                key={team.team}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.8rem",
                  padding: "0.22rem 0",
                  borderBottom: "1px solid #222",
                }}
              >
                <span>{team.team}</span>
                <span>{team.avg_estimated_pit_lane_loss_s}s</span>
              </div>
            ))}
          </div>

          <div style={{ maxHeight: 170, overflow: "auto" }}>
            <div style={tinyLabel}>Pit Event Stream</div>
            {(pitRows || []).slice(0, 30).map((event, idx) => (
              <div
                key={`pit-event-${idx}`}
                style={{
                  fontSize: "0.78rem",
                  padding: "0.22rem 0",
                  borderBottom: "1px solid #222",
                }}
              >
                L{event.lap} · {event.driver} · {event.event} · loss{" "}
                {event.estimated_pit_lane_loss_s ?? "--"}s
              </div>
            ))}
          </div>
        </div>
        </section>
      )}

      {visible.has("comparisons") && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={tinyLabel}>Driver Comparisons</div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              background: "#111",
              color: "#ddd",
              border: "1px solid #333",
              borderRadius: 6,
              padding: "0.25rem 0.4rem",
              fontSize: "0.75rem",
            }}
          >
            <option value="avg_lap_s">Sort: Avg Pace</option>
            <option value="best_lap_s">Sort: Best Lap</option>
            <option value="consistency_std_s">Sort: Consistency</option>
            <option value="overtakes_estimate">Sort: Overtakes</option>
          </select>
        </div>

        <div style={{ marginTop: "0.45rem", maxHeight: 210, overflow: "auto" }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={cellStyle}>Driver</th>
                <th style={cellStyle}>Team</th>
                <th style={cellStyle}>Avg</th>
                <th style={cellStyle}>Best</th>
                <th style={cellStyle}>Std</th>
                <th style={cellStyle}>Overtakes</th>
              </tr>
            </thead>
            <tbody>
              {comparisonRows.map((row) => (
                <tr key={row.driver}>
                  <td style={cellStyle}>{row.driver}</td>
                  <td style={cellStyle}>{row.team}</td>
                  <td style={cellStyle}>{row.avg_lap_s}</td>
                  <td style={cellStyle}>{row.best_lap_s}</td>
                  <td style={cellStyle}>{row.consistency_std_s}</td>
                  <td style={cellStyle}>{row.overtakes_estimate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: "0.6rem" }}>
          <div style={tinyLabel}>Teammate Head-to-head</div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
              gap: "0.5rem",
              marginTop: "0.35rem",
            }}
          >
            {teammateHeadToHead.map((row, idx) => (
              <div
                key={`h2h-${idx}`}
                style={{
                  border: "1px solid #222",
                  borderRadius: 8,
                  padding: "0.55rem",
                  fontSize: "0.8rem",
                }}
              >
                <div style={{ color: "#999", fontSize: "0.65rem" }}>
                  {row.team}
                </div>
                <div>
                  {row.faster_driver} faster than {row.slower_driver}
                </div>
                <div style={{ color: "#bbb" }}>Gap: {row.avg_gap_s}s/lap</div>
              </div>
            ))}
          </div>
        </div>
        </section>
      )}

      {visible.has("weather") && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.1fr 0.9fr",
            gap: "1rem",
          }}
        >
          <div>
            <div style={tinyLabel}>Weather And Track Conditions</div>
            <div style={{ height: 220, marginTop: "0.45rem" }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weatherImpact}>
                  <CartesianGrid strokeDasharray="2 2" stroke="#222" />
                  <XAxis dataKey="lap" stroke="#888" />
                  <YAxis yAxisId="left" stroke="#888" />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="leader_lap_s"
                    name="Leader Lap s"
                    dot={false}
                    stroke="#22d3ee"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="track_temp_c"
                    name="Track Temp C"
                    dot={false}
                    stroke="#f97316"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <div style={tinyLabel}>Session-by-session</div>
            <div
              style={{ maxHeight: 220, overflow: "auto", marginTop: "0.45rem" }}
            >
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#bbb",
                  marginBottom: "0.25rem",
                }}
              >
                Qualifying snapshot
              </div>
              {(sessionBreakdown?.qualifying || []).slice(0, 10).map((row) => (
                <div
                  key={`q-${row.driver}`}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "0.75rem",
                    padding: "0.2rem 0",
                    borderBottom: "1px solid #222",
                  }}
                >
                  <span>{row.driver}</span>
                  <span>{row.best_lap_s}s</span>
                </div>
              ))}

              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#bbb",
                  margin: "0.5rem 0 0.25rem",
                }}
              >
                Weather samples: {weatherSamples.length}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#888" }}>
                Track evolution and crossover analysis are derived from this
                weather stream and stint pace trends.
              </div>
            </div>
          </div>
        </div>
        </section>
      )}

      {(visible.has("race-control") || visible.has("setup")) && (
        <section style={sectionStyle}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
          }}
        >
          {visible.has("race-control") ? (
            <div>
              <div style={tinyLabel}>Race Replay And Visualization</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginTop: "0.45rem",
                }}
              >
                Interactive map/video sync: unavailable in current public timing
                feed. Timeline still highlights major race-control events.
              </div>
              <div
                style={{
                  maxHeight: 140,
                  overflow: "auto",
                  marginTop: "0.4rem",
                }}
              >
                {timeline.slice(0, 20).map((item, idx) => (
                  <div
                    key={`timeline-${idx}`}
                    style={{
                      fontSize: "0.75rem",
                      borderBottom: "1px solid #222",
                      padding: "0.2rem 0",
                    }}
                  >
                    L{item.lap ?? "--"} · {item.category} · {item.message}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div />
          )}

          {visible.has("setup") ? (
            <div>
              <div style={tinyLabel}>Setup And Configuration Insights</div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "#aaa",
                  marginTop: "0.45rem",
                }}
              >
                {setupNotes}
              </div>
              <div
                style={{
                  marginTop: "0.45rem",
                  fontSize: "0.78rem",
                  color: "#999",
                }}
              >
                Mechanical setup optimization is currently presented as
                unavailable to avoid inventing non-existent telemetry channels.
              </div>
            </div>
          ) : (
            <div />
          )}
        </div>
        </section>
      )}
    </div>
  );
};

export default RaceAnalyticsDashboard;
