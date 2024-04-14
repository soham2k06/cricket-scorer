"use client";

import { useEffect, useState } from "react";
import { deleteCookie, getCookie, setCookie } from "cookies-next";

import { EventType } from "@/types";
import { generateOverSummary, getScore } from "@/lib/utils";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import DangerActions from "./DangerActions";
import BallSummary from "./BallSummary";
import ScoreButtons from "../score-buttons/ScoreButtons";
import FooterSummary from "../match-stats/FooterSummary";
import ScoreWrapper from "./ScoreDisplay";

function ScorerLayout() {
  const [balls, setBalls] = useState<EventType[]>([]);

  const { runs, totalBalls, wickets, extras, runRate } = getScore(balls);

  const { overSummaries, ballLimitInOver } = generateOverSummary(balls);

  const curOverIndex = Math.floor(totalBalls / 6);
  const { runs: curOverRuns, wickets: curOverWickets } = getScore(
    overSummaries[curOverIndex] || [],
  );

  useEffect(() => {
    const balls = getCookie("balls");
    if (balls) {
      setBalls(JSON.parse(balls));
    }
  }, []);

  function handleScore(e: React.MouseEvent<HTMLButtonElement>) {
    const event = e.currentTarget.value;
    setBalls((prev) => [...prev, event as EventType]);
    setCookie("balls", JSON.stringify([...balls, event]));
  }

  const handleUndo = () => {
    setBalls((prev) => prev.slice(0, -1));
    setCookie("balls", JSON.stringify(balls.slice(0, -1)));
  };

  return (
    <div className="flex justify-center md:p-6">
      <Card className="relative p-2 max-sm:w-full max-sm:border-0 sm:w-96">
        <div className="absolute right-2 top-2">
          <DangerActions
            handleRestart={() => {
              setBalls([]);
              deleteCookie("balls");
            }}
            handleUndo={handleUndo}
          />
        </div>
        <CardContent className="space-y-4 max-sm:p-0">
          <ScoreWrapper
            runs={runs}
            wickets={wickets}
            totalBalls={totalBalls}
            runRate={runRate as number}
          />
          <ul className="flex gap-2 overflow-x-auto">
            {Array.from({ length: ballLimitInOver }, (_, i) => (
              <BallSummary key={i} event={overSummaries[curOverIndex]?.[i]} />
            ))}
          </ul>

          <FooterSummary
            extras={extras}
            curOverRuns={curOverRuns}
            curOverWickets={curOverWickets}
            runRate={runRate}
            ballEvents={balls}
          />
        </CardContent>
        <Separator className="my-4" />
        <ScoreButtons handleScore={handleScore} />
      </Card>
    </div>
  );
}

export default ScorerLayout;
