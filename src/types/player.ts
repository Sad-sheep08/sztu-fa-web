import type { Team } from './team';

export interface Player {
  id: string;
  name: string;
  studentId: string;
  jerseyNumber: string;
  photo: string;
  teamId: string;
  status?: string;
  yellowCards?: number;
  redCards?: number;
  team?: Team;
  createdAt: string;
  updatedAt: string;
}

export interface PlayerCareerSeason {
  seasonName: string;
  appearances?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

export interface PlayerCareerResponse {
  player?: Player & { team?: Team };
  career?: PlayerCareerSeason[];
}
