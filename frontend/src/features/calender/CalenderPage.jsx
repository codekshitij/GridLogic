import React, { useMemo } from "react";
import { useRaceCalendar } from "../../hooks/useRaceData";
import CalendarRaceDetail from "./components/CalendarRaceDetail";
import CalendarRaceList from "./components/CalendarRaceList";
import { normalizeKey } from "./calendarUtils";

const RACE_IMAGES = {};

const CalenderPage = ({ year, selectedGP, onRaceSelect }) => {
  const calendar = useRaceCalendar(year);
  const events = useMemo(() => calendar.data?.events || [], [calendar.data]);

  const selectedEvent = useMemo(() => {
    if (!events.length) return null;
    const preferredName = normalizeKey(selectedGP);

    if (preferredName) {
      const matched = events.find(
        (event) => normalizeKey(event.EventName) === preferredName,
      );
      if (matched) return matched;
    }

    return events[0];
  }, [events, selectedGP]);

  if (calendar.isLoading) {
    return (
      <div className="py-24 text-center text-[#ff1801] font-black tracking-[0.3em] uppercase">
        LOADING_CALENDER...
      </div>
    );
  }

  if (calendar.error) {
    return (
      <div className="p-8 text-red-400 bg-red-500/10 rounded-2xl text-center font-bold">
        CALENDER_ERROR: {calendar.error.message}
      </div>
    );
  }

  if (!events.length) {
    return (
      <div className="p-8 rounded-2xl border border-white/10 text-center text-white/60 uppercase tracking-wide">
        No races available for this season.
      </div>
    );
  }

  const selectedImage =
    RACE_IMAGES[selectedEvent?.EventName] || RACE_IMAGES["default"] || null;

  const handleSelectRace = (event) => {
    if (onRaceSelect && event.EventName) {
      onRaceSelect(event.EventName);
    }
  };

  return (
    <div className="bg-[#0a0a10] border border-white/5 rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h2 className="text-sm md:text-base font-black uppercase tracking-[0.15em] text-white/90">
          {year} Race Calender
        </h2>
        <span className="text-xs text-white/60 border border-white/10 rounded-full px-3 py-1 font-bold">
          {events.length} races
        </span>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[720px]">
        <CalendarRaceDetail event={selectedEvent} imageUrl={selectedImage} />
        <CalendarRaceList
          events={events}
          selectedRaceName={selectedEvent?.EventName}
          onSelectRace={handleSelectRace}
        />
      </div>
    </div>
  );
};

export default CalenderPage;
