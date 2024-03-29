import { EventType } from "@/types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcRuns(ballEvents: EventType[]) {
  const runs = ballEvents
    ?.filter((ball) => ball !== "-1")
    ?.map((event) =>
      event.includes("-3")
        ? (Number(event.slice(2)) + 1).toString()
        : event.replace("-2", "1")
    )
    .reduce((acc, cur) => acc + Number(cur), 0);

  return runs;
}

export function calcWickets(ballEvents: EventType[]) {
  const wickets = ballEvents?.filter((ball) => ball === "-1").length;

  return wickets;
}
