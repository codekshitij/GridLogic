import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DriverPanel = ({
  allDrivers,
  selectedDrivers,
  onToggle,
  onClear,
  title = "Driver selection",
  description = "Tap drivers to compare; empty selection uses defaults.",
}) => {
  return (
    <Card className="border-border/80 bg-card/80 shadow-lg ring-1 ring-racing/15 backdrop-blur-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div>
          <CardTitle className="font-headline text-base uppercase tracking-[0.12em]">
            {title}
          </CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          className="font-black uppercase tracking-wider shadow-md"
          onClick={onClear}
        >
          Reset grid
        </Button>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex max-w-[1400px] flex-row flex-wrap gap-2 sm:gap-2.5">
          {allDrivers.map((driver) => {
            const code = typeof driver === "object" ? driver.code : driver;
            const isActive = selectedDrivers.includes(code);
            const teamColor = driver.color || "#444";

            return (
              <button
                key={code}
                type="button"
                onClick={() => onToggle(code)}
                className={cn(
                  "relative flex h-9 min-w-[60px] max-w-[85px] items-center justify-center overflow-hidden rounded-md border-2 text-[0.85rem] font-black uppercase tracking-wider transition-all outline-none",
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  !isActive && "bg-muted/40 text-muted-foreground",
                  isActive && "text-foreground",
                )}
                style={{
                  borderColor: isActive ? teamColor : "rgba(255,255,255,0.08)",
                  boxShadow: isActive ? `0 0 16px ${teamColor}44` : "none",
                  background: isActive ? `${teamColor}18` : undefined,
                }}
              >
                <span className="relative z-[2] drop-shadow-sm">{code}</span>
                {isActive && (
                  <span
                    className="absolute bottom-0 left-[20%] z-[1] h-[3px] w-[60%] rounded-t-sm opacity-95 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    style={{ background: teamColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DriverPanel;
