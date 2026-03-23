import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const StatCard = ({ title, value, unit, trend, icon: Icon }) => (
  <Card className="group border-border/80 bg-card/90 transition-colors hover:border-racing/40 hover:shadow-md">
    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
      <CardDescription className="text-[0.65rem] font-black uppercase tracking-widest">
        {title}
      </CardDescription>
      {Icon && (
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-racing" />
      )}
    </CardHeader>
    <CardContent>
      <CardTitle className="font-headline text-2xl font-black italic tabular-nums">
        {value}
        <span className="ml-1 text-xs font-bold not-italic text-muted-foreground">
          {unit}
        </span>
      </CardTitle>
      {trend != null && (
        <p
          className={cn(
            "mt-2 text-[0.65rem] font-bold",
            trend > 0 ? "text-emerald-500" : "text-red-500",
          )}
        >
          {trend > 0 ? "▲" : "▼"} {Math.abs(trend)}% vs prev. lap
        </p>
      )}
    </CardContent>
  </Card>
);

export default StatCard;
