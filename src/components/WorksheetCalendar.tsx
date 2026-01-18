import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WorkEntry {
  date: string;
  hoursLogged: number;
  tasksCompleted: number;
  status: "completed" | "partial" | "pending";
}

const mockData: WorkEntry[] = [
  { date: "2024-10-21", hoursLogged: 9, tasksCompleted: 4, status: "completed" },
  { date: "2024-10-22", hoursLogged: 8.5, tasksCompleted: 3, status: "partial" },
  { date: "2024-10-23", hoursLogged: 9, tasksCompleted: 5, status: "completed" },
  { date: "2024-10-24", hoursLogged: 7, tasksCompleted: 2, status: "partial" },
  { date: "2024-10-25", hoursLogged: 9, tasksCompleted: 4, status: "completed" },
];

export const WorksheetCalendar = () => {
  const [currentDate] = useState(new Date());

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getWorkEntry = (day: number | null) => {
    if (!day) return null;
    const dateStr = `2024-10-${day.toString().padStart(2, "0")}`;
    return mockData.find((entry) => entry.date === dateStr);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "completed":
        return "bg-success/20 border-success";
      case "partial":
        return "bg-warning/20 border-warning";
      default:
        return "bg-muted border-border";
    }
  };

  const days = getDaysInMonth();
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Work Calendar</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="font-medium min-w-[120px] text-center">
            {currentDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>
          <Button variant="outline" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
        {days.map((day, index) => {
          const workEntry = getWorkEntry(day);
          return (
            <div
              key={index}
              className={`min-h-[80px] p-2 rounded-lg border-2 transition-all hover:shadow-md ${
                day ? getStatusColor(workEntry?.status) : "bg-transparent border-transparent"
              }`}
            >
              {day && (
                <>
                  <div className="text-sm font-medium mb-1">{day}</div>
                  {workEntry && (
                    <div className="text-xs space-y-1">
                      <div className="font-medium">{workEntry.hoursLogged}h</div>
                      <div className="text-muted-foreground">
                        {workEntry.tasksCompleted} tasks
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-6 mt-6 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-success/20 border-2 border-success"></div>
          <span className="text-sm text-muted-foreground">9 Hours Complete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-warning/20 border-2 border-warning"></div>
          <span className="text-sm text-muted-foreground">Partial Hours</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border-2 border-border"></div>
          <span className="text-sm text-muted-foreground">No Data</span>
        </div>
      </div>
    </Card>
  );
};
