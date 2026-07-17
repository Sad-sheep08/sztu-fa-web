import React, { useState, useEffect, useCallback } from 'react';
import './Matches.css';
import type { Match, Team } from '../../types';
import { fetchMatches, fetchTeams, fetchSeasons, fetchPlayerCareer, fetchSeasonStandings, fetchSeasonStats } from '../../api';

// 导入模块化子组件
import { MatchList } from './components/MatchList';
import { LeagueStandings } from './components/LeagueStandings';
import { KnockoutBracket } from './components/KnockoutBracket';
import { ScorerBoard } from './components/ScorerBoard';
import { MatchDetailModal } from './components/MatchDetailModal';
import { PlayerCareerCard } from './components/PlayerCareerCard';

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc';
type StatusFilter = 'all' | 'scheduled' | 'in_progress' | 'completed';

export interface StandingRow {
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

export interface ScorerRow {
  playerId?: string;
  playerName: string;
  jerseyNumber: string;
  teamName: string;
  teamLogo: string;
  goals: number;
}

export interface AssistRow {
  playerId?: string;
  playerName: string;
  jerseyNumber: string;
  teamName: string;
  teamLogo: string;
  assists: number;
}

const Matches: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [matchStats, setMatchStats] = useState({ total: 0, completed: 0, scheduled: 0, ongoing: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(5);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [teamFilter, setTeamFilter] = useState<string>('');
  const [availableTeams, setAvailableTeams] = useState<Team[]>([]);
  const [selectedMatchForModal, setSelectedMatchForModal] = useState<Match | null>(null);
  const [modalTab, setModalTab] = useState<'events' | 'lineups'>('events');

  // 赛季与生涯卡片状态
  const [seasons, setSeasons] = useState<any[]>([]);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string>('');
  const [careerPlayerId, setCareerPlayerId] = useState<string | null>(null);
  const [careerPlayerName, setCareerPlayerName] = useState<string>('');
  const [careerData, setCareerData] = useState<any>(null);
  const [careerLoading, setCareerLoading] = useState(false);

  // 积分与数据统计逻辑
  const [activeTab, setActiveTab] = useState<'matches' | 'standings' | 'bracket' | 'scorers' | 'assists'>('matches');
  const [standings, setStandings] = useState<any>([]);
  const [stats, setStats] = useState<any>({ scorers: [], assists: [], cards: [] });
  const [statsLoading, setStatsLoading] = useState(false);

  const [bracketMatches, setBracketMatches] = useState<Match[]>([]);
  const [bracketLoading, setBracketLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const seasonsList = await fetchSeasons();
        setSeasons(seasonsList);
        const active = seasonsList.find(s => s.status === 'active');
        if (active) {
          setSelectedSeasonId(active.id);
        } else if (seasonsList.length > 0) {
          setSelectedSeasonId(seasonsList[0].id);
        }

        // 获取全部球队列表，支持过滤
        const teamsRes = await fetchTeams(1, 100);
        if (teamsRes && teamsRes.data) {
          setAvailableTeams(teamsRes.data);
        }
      } catch (err) {
        console.error('加载初始数据失败:', err);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    let active = true;
    const loadStatsData = async () => {
      if (!selectedSeasonId) return;
      setStatsLoading(true);
      try {
        const [standingsData, statsData] = await Promise.all([
          fetchSeasonStandings(selectedSeasonId),
          fetchSeasonStats(selectedSeasonId)
        ]);
        if (!active) return;
        setStandings(standingsData);
        setStats(statsData);
      } catch (err) {
        console.error('加载统计数据失败:', err);
      } finally {
        if (active) setStatsLoading(false);
      }
    };
    loadStatsData();
    return () => {
      active = false;
    };
  }, [selectedSeasonId]);

  const loadMatches = useCallback(async (
    page: number,
    status?: string,
    teamId?: string,
    sort?: SortOption,
    seasonId?: string,
    activeToken: { active: boolean } = { active: true }
  ) => {
    setLoading(true);
    setError(null);
    try {
      let filteredTeamId = teamId && teamId !== 'all' ? teamId : undefined;
      const response = await fetchMatches(page, limit, filteredTeamId, seasonId, status);
      
      if (!activeToken.active) return;
      
      let sortedMatches = [...response.data];
      
      if (sort) {
        sortedMatches.sort((a, b) => {
          const dateA = a.matchDate ? new Date(a.matchDate).getTime() : 0;
          const dateB = b.matchDate ? new Date(b.matchDate).getTime() : 0;
          
          switch (sort) {
            case 'date-desc':
              return dateB - dateA;
            case 'date-asc':
              return dateA - dateB;
            case 'score-desc': {
              const totalScoreA = (a.homeScore || 0) + (a.awayScore || 0);
              const totalScoreB = (b.homeScore || 0) + (b.awayScore || 0);
              return totalScoreB - totalScoreA;
            }
            case 'score-asc': {
              const scoreA = (a.homeScore || 0) + (a.awayScore || 0);
              const scoreB = (b.homeScore || 0) + (b.awayScore || 0);
              return scoreA - scoreB;
            }
            default:
              return 0;
          }
        });
      }
      
      setMatches(sortedMatches);
      setTotal(response.total);
      
      if (response.stats) {
        setMatchStats(response.stats);
      } else {
        setMatchStats({
          total: response.total,
          completed: sortedMatches.filter((m) => m.status === 'completed').length,
          scheduled: sortedMatches.filter((m) => m.status === 'scheduled').length,
          ongoing: sortedMatches.filter((m) => m.status === 'in_progress').length,
        });
      }
    } catch (err) {
      if (activeToken.active) {
        setError(err instanceof Error ? err.message : '加载比赛数据失败');
      }
      console.error(err);
    } finally {
      if (activeToken.active) {
        setLoading(false);
      }
    }
  }, [limit]);

  useEffect(() => {
    const activeToken = { active: true };
    loadMatches(1, statusFilter, teamFilter, sortBy, selectedSeasonId, activeToken);
    return () => {
      activeToken.active = false;
    };
  }, [statusFilter, teamFilter, sortBy, selectedSeasonId, loadMatches]);

  const loadBracketMatches = useCallback(async () => {
    if (!selectedSeasonId) return;
    setBracketLoading(true);
    try {
      const response = await fetchMatches(1, 200, undefined, selectedSeasonId);
      const filtered = (response.data || []).filter((m: any) => m.stage === 'KNOCKOUT');
      setBracketMatches(filtered);
    } catch (err) {
      console.error('加载淘汰赛比赛失败:', err);
    } finally {
      setBracketLoading(false);
    }
  }, [selectedSeasonId]);

  useEffect(() => {
    if (activeTab === 'bracket') {
      loadBracketMatches();
    }
  }, [activeTab, loadBracketMatches]);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
      loadMatches(page, statusFilter, teamFilter, sortBy, selectedSeasonId);
    }
  };

  const handlePlayerClick = async (playerId: string, playerName: string) => {
    if (!playerId) return;
    setCareerPlayerId(playerId);
    setCareerPlayerName(playerName);
    setCareerLoading(true);
    setCareerData(null);
    try {
      const apiResponse = await fetchPlayerCareer(playerId);
      if (apiResponse && apiResponse.player) {
        const playerObj = apiResponse.player;
        const careerList = apiResponse.career || [];
        
        let totalMatches = 0;
        let totalGoals = 0;
        let totalAssists = 0;
        let totalYellow = 0;
        let totalRed = 0;
        
        careerList.forEach((c: any) => {
          totalMatches += c.appearances || 0;
          totalGoals += c.goals || 0;
          totalAssists += c.assists || 0;
          totalYellow += c.yellowCards || 0;
          totalRed += c.redCards || 0;
        });

        const structuredData = {
          jerseyNumber: playerObj.jerseyNumber || '#',
          teamName: playerObj.team?.teamName || '暂无队伍',
          status: playerObj.status || 'active',
          photo: playerObj.photo || null,
          summary: {
            totalMatches,
            totalGoals,
            totalAssists,
            totalYellow,
            totalRed
          },
          seasons: careerList.map((c: any) => ({
            seasonName: c.seasonName,
            matchesPlayed: c.appearances || 0,
            goals: c.goals || 0,
            assists: c.assists || 0,
            yellowCards: c.yellowCards || 0,
            redCards: c.redCards || 0
          }))
        };
        
        setCareerData(structuredData);
      } else {
        console.error('返回数据格式不正确:', apiResponse);
      }
    } catch (err) {
      console.error('加载球员生涯数据失败:', err);
    } finally {
      setCareerLoading(false);
    }
  };

  const getScorers = (): ScorerRow[] => {
    return (stats.scorers || []).slice(0, 10);
  };

  const getAssists = (): AssistRow[] => {
    return (stats.assists || []).slice(0, 10);
  };

  const upcomingMatches = matches
    .filter(m => m.status === 'scheduled')
    .sort((a, b) => new Date(a.matchDate).getTime() - new Date(b.matchDate).getTime())
    .slice(0, 3);

  const handleMatchClick = (match: Match) => {
    setSelectedMatchForModal(match);
    setModalTab('events');
  };

  return (
    <section className="matches" id="matches">
      <div className="matchesContainer">
        <div className="sectionHeader">
          <span className="sectionTag">赛事公告</span>
          <h2 className="sectionTitle">
            赛事<span>安排</span>
          </h2>
          <p className="sectionDescription">
            了解最新赛事安排，见证精彩对决
          </p>
        </div>

        {/* 导航标签卡与赛季选择器 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '30px' }}>
          <div className="matchesTabs" style={{ margin: 0 }}>
            <button
              className={`tabButton ${activeTab === 'matches' ? 'active' : ''}`}
              onClick={() => setActiveTab('matches')}
            >
              📅 赛程安排
            </button>
            <button
              className={`tabButton ${activeTab === 'standings' ? 'active' : ''}`}
              onClick={() => setActiveTab('standings')}
            >
              🏆 积分榜
            </button>
            {seasons.find(s => s.id === selectedSeasonId)?.type === 'CUP' && (
              <button
                className={`tabButton ${activeTab === 'bracket' ? 'active' : ''}`}
                onClick={() => setActiveTab('bracket')}
              >
                🌳 淘汰赛对阵
              </button>
            )}
            <button
              className={`tabButton ${activeTab === 'scorers' ? 'active' : ''}`}
              onClick={() => setActiveTab('scorers')}
            >
              ⚽ 射手榜
            </button>
            <button
              className={`tabButton ${activeTab === 'assists' ? 'active' : ''}`}
              onClick={() => setActiveTab('assists')}
            >
              🎯 助攻榜
            </button>
          </div>

          {seasons.length > 0 && (
            <div className="season-selector-container">
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)' }}>📅 选择赛季:</span>
              <select
                value={selectedSeasonId}
                onChange={(e) => setSelectedSeasonId(e.target.value)}
                className="season-select-element"
              >
                {seasons.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.status === 'active' ? '(当前赛季)' : '(往期归档)'}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* 赛程列表 Tab */}
        {activeTab === 'matches' && (
          <MatchList
            matches={matches}
            loading={loading}
            error={error}
            teamFilter={teamFilter}
            statusFilter={statusFilter}
            sortBy={sortBy}
            availableTeams={availableTeams}
            currentPage={currentPage}
            limit={limit}
            total={total}
            matchStats={matchStats}
            upcomingMatches={upcomingMatches}
            onTeamFilterChange={setTeamFilter}
            onStatusFilterChange={setStatusFilter}
            onSortByChange={setSortBy}
            onPageChange={handlePageChange}
            onMatchClick={handleMatchClick}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {/* 积分榜 Tab */}
        {activeTab === 'standings' && (
          <LeagueStandings
            standings={standings}
            statsLoading={statsLoading}
          />
        )}

        {/* 淘汰赛对阵 Tab */}
        {activeTab === 'bracket' && (
          <KnockoutBracket
            bracketMatches={bracketMatches}
            bracketLoading={bracketLoading}
            onMatchClick={handleMatchClick}
          />
        )}

        {/* 射手/助攻榜 Tab */}
        {(activeTab === 'scorers' || activeTab === 'assists') && (
          <ScorerBoard
            activeTab={activeTab}
            scorers={getScorers()}
            assists={getAssists()}
            statsLoading={statsLoading}
            onPlayerClick={handlePlayerClick}
          />
        )}

        {/* 比赛详情弹窗 */}
        <MatchDetailModal
          selectedMatchForModal={selectedMatchForModal}
          modalTab={modalTab}
          onClose={() => setSelectedMatchForModal(null)}
          onTabChange={setModalTab}
          onPlayerClick={handlePlayerClick}
        />

        {/* 球员跨赛季“生涯数据球星卡” */}
        <PlayerCareerCard
          careerPlayerId={careerPlayerId}
          careerPlayerName={careerPlayerName}
          careerData={careerData}
          careerLoading={careerLoading}
          onClose={() => setCareerPlayerId(null)}
        />
      </div>
    </section>
  );
};

export default Matches;