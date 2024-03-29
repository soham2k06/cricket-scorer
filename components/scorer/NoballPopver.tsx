import { MouseEventHandler, useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
function NoballPopver({
  handleScore,
  ballEvents,
}: {
  handleScore: MouseEventHandler<HTMLButtonElement>;
  ballEvents: Record<string, string>;
}) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  return (
    <Popover
      open={isPopoverOpen}
      modal
      onOpenChange={() => setIsPopoverOpen((prev) => !prev)}
    >
      <PopoverTrigger asChild>
        <Button
          size="lg"
          variant="secondary"
          className="w-full h-20 text-lg text-muted-foreground"
          value="-3"
        >
          NB
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-60">
        <div className="w-full grid grid-cols-3 gap-2">
          {Object.keys(ballEvents)
            .filter((ball) => ball !== "-1" && ball !== "-2" && ball !== "-3")
            .map((event, i) => (
              <Button
                key={i}
                className={
                  event === "6"
                    ? "bg-amber-400 font-semibold text-amber-950 dark:bg-amber-600 dark:text-amber-50"
                    : event === "4"
                    ? "bg-emerald-500 text-emerald-50 dark:bg-emerald-600"
                    : "bg-secondary text-secondary-foreground"
                }
                value={`-3${event}`}
                onClick={(e) => {
                  handleScore(e);
                  setIsPopoverOpen(false);
                }}
              >
                {event}
              </Button>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default NoballPopver;
