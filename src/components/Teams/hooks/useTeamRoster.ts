import { useEffect, useState } from 'react';
import { fetchSeasons, fetchTeamPlayersBySeason } from '../../../api';
import type { Player, Season, Team } from '../../../types';

export const useTeamRoster = (selectedTeam: Team | null) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState('');
  const [displayPlayers, setDisplayPlayers] = useState<Player[]>([]);
  const [playersLoading, setPlayersLoading] = useState(false);
  const [rosterError, setRosterError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedTeam) {
      setSeasons([]);
      setSelectedSeasonId('');
      setRosterError(null);
      return;
    }
    let active = true;
    const loadSeasons = async () => {
      try {
        const seasonsList = await fetchSeasons();
        if (!active) return;
        const filtered = seasonsList.filter((season) =>
          selectedTeam.gender === 'FEMALE'
            ? !season.name.includes('男') && !season.name.includes('男子')
            : !season.name.includes('女') && !season.name.includes('女子'),
        );
        setSeasons(filtered);
        const teamSeasonIds = selectedTeam.groupTeams?.map((item) => item.seasonId) || [];
        const activeSeason =
          filtered.find((season) => season.status === 'active' && teamSeasonIds.includes(season.id)) ||
          filtered.find((season) => season.status === 'active');
        setSelectedSeasonId(activeSeason?.id || filtered[0]?.id || '');
      } catch (loadError) {
        console.error('获取赛季列表失败:', loadError);
      }
    };
    void loadSeasons();
    return () => { active = false; };
  }, [selectedTeam]);

  useEffect(() => {
    if (!selectedTeam || !selectedSeasonId) {
      setDisplayPlayers([]);
      setRosterError(null);
      return;
    }
    let active = true;
    const loadRoster = async () => {
      setPlayersLoading(true);
      setRosterError(null);
      try {
        const roster = await fetchTeamPlayersBySeason(selectedTeam.id, selectedSeasonId);
        if (active) setDisplayPlayers(roster);
      } catch (loadError) {
        console.error('获取球员名单失败:', loadError);
        if (active) {
          setDisplayPlayers([]);
          setRosterError('获取球员花名册失败，请稍后重试');
        }
      } finally {
        if (active) setPlayersLoading(false);
      }
    };
    void loadRoster();
    return () => { active = false; };
  }, [selectedTeam, selectedSeasonId]);

  return {
    seasons, selectedSeasonId, setSelectedSeasonId,
    displayPlayers, playersLoading, rosterError,
  };
};
