import React from "react";
import { useRaceAnalytics } from "../../hooks/useRaceData";
import RaceAnalyticsDashboard from "../lap-times/RaceAnalyticsDashboard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const RaceControlPage = ({ year, gp }) => {
  const analytics = useRaceAnalytics(year, gp);

  if (analytics.isLoading) {
    return (
      <div className="flex flex-col gap-4 py-4">
        <Skeleton className="h-10 w-full max-w-md rounded-lg" />
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    );
  }

  if (analytics.error) {
    return (
      <Alert variant="destructive" className="max-w-xl">
        <AlertTitle>Race control error</AlertTitle>
        <AlertDescription>{analytics.error.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <RaceAnalyticsDashboard
      analytics={analytics.data}
      selectedDrivers={[]}
      allDrivers={[]}
      visibleSections={["race-control"]}
    />
  );
};

export default RaceControlPage;
