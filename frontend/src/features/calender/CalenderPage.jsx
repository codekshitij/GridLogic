import React, { useMemo } from "react";
import { useRaceCalendar, useRaceTrackIntel } from "../../hooks/useRaceData";
import CalendarRaceDetail from "./components/CalendarRaceDetail";
import CalendarRaceList from "./components/CalendarRaceList";
import { normalizeKey } from "./calendarUtils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

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

  const trackIntel = useRaceTrackIntel(year, selectedEvent?.EventName);

  if (calendar.isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-[420px] w-full rounded-lg lg:h-[520px]" />
        </CardContent>
      </Card>
    );
  }

  if (calendar.error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Calendar error</AlertTitle>
        <AlertDescription>{calendar.error.message}</AlertDescription>
      </Alert>
    );
  }

  if (!events.length) {
    return (
      <Card className="border-dashed">
        <CardContent className="py-12 text-center">
          <CardDescription className="text-base">
            No races available for this season.
          </CardDescription>
        </CardContent>
      </Card>
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
    <Card className="overflow-hidden border-border/80 shadow-lg">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/60">
        <div>
          <CardTitle className="font-headline text-base uppercase tracking-[0.12em] md:text-lg">
            {year} race calendar
          </CardTitle>
          <CardDescription>
            Browse rounds and sync with header GP.
          </CardDescription>
        </div>
        <Badge variant="secondary" className="font-bold tabular-nums">
          {events.length} races
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex min-h-[720px] flex-col lg:flex-row">
          <CalendarRaceDetail
            event={selectedEvent}
            imageUrl={selectedImage}
            trackIntel={trackIntel.data}
            trackIntelLoading={trackIntel.isLoading}
            trackIntelError={trackIntel.error}
          />
          <CalendarRaceList
            events={events}
            selectedRaceName={selectedEvent?.EventName}
            onSelectRace={handleSelectRace}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CalenderPage;
