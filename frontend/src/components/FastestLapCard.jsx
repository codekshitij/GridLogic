import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const FastestLapCard = ({ driver, time, lap, label = "Fastest lap" }) => {
  return (
    <Card className="relative overflow-hidden border-violet-500/25 bg-gradient-to-br from-card to-muted/30 ring-1 ring-violet-500/25">
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-violet-500/15 blur-2xl"
        aria-hidden
      />
      <CardHeader className="flex flex-row items-start justify-between gap-2">
        <CardDescription className="text-[0.65rem] font-black uppercase tracking-[0.2em]">
          {label}
        </CardDescription>
        <Badge
          variant="secondary"
          className="border border-violet-500/30 bg-violet-500/15 text-[0.6rem] font-black uppercase tracking-wide text-violet-300"
        >
          Purple sector
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-baseline gap-3">
          <CardTitle className="font-headline text-4xl font-black italic tracking-tight text-foreground">
            {time}s
          </CardTitle>
          <span className="text-base font-bold text-violet-400">{driver}</span>
        </div>
        <p className="text-[0.65rem] font-bold uppercase tracking-wider text-muted-foreground">
          Set on lap {lap}
        </p>
      </CardContent>
    </Card>
  );
};

export default FastestLapCard;
