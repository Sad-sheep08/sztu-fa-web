import type { Season, StandingRow, CupStandings, SeasonStats } from '../types';
import { BASE_URL } from './http';

export async function fetchSeasons(): Promise<Season[]> {
  const response = await fetch(`${BASE_URL}/seasons`);
  if (!response.ok) throw new Error('获取赛季列表失败');
  return response.json();
}

export async function fetchSeasonStandings(seasonId: string): Promise<StandingRow[] | CupStandings> {
  const response = await fetch(`${BASE_URL}/seasons/${seasonId}/standings`);
  if (!response.ok) throw new Error('获取赛季积分榜失败');
  return response.json();
}

export async function fetchSeasonStats(seasonId: string): Promise<SeasonStats> {
  const response = await fetch(`${BASE_URL}/seasons/${seasonId}/stats`);
  if (!response.ok) throw new Error('获取赛季榜单数据失败');
  return response.json();
}
