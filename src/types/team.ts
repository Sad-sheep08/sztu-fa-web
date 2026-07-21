import type { Player } from './player';

export interface Team {
  id: string;
  teamName: string;
  teamDoctor: string;
  headCoach: string;
  teamLeader: string;
  coachPhone: string;
  leaderPhone: string;
  homeJerseyColor: string;
  awayJerseyColor: string;
  teamLogo: string;
  homeJersey: string;
  awayJersey: string;
  gender?: string;
  createdAt: string;
  updatedAt: string;
  groupTeams?: { seasonId: string; groupName: string }[];
}

export interface TeamWithPlayers extends Team {
  players: Player[];
}
