import React from "react";
import {
  formatEventDate,
  formatEventWindow,
  getCountdown,
  getRaceStatus,
} from "../calendarUtils";
import TrackIntelCard from "./TrackIntelCard";
import TrackMapCard from "./TrackMapCard";

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
    <section className="flex w-full flex-col gap-6 border-border/40 bg-background/40 p-6 md:p-8 lg:w-[62%] xl:w-[66%]">
      <div className="relative min-h-[320px] overflow-hidden rounded-lg border-l-4 border-racing bg-card">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={event?.EventName || "Selected race"}
            className="absolute inset-0 h-full w-full object-cover opacity-55"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-muted via-card to-background" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="bg-racing px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white">
              {status === "active"
                ? "Active Event"
                : status === "completed"
                  ? "Completed"
                  : "Upcoming"}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              Round {String(event?.RoundNumber || "--").padStart(2, "0")}
            </span>
          </div>

          <h2 className="font-headline text-3xl font-black uppercase italic tracking-tight text-foreground md:text-5xl">
            {event?.EventName || "Select a race"}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            {event?.Location || "Unknown"}, {event?.Country || "Unknown"} •{" "}
            {formatEventWindow(event)}
          </p>

          <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
            <div className="border-b-2 border-racing bg-muted/40 p-3 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Days
              </p>
              <p className="font-headline text-2xl font-black text-foreground">
                {countdown.days}
              </p>
            </div>
            <div className="border-b-2 border-racing bg-muted/40 p-3 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Hours
              </p>
              <p className="font-headline text-2xl font-black text-foreground">
                {countdown.hours}
              </p>
            </div>
            <div className="border-b-2 border-racing bg-muted/40 p-3 backdrop-blur-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Mins
              </p>
              <p className="font-headline text-2xl font-black text-foreground">
                {countdown.mins}
              </p>
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
          <div
            key={item.key}
            className="border-l-2 border-border bg-card p-5 ring-1 ring-foreground/5"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-primary">
              {item.key}
            </p>
            <p className="mt-2 break-words text-lg font-black text-foreground">
              {item.accessor(event)}
            </p>
          </div>
        ))}
      </div>

      <TrackMapCard eventName={event?.EventName} />
    </section>
  );
};

export default CalendarRaceDetail;
