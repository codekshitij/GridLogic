import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000/races";

// 1. FETCH METADATA: Drivers, Team Colors, Event Name
export const useRaceMeta = (year, gp) => {
  return useQuery({
    queryKey: ["raceMeta", year, gp],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${year}/${gp}/meta`);
      return data;
    },
    staleTime: Infinity,
    enabled: !!year && !!gp,
  });
};

// 2. FETCH TELEMETRY: Only for selected drivers
export const useDriverTelemetry = (year, gp, selectedDrivers) => {
  // 1. Safety Guard: Force selectedDrivers to be an array
  const driversArray = Array.isArray(selectedDrivers) ? selectedDrivers : [];
  const driversParam = driversArray.join(",");

  return useQuery({
    queryKey: ["telemetry", year, gp, driversParam],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${year}/${gp}/telemetry`, {
        params: { drivers: driversParam },
      });
      return data;
    },
    staleTime: Infinity,
    // 2. Only run if we actually have valid drivers
    enabled: !!year && !!gp && driversArray.length > 0,
  });
};

export const useRaceAnalytics = (year, gp) => {
  return useQuery({
    queryKey: ["raceAnalytics", year, gp],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${year}/${gp}/analytics`);
      return data;
    },
    staleTime: Infinity,
    enabled: !!year && !!gp,
  });
};

export const useRaceCalendar = (year) => {
  return useQuery({
    queryKey: ["raceCalendar", year],
    queryFn: async () => {
      const { data } = await axios.get(`${BASE_URL}/${year}/calendar`);
      return data;
    },
    staleTime: Infinity,
    enabled: !!year,
  });
};
