export interface PlayerMiLB {
  id: string;
  rank: number;
  image: string;
  fullName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  team: {
    id: string;
    name: string;
    image: string;
  };
  stat: {
    gamesPlayed: number;
    wins: number;
    losses: number;
    inningsPitched: number;
    strikeOuts: number;
    shutouts: number;
    mWar: number;
    mWarChange: number;
  };
}

export interface PlayerMLB {
  season: string;
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  team: {
    id: string;
    name: string;
    image: string;
  };
  stat: {
    war: number;
    mWar: number;
    mWarError: number;
  };
}
