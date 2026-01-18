import { LucideIcon } from "lucide-react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for combining classes

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: "primary" | "success" | "warning" | "destructive";
  
  // These props allow overrides from the parent component (OperatorDashboard)
  iconClassName?: string;
  valueClassName?: string;
}

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendUp,
  color = "primary",
  
  iconClassName,
  valueClassName,
}: StatsCardProps) => {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  };
  
  // 🎯 NEW RESPONSIVE DEFAULTS FOR ICON CONTAINER 🎯
  // On mobile (default): p-2 (small padding)
  // On sm/desktop: p-3 (original padding)
  const iconContainerClass = `p-2 sm:p-3 ${colorClasses[color]}`;

  // On mobile (default): h-5 w-5 (small icon)
  // On sm/desktop: h-6 w-6 (original icon size)
  const defaultIconClass = "h-5 w-5 sm:h-6 sm:w-6"; 

  // On mobile (default): text-2xl (from OperatorDashboard)
  // On sm/desktop: text-3xl (from OperatorDashboard)
  const defaultValueClass = "text-2xl sm:text-3xl"; 

  return (
    // Card padding is reduced slightly on mobile (p-4) if you use p-4 in OperatorDashboard
    // Added h-full to Card for alignment consistency across the grid
    <Card className="p-4 sm:p-6 h-full flex flex-col justify-between hover:shadow-lg transition-shadow"> 
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {/* Title is small on mobile */}
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          
          {/* Applied the responsive value class here */}
          <p className={cn("mt-2 font-bold", defaultValueClass, valueClassName)}>{value}</p>
          
          {trend && (
            <p
              className={`mt-1 text-xs ${ // Reduced margin top (mt-1) and ensured text-xs for trend on mobile
                trendUp ? "text-success" : "text-destructive"
              }`}
            >
              {trend}
            </p>
          )}
        </div>
        
        {/* 🎯 Applied RESPONSIVE PADDING and ICON SIZING 🎯 */}
        <div className={`rounded-lg ${iconContainerClass}`}>
          {/* Applied the responsive icon class */}
          <Icon className={cn(defaultIconClass, iconClassName)} />
        </div>
      </div>
    </Card>
  );
};