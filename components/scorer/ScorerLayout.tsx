"use client";

import { EventType } from "@/types";
import { calcRuns, calcWickets } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import DangerActions from "./DangerActions";
import ScoreWrapper from "./ScoreWrapper";
import BallSummary from "./BallSummary";
import ScoreButtons from "./ScoreButtons";
import FooterSummary from "./FooterSummary";
import { BallEvent } from "@prisma/client";
import { useSaveBallEvents } from "@/hooks/api/ballEvent/useCreateBallEvent";
import { useDeleteAllBallEvents } from "@/hooks/api/ballEvent/useDeleteAllBallEvents";
import BatsmanScores from "./BatsmanScores";
import BowlerScores from "./BowlerScores";
import { useEffect, useState } from "react";
import { CreateBallEventSchema } from "@/lib/validation/ballEvent";
import LoadingButton from "../ui/loading-button";
import { useEventsById } from "@/hooks/api/ballEvent/useEventsById";
import { toast } from "sonner";

export const ballEvents: Record<BallEvent["type"], string> = {
  "-3": "NB",
  "-2": "WD",
  "-1": "W",
  "0": "0",
  "1": "1",
  "2": "2",
  "3": "3",
  "4": "4",
  "6": "6",
};

function ScorerLayout({ matchId }: { matchId: string }) {
  const { events: fetchedEvents } = useEventsById(matchId);

  const { createBallEvent, isPending } = useSaveBallEvents();
  const { deleteAllBallEvents } = useDeleteAllBallEvents();

  const [events, setEvents] = useState<CreateBallEventSchema[] | BallEvent[]>(
    [],
  );
  const [isModified, setIsModified] = useState(false);

  useEffect(() => {
    setEvents(fetchedEvents as BallEvent[]);
  }, [fetchedEvents]);

  if (!fetchedEvents) return <p>loading...</p>;
  const balls = events?.map((event) => event.type as EventType);

  if (!balls) return <p>loading balls...</p>;

  const invalidBalls = ["-3", "-2"];

  const runs = calcRuns(balls);
  const wickets = calcWickets(balls);
  const totalBalls = balls.filter(
    (ball) => !invalidBalls.includes(ball) && !ball.includes("-3"),
  ).length;

  const runRate = Number(totalBalls ? ((runs / totalBalls) * 6).toFixed(2) : 0);

  const extras = balls.filter(
    (ball) => ball === "-2" || ball.includes("-3"),
  ).length;

  let ballLimitInOver = 6;
  function generateOverSummary(ballEvents: EventType[]) {
    const overSummaries: EventType[][] = [];
    let validBallCount = 0;
    let currentOver: EventType[] = [];
    for (const ballEvent of ballEvents) {
      currentOver.push(ballEvent);
      if (!invalidBalls.includes(ballEvent) && !ballEvent.includes("-3")) {
        validBallCount++;
        if (validBallCount === 6) {
          overSummaries.push(currentOver);
          currentOver = [];
          validBallCount = 0;
          ballLimitInOver = 6;
        }
      } else ballLimitInOver++;
    }

    if (validBallCount >= 0 && currentOver.length > 0) {
      overSummaries.push(currentOver);
    }

    return overSummaries;
  }
  const overSummaries: EventType[][] = generateOverSummary(balls);

  const chartSummaryData = overSummaries.map((summary, i) => ({
    name: i < 9 ? `Over ${i + 1}` : i + 1,
    runs: calcRuns(summary),
  }));

  const curOverIndex = Math.floor(totalBalls / 6);
  const curOverRuns = calcRuns(overSummaries[curOverIndex]);
  const curOverWickets = calcWickets(overSummaries[curOverIndex]);

  function handleScore(e: React.MouseEvent<HTMLButtonElement>) {
    setIsModified(true);
    const event = e.currentTarget.value;
    setEvents([
      ...events,
      {
        type: event,
        batsmanId: "65ec3e4d9c8d41462b3505b8",
        bowlerId: "65ec3e4d9c8d41462b3505be",
        matchId,
      },
    ]);
  }

  const handleUndo = () => {
    setEvents(events.slice(0, -1));
  };

  return (
    <>
      <Card className="relative p-2 max-sm:w-full max-sm:border-0 sm:w-96">
        <div className="absolute left-0 top-0 flex w-full items-center justify-between p-2">
          <div>
            <LoadingButton
              loading={isPending}
              disabled={isPending || !isModified}
              onClick={() => {
                createBallEvent(events, {
                  onSuccess: () => toast.success("Score saved successfully"),
                });
                setIsModified(false);
              }}
            >
              {isPending ? "Saving..." : "Save"}
            </LoadingButton>
          </div>
          <DangerActions
            handleRestart={() => deleteAllBallEvents(matchId)}
            handleUndo={handleUndo}
          />
        </div>
        <CardContent className="space-y-4 max-sm:p-0">
          <ScoreWrapper
            runs={runs}
            wickets={wickets}
            totalBalls={totalBalls}
            runRate={runRate}
          />
          <ul className="flex justify-start gap-2 overflow-x-auto">
            {Array.from({ length: ballLimitInOver }, (_, i) => (
              <BallSummary key={i} event={overSummaries[curOverIndex]?.[i]} />
            ))}
          </ul>

          <BatsmanScores
            playerId={events?.[0]?.batsmanId!}
            events={events as BallEvent[]}
          />

          <FooterSummary
            extras={extras}
            curOverRuns={curOverRuns}
            curOverWickets={curOverWickets}
            runRate={runRate}
            chartSummaryData={chartSummaryData}
            overSummaries={overSummaries}
          />
        </CardContent>
        <Separator className="my-4 sm:my-4" />
        <ScoreButtons handleScore={handleScore} ballEvents={ballEvents} />
        <Separator className="my-4 sm:my-4" />
        <BowlerScores
          playerId={events[0]?.bowlerId!}
          events={events as BallEvent[]}
        />
      </Card>
    </>
  );
}

export default ScorerLayout;
