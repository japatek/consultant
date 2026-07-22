import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface WelcomeDateProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string | null | undefined;        // Pass custom strings like "Josh", "Sarah", etc.
  title?: string;       
  customDate?: Date;
}

const WelcomeDate = React.forwardRef<HTMLDivElement, WelcomeDateProps>(
  ({ className, name, title, customDate, ...props }, ref) => {
    const today = customDate || new Date();
    const formattedDate = format(today, "EEEE, do MMMM yyyy");

    // Automatically calculate the greeting based on the current hour
    const greeting = React.useMemo(() => {
      const hour = today.getHours();
      
      if (hour >= 5 && hour < 12) {
        return "Good Morning";
      } else if (hour >= 12 && hour < 17) {
        return "Good Afternoon";
      } else {
        return "Good Evening";
      }
    }, [today]);

    // Priority: 
    // 1. Manual title override 
    // 2. Auto-greeting + custom name 
    // 3. Fallback to just the auto-greeting
    const finalTitle = title || (name ? `${greeting}, ${name}` : `${greeting}!`);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col gap-1", className)}
        {...props}
      >
        <h1 className="text-3xl font-semibold leading-none tracking-tight text-foreground">
          {finalTitle}
        </h1>
        <p className="text-sm text-muted-foreground">{formattedDate}</p>
      </div>
    );
  }
);

WelcomeDate.displayName = "WelcomeDate";

export { WelcomeDate };