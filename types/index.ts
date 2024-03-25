import { BallEvent, Match, Player, Team } from "@prisma/client";
import { Dispatch, SetStateAction } from "react";

type EventType = "0" | "1" | "2" | "3" | "4" | "6" | "-1" | "-2" | "-3";

type OverlayStateProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

type TeamWithPlayers = Team & { players: Player[] };

type MatchExtended = Match & {
  teams: TeamWithPlayers[];
  ballEvents: BallEvent[];
};

export type { EventType, OverlayStateProps, TeamWithPlayers, MatchExtended };
