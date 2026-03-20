const getSessionDateCandidates = (event) => {
  if (!event) return [];
  return [
    event.Session5DateUtc,
    event.Session4DateUtc,
    event.Session3DateUtc,
    event.Session2DateUtc,
    event.Session1DateUtc,
  ].filter(Boolean);
};

export const getRaceDate = (event) => {
  const [raceDateRaw] = getSessionDateCandidates(event);
  if (!raceDateRaw) return null;
  const raceDate = new Date(raceDateRaw);
  return Number.isNaN(raceDate.getTime()) ? null : raceDate;
};

export const getRaceStatus = (event) => {
  const raceDate = getRaceDate(event);
  if (!raceDate) return "scheduled";

  const now = new Date();
  const diffMs = raceDate.getTime() - now.getTime();
  const oneDayMs = 24 * 60 * 60 * 1000;

  if (diffMs < -oneDayMs) return "completed";
  if (Math.abs(diffMs) <= oneDayMs) return "active";
  return "scheduled";
};

export const getCountdown = (event) => {
  const raceDate = getRaceDate(event);
  if (!raceDate) {
    return { days: "--", hours: "--", mins: "--" };
  }

  const now = new Date();
  let diffMs = raceDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return { days: "00", hours: "00", mins: "00" };
  }

  const days = Math.floor(diffMs / (24 * 60 * 60 * 1000));
  diffMs -= days * 24 * 60 * 60 * 1000;

  const hours = Math.floor(diffMs / (60 * 60 * 1000));
  diffMs -= hours * 60 * 60 * 1000;

  const mins = Math.floor(diffMs / (60 * 1000));

  return {
    days: String(days).padStart(2, "0"),
    hours: String(hours).padStart(2, "0"),
    mins: String(mins).padStart(2, "0"),
  };
};

export const formatEventDate = (event) => {
  const raceDate = getRaceDate(event);
  if (!raceDate) return "TBD";

  return raceDate.toLocaleString(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });
};

export const formatEventWindow = (event) => {
  const sessionDates = [
    event?.Session1DateUtc,
    event?.Session2DateUtc,
    event?.Session3DateUtc,
    event?.Session4DateUtc,
    event?.Session5DateUtc,
  ]
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((value) => !Number.isNaN(value.getTime()));

  if (!sessionDates.length) return "Dates TBD";

  const sorted = sessionDates.sort((a, b) => a.getTime() - b.getTime());
  const start = sorted[0];
  const end = sorted[sorted.length - 1];

  const startLabel = start.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });

  const endLabel = end.toLocaleDateString(undefined, {
    month: "short",
    day: "2-digit",
  });

  return `${startLabel} - ${endLabel}`;
};

export const normalizeKey = (value) =>
  (value || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
