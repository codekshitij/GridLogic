import React from "react";
import CalendarRaceCard from "./CalendarRaceCard";

const CalendarRaceList = ({ events, selectedRaceName, onSelectRace }) => {
  return (
    <section className="w-full lg:w-[38%] xl:w-[34%] bg-[#101018] border-l border-white/5 flex flex-col">
      <div className="p-6 pb-4 flex items-end justify-between">
        <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
          Season Calendar
        </h3>
        <span className="text-[10px] uppercase tracking-[0.18em] text-white/40 font-bold">
          Select Race
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-3">
        {events.map((event) => (
          <CalendarRaceCard
            key={`${event.RoundNumber}-${event.EventName}`}
            event={event}
            isActive={selectedRaceName === event.EventName}
            onClick={() => onSelectRace(event)}
          />
        ))}
      </div>
    </section>
  );
};

export default CalendarRaceList;
