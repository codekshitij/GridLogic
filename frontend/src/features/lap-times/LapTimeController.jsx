import React, { useMemo } from "react";
import { useRaceMeta, useRaceAnalytics } from "../../hooks/useRaceData";
import DriverPanel from "../../components/DriverPanel";
import PaceChart from "./PaceChart";
import GapChart from "./GapChart";
import FastestLapCard from "../../components/FastestLapCard";
import RaceWinnerCard from "../../components/RaceWinnerCard";
import { useWorkerizedData } from "./useWorkerizedData";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const LapTimeController = ({
  year,
  gp,
  selectedDrivers,
  onSelectionChange,
}) => {
  const meta = useRaceMeta(year, gp);
  const analytics = useRaceAnalytics(year, gp);

  const allDrivers = useMemo(() => meta.data?.drivers || [], [meta.data]);
  const driversToShow = selectedDrivers;

  const gapSeries =
    useWorkerizedData(
      new URL("./gap.worker.js", import.meta.url),
      {
        gapData: analytics.data?.gaps_and_intervals,
        selectedDrivers: driversToShow,
      },
      [analytics.data, driversToShow],
    ) || [];

  const paceChartData =
    useWorkerizedData(
      new URL("./pace.worker.js", import.meta.url),
      {
        paceData: analytics.data?.lap_times_and_splits?.drivers,
        selectedDrivers: driversToShow,
        mode: "per-lap",
      },
      [analytics.data, driversToShow],
    )?.chartData || [];

  const globalFastest = analytics.data?.lap_times_and_splits?.global_fastest;
  const raceWinner = meta.data?.race_winner;

  if (meta.isLoading || analytics.isLoading) {
    return (
      <div className="flex flex-col gap-4 py-8">
        <Skeleton className="h-32 w-full rounded-xl" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-40 rounded-xl" />
          <Skeleton className="h-40 rounded-xl" />
        </div>
        <Skeleton className="h-72 w-full rounded-xl" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    );
  }
  if (meta.error)
    return (
      <Alert variant="destructive" className="max-w-xl">
        <AlertTitle>Connection lost</AlertTitle>
        <AlertDescription>{meta.error.message}</AlertDescription>
      </Alert>
    );
  if (analytics.error)
    return (
      <Alert variant="destructive" className="max-w-xl">
        <AlertTitle>Analytics error</AlertTitle>
        <AlertDescription>{analytics.error.message}</AlertDescription>
      </Alert>
    );

  return (
    <div className="flex flex-col gap-8">
      <DriverPanel
        allDrivers={allDrivers}
        selectedDrivers={selectedDrivers}
        onToggle={onSelectionChange}
        onClear={() => onSelectionChange([])}
      />

      {(globalFastest || raceWinner) && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
          {globalFastest && (
            <FastestLapCard
              driver={globalFastest.driver}
              time={globalFastest.lap_time_s}
              lap={globalFastest.lap}
            />
          )}
          {raceWinner && (
            <RaceWinnerCard
              driver={raceWinner.driver}
              fullName={raceWinner.name}
              team={raceWinner.team}
              number={raceWinner.number}
            />
          )}
        </div>
      )}

      <div className="space-y-8">
        <PaceChart data={paceChartData} selectedDrivers={driversToShow} />
        <GapChart data={gapSeries} selectedDrivers={driversToShow} />
      </div>
    </div>
  );
};

export default LapTimeController;
