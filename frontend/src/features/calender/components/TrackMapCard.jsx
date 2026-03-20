import React, { useMemo } from "react";

const TrackMapCard = ({ trackIntel, isLoading, error }) => {
  const { pathData, points } = useMemo(() => {
    const corners = [...(trackIntel?.corners || [])].filter(
      (corner) =>
        corner &&
        Number.isFinite(corner.x) &&
        Number.isFinite(corner.y),
    );

    if (!corners.length) {
      return { pathData: "", points: [] };
    }

    const sorted = corners.sort((a, b) => {
      if (Number.isFinite(a.distance_m) && Number.isFinite(b.distance_m)) {
        return a.distance_m - b.distance_m;
      }
      return (a.number || 0) - (b.number || 0);
    });

    const xs = sorted.map((point) => point.x);
    const ys = sorted.map((point) => point.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    const width = Math.max(1, maxX - minX);
    const height = Math.max(1, maxY - minY);
    const padding = 20;
    const viewWidth = 1000;
    const viewHeight = 500;

    const scaleX = (viewWidth - padding * 2) / width;
    const scaleY = (viewHeight - padding * 2) / height;
    const scale = Math.min(scaleX, scaleY);

    const mappedPoints = sorted.map((point) => ({
      x: padding + (point.x - minX) * scale,
      y: padding + (point.y - minY) * scale,
      number: point.number,
    }));

    const path = mappedPoints
      .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)},${point.y.toFixed(1)}`)
      .join(" ");

    return {
      pathData: `${path} Z`,
      points: mappedPoints,
    };
  }, [trackIntel]);

  return (
    <div className="bg-[#1b1b24] border-l-2 border-white/10 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#ffb4a7] font-bold">
          Track Map
        </p>
        {trackIntel?.intel_source_year ? (
          <span className="text-[10px] text-white/40 font-bold uppercase tracking-wider">
            Source {trackIntel.intel_source_year}
          </span>
        ) : null}
      </div>

      {isLoading ? (
        <p className="mt-3 text-sm text-white/60">Loading track map...</p>
      ) : error ? (
        <p className="mt-3 text-sm text-red-300">Track map unavailable</p>
      ) : !pathData ? (
        <p className="mt-3 text-sm text-white/60">No corner coordinates available</p>
      ) : (
        <div className="mt-4 rounded-md border border-white/10 bg-[#13131b] p-3">
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-[220px]"
            role="img"
            aria-label="Circuit map"
          >
            <path
              d={pathData}
              fill="none"
              stroke="#ff553d"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {points.map((point, index) => (
              <circle
                key={`corner-${index}`}
                cx={point.x}
                cy={point.y}
                r="3"
                fill="#ffb4a7"
              />
            ))}
          </svg>
        </div>
      )}
    </div>
  );
};

export default TrackMapCard;
