import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface CardStatProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

const CardStat = ({ title, value, icon: Icon, trend, trendUp }: CardStatProps) => {
  return (
    <div className="bg-gradient-card rounded-2xl shadow-card p-6 border border-border hover:shadow-glow transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {trend && (
            <p
              className={cn(
                "text-sm font-medium",
                trendUp ? "text-success" : "text-destructive"
              )}
            >
              {trend}
            </p>
          )}
        </div>
        <div className="p-3 bg-gradient-primary rounded-xl shadow-glow">
          <Icon className="w-6 h-6 text-primary-foreground" />
        </div>
      </div>
    </div>
  );
};

export default CardStat;
