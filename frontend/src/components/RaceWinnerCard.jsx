import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const RaceWinnerCard = ({
  driver,
  fullName,
  team,
  number,
  label = "Race winner",
}) => {
  return (
    <Card className="relative overflow-hidden border-racing/30 bg-gradient-to-br from-card to-muted/30 ring-1 ring-racing/20">
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-racing/20 blur-2xl"
        aria-hidden
      />
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardDescription className="text-[0.65rem] font-black uppercase tracking-[0.2em]">
          {label}
        </CardDescription>
        <Badge
          variant="secondary"
          className="border border-racing/40 bg-racing/15 text-[0.6rem] font-black uppercase tracking-wide text-racing"
        >
          Checkered flag
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <CardTitle className="font-headline text-4xl font-black italic tracking-tight">
            {driver}
          </CardTitle>
          <span className="text-base font-bold text-racing">#{number}</span>
        </div>
        <p className="text-sm font-semibold text-muted-foreground">
          {fullName} · {team}
        </p>
      </CardContent>
    </Card>
  );
};

export default RaceWinnerCard;
