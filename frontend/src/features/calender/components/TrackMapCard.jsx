import React, { useMemo, useState } from "react";
import { getCircuitImageUrl } from "../circuitImageRegistry";

const TrackMapCard = ({ eventName }) => {
  const [failedEventName, setFailedEventName] = useState(null);

  const circuitImageUrl = useMemo(
    () => getCircuitImageUrl(eventName),
    [eventName],
  );

  const imageFailed = failedEventName === eventName;

  return (
    <div className="bg-[#1b1b24] border-l-2 border-white/10 p-5">
      <p className="text-[10px] uppercase tracking-[0.22em] text-[#ffb4a7] font-bold">
        Track Map
      </p>

      {circuitImageUrl && !imageFailed ? (
        <div className="mt-4 rounded-md border border-white/10 bg-[#13131b] p-3">
          <img
            src={circuitImageUrl}
            alt={eventName ? `${eventName} circuit map` : "Circuit map"}
            className="w-full h-auto rounded-sm"
            onError={() => setFailedEventName(eventName || "")}
          />
        </div>
      ) : (
        <p className="mt-3 text-sm text-white/60">
          No circuit image found yet. Add one in public/circuits and map it in
          circuitImageRegistry.
        </p>
      )}
    </div>
  );
};

export default TrackMapCard;
