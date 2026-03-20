import React from "react";
import { formatEventWindow, getRaceStatus } from "../calendarUtils";

const statusStyles = {
  completed: "bg-white/10 text-white/60",
  active: "bg-[#ff553d] text-white",
  scheduled: "bg-white/5 text-white/40",
};

const statusLabels = {
  completed: "COMPLETED",
  active: "ACTIVE",
  scheduled: "SCHEDULED",
};

const CalendarRaceCard = ({ event, isActive, onClick }) => {
  const status = getRaceStatus(event);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-4 border-r-4 transition-all ${
        isActive
          ? "bg-[#1f1f28] border-[#ff553d] ring-1 ring-[#ff553d]/30"
          : "bg-[#171721] border-white/10 hover:bg-[#1f1f28] hover:border-[#ff553d]/70"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className="text-[10px] tracking-widest font-black text-[#ffb4a7] uppercase">
          Round {String(event.RoundNumber || "--").padStart(2, "0")}
        </span>
        <span
          className={`px-2 py-0.5 text-[9px] tracking-wider font-bold uppercase ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      </div>

      <h4 className="text-sm md:text-base font-black uppercase text-white leading-tight">
        {event.EventName || "Unnamed Grand Prix"}
      </h4>

      <p className="mt-1 text-xs text-white/50">
        {event.Location || "Unknown"}, {event.Country || "Unknown"}
      </p>

      <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
        <span>{formatEventWindow(event)}</span>
        <span className="font-bold uppercase">{event.EventFormat || "Race"}</span>
      </div>
    </button>
  );
};

export default CalendarRaceCard;
