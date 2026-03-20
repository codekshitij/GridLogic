import React from "react";
import {
  formatEventDate,
  formatEventWindow,
  getCountdown,
  getRaceStatus,
} from "../calendarUtils";
import TrackIntelCard from "./TrackIntelCard";

const detailItems = [
  { key: "Country", accessor: (event) => event.Country || "Unknown" },
  { key: "Location", accessor: (event) => event.Location || "Unknown" },
  { key: "Format", accessor: (event) => event.EventFormat || "Race" },
  { key: "Session", accessor: (event) => formatEventDate(event) },
];

const CalendarRaceDetail = ({
  event,
  imageUrl,
  trackIntel,
  trackIntelLoading,
  trackIntelError,
}) => {
  const countdown = getCountdown(event);
  const status = getRaceStatus(event);

  return (
    <section className="w-full lg:w-[62%] xl:w-[66%] p-6 md:p-8 bg-[#13131b] border border-white/5 flex flex-col gap-6">
      <div className="relative min-h-[320px] rounded-md overflow-hidden border-l-4 border-[#ff553d] bg-[#171721]">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event?.EventName || "Selected race"}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#1f1f28] via-[#171721] to-[#0f0f17]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d16] via-[#0d0d16]/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-[#ff553d] px-3 py-1 text-[10px] uppercase tracking-widest font-black text-white">
              {status === "active"
                ? "Active Event"
                : status === "completed"
                  ? "Completed"
                  : "Upcoming"}
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50 font-bold">
              Round {String(event?.RoundNumber || "--").padStart(2, "0")}
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black italic tracking-tight uppercase text-white">
            {event?.EventName || "Select a race"}
          </h2>
          <p className="mt-2 text-sm md:text-base text-white/75">
            {event?.Location || "Unknown"}, {event?.Country || "Unknown"} • {formatEventWindow(event)}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <div className="bg-[#13131b]/80 border-b-2 border-[#ff553d] p-3">
              <p className="text-[10px] tracking-widest text-white/40 font-bold uppercase">Days</p>
              <p className="text-2xl font-black font-headline text-white">{countdown.days}</p>
            </div>
            <div className="bg-[#13131b]/80 border-b-2 border-[#ff553d] p-3">
              <p className="text-[10px] tracking-widest text-white/40 font-bold uppercase">Hours</p>
              <p className="text-2xl font-black font-headline text-white">{countdown.hours}</p>
            </div>
            <div className="bg-[#13131b]/80 border-b-2 border-[#ff553d] p-3">
              <p className="text-[10px] tracking-widest text-white/40 font-bold uppercase">Mins</p>
              <p className="text-2xl font-black font-headline text-white">{countdown.mins}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TrackIntelCard
          trackIntel={trackIntel}
          isLoading={trackIntelLoading}
          error={trackIntelError}
        />
        {detailItems.map((item) => (
          <div key={item.key} className="bg-[#1b1b24] border-l-2 border-white/10 p-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#ffb4a7] font-bold">
              {item.key}
            </p>
            <p className="mt-2 text-lg font-black text-white break-words">
              {item.accessor(event)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CalendarRaceDetail;
