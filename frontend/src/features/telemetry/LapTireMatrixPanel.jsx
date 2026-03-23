import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

function compoundBadgeClass(compound) {
  const u = String(compound ?? "").toUpperCase();
  if (u.includes("SOFT")) return "border-red-500/50 bg-red-600/20 text-red-100";
  if (u.includes("MEDIUM"))
    return "border-amber-500/45 bg-amber-500/15 text-amber-100";
  if (u.includes("HARD"))
    return "border-slate-400/40 bg-slate-500/20 text-slate-100";
  if (u.includes("INTER"))
    return "border-emerald-500/40 bg-emerald-600/15 text-emerald-100";
  if (u.includes("WET")) return "border-sky-500/40 bg-sky-600/20 text-sky-100";
  return "border-border bg-muted/60 text-muted-foreground";
}

function abbrevCompound(compound) {
  const u = String(compound ?? "").toUpperCase();
  if (u.includes("SOFT")) return "S";
  if (u.includes("MEDIUM")) return "M";
  if (u.includes("HARD")) return "H";
  if (u.includes("INTER")) return "I";
  if (u.includes("WET")) return "W";
  const s = String(compound ?? "—").replace(/\s+/g, "");
  return s.length <= 3 ? s : s.slice(0, 3);
}

/**
 * Rows = drivers (comparison pair). Columns = lap numbers. Cell = tire compound; click to pick lap for that driver.
 */
export default function LapTireMatrixPanel({
  matrix,
  driverA,
  driverB,
  colorA = "#00D7B6",
  colorB = "#F47600",
  selectedLapA,
  selectedLapB,
  onPickLap,
  isLoading,
  error,
}) {
  const { lapNumbers, byDriver } = useMemo(() => {
    if (!matrix?.drivers) {
      return { lapNumbers: [], byDriver: {} };
    }
    const total = Number(matrix.total_laps) || 0;
    const nums = new Set();
    for (let i = 1; i <= total; i += 1) nums.add(i);
    [driverA, driverB].forEach((code) => {
      const rows = matrix.drivers[code];
      if (Array.isArray(rows)) {
        rows.forEach((r) => nums.add(r.lap));
      }
    });
    const lapNumbers = [...nums].sort((a, b) => a - b);

    const buildMap = (code) => {
      const rows = matrix.drivers[code];
      const m = {};
      if (Array.isArray(rows)) {
        rows.forEach((r) => {
          m[r.lap] = r;
        });
      }
      return m;
    };

    return {
      lapNumbers,
      byDriver: {
        [driverA]: buildMap(driverA),
        [driverB]: buildMap(driverB),
      },
    };
  }, [matrix, driverA, driverB]);

  const rows = useMemo(
    () =>
      [driverA, driverB].filter(Boolean).map((code, idx) => ({
        code,
        label: idx === 0 ? "Lap A" : "Lap B",
        color: idx === 0 ? colorA : colorB,
      })),
    [driverA, driverB, colorA, colorB],
  );

  if (isLoading) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Could not load tire matrix: {error}
      </p>
    );
  }

  if (!lapNumbers.length || !rows.length) {
    return (
      <p className="text-sm text-muted-foreground">
        No lap / tire data for these drivers yet.
      </p>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-lg border border-border/70 bg-muted/20">
      <div className="min-w-max p-2">
        <table className="border-collapse text-xs">
          <thead>
            <tr className="border-b border-border/60">
              <th className="sticky left-0 z-20 bg-card px-2 py-2 text-left font-black uppercase tracking-wider text-muted-foreground">
                Driver
              </th>
              {lapNumbers.map((n) => (
                <th
                  key={n}
                  className="min-w-[2.75rem] px-1 py-2 text-center font-bold tabular-nums text-muted-foreground"
                >
                  {n}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(({ code, label, color }) => (
              <tr
                key={code}
                className="border-b border-border/40 last:border-0"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-2 py-1.5 text-left font-mono font-black"
                  style={{ color }}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </span>
                  {code}
                </th>
                {lapNumbers.map((lapNum) => {
                  const cell = byDriver[code]?.[lapNum];
                  const compound = cell?.compound ?? "";
                  const hasData = Boolean(cell);
                  const isSelected =
                    code === driverA
                      ? String(lapNum) === String(selectedLapA)
                      : String(lapNum) === String(selectedLapB);

                  return (
                    <td key={`${code}-${lapNum}`} className="p-0.5 text-center">
                      <button
                        type="button"
                        disabled={!hasData}
                        title={
                          hasData
                            ? `${compound} · Lap ${lapNum}` +
                              (cell.lap_time_s != null
                                ? ` · ${cell.lap_time_s.toFixed(3)}s`
                                : "")
                            : "No lap data"
                        }
                        onClick={() => hasData && onPickLap?.(code, lapNum)}
                        className={cn(
                          "min-h-8 w-full min-w-[2.5rem] rounded-md border px-0.5 py-1 text-[10px] font-black leading-none transition-all",
                          hasData
                            ? compoundBadgeClass(compound)
                            : "cursor-default border-transparent bg-transparent text-muted-foreground/30",
                          hasData && "hover:brightness-110 active:scale-[0.98]",
                        )}
                        style={
                          hasData && isSelected
                            ? {
                                outline: `2px solid ${color}`,
                                outlineOffset: 2,
                              }
                            : undefined
                        }
                      >
                        {hasData ? abbrevCompound(compound) : "—"}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
