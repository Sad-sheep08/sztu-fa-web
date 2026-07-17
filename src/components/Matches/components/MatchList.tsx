import React from 'react';
import type { Match, Team } from '../../../types';

type SortOption = 'date-desc' | 'date-asc' | 'score-desc' | 'score-asc';
type StatusFilter = 'all' | 'scheduled' | 'in_progress' | 'completed';

const statusMap: Record<string, string> = {
  scheduled: '即将开始',
  in_progress: '进行中',
  completed: '已结束',
};

const statusColors: Record<string, string> = {
  scheduled: 'var(--primary-light)',
  in_progress: 'var(--primary-color)',
  completed: 'var(--text-light)',
};

interface MatchListProps {
  matches: Match[];
  loading: boolean;
  error: string | null;
  teamFilter: string;
  statusFilter: StatusFilter;
  sortBy: SortOption;
  availableTeams: Team[];
  currentPage: number;
  limit: number;
  total: number;
  matchStats: { total: number; completed: number; scheduled: number; ongoing: number };
  upcomingMatches: Match[];
  onTeamFilterChange: (teamId: string) => void;
  onStatusFilterChange: (status: StatusFilter) => void;
  onSortByChange: (sortBy: SortOption) => void;
  onPageChange: (page: number) => void;
  onMatchClick: (match: Match) => void;
  onPlayerClick: (playerId: string, playerName: string) => void;
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const MatchList: React.FC<MatchListProps> = ({
  matches,
  loading,
  error,
  teamFilter,
  statusFilter,
  sortBy,
  availableTeams,
  currentPage,
  limit,
  total,
  matchStats,
  upcomingMatches,
  onTeamFilterChange,
  onStatusFilterChange,
  onSortByChange,
  onPageChange,
  onMatchClick,
  onPlayerClick,
}) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <>
      {/* 赛程过滤与排序工具栏 */}
      <div className="matches-filter-bar">
        {/* 球队筛选 */}
        <div className="filter-item-wrapper">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>🛡️ 筛选球队</span>
          <select
            value={teamFilter}
            onChange={(e) => onTeamFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="">全部球队</option>
            {availableTeams.map(t => (
              <option key={t.id} value={t.id}>{t.teamName}</option>
            ))}
          </select>
        </div>

        {/* 比赛状态筛选 */}
        <div className="filter-item-wrapper">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>⏳ 比赛状态</span>
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as StatusFilter)}
            className="filter-select"
          >
            <option value="all">全部比赛</option>
            <option value="scheduled">即将开始</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已结束</option>
          </select>
        </div>

        {/* 排序方式 */}
        <div className="filter-item-wrapper">
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>🔃 排序方式</span>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            className="filter-select"
          >
            <option value="date-desc">按时间 (从近到远)</option>
            <option value="date-asc">按时间 (从远到近)</option>
            <option value="score-desc">按总比分 (从大到小)</option>
            <option value="score-asc">按总比分 (从小到大)</option>
          </select>
        </div>
      </div>

      {/* 错误提示 */}
      {error && (
        <div className="errorMessage">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}

      {/* 加载状态 */}
      {loading ? (
        <div className="loadingContainer">
          <div className="loadingSpinner"></div>
          <p>加载中...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="emptyState">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <p>暂无比赛数据</p>
        </div>
      ) : (
        <div className="matchesLayout">
          {/* 赛事列表 */}
          <div className="matchesList">
            {matches.map((match) => (
              <div key={match.id} className="matchCard" onClick={() => onMatchClick(match)}>
                <div className="matchHeader">
                  <span
                    className="matchStatus"
                    style={{ backgroundColor: statusColors[match.status] }}
                  >
                    {statusMap[match.status]}
                  </span>
                  <span className="matchDate">{formatDate(match.matchDate)}</span>
                </div>

                <div className="matchContent">
                  <div className="matchTeam">
                    <div className="matchTeamLogo">
                      <img
                        src={match.homeTeam.teamLogo || 'https://picsum.photos/seed/matchlogo/100/100'}
                        alt={match.homeTeam.teamName}
                        loading="lazy"
                      />
                    </div>
                    <span className="matchTeamName">{match.homeTeam.teamName}</span>
                  </div>

                  <div className="matchScoreBox">
                    <div className="matchScore">
                      <span className="matchScoreNumber">
                        {match.status === 'scheduled' ? '-' : match.homeScore}
                      </span>
                      <span className="matchScoreSeparator">:</span>
                      <span className="matchScoreNumber">
                        {match.status === 'scheduled' ? '-' : match.awayScore}
                      </span>
                    </div>
                    {match.status === 'in_progress' && (
                      <span className="liveBadge">LIVE</span>
                    )}
                  </div>

                  <div className="matchTeam">
                    <div className="matchTeamLogo">
                      <img
                        src={match.awayTeam.teamLogo || 'https://picsum.photos/seed/matchlogo/100/100'}
                        alt={match.awayTeam.teamName}
                        loading="lazy"
                      />
                    </div>
                    <span className="matchTeamName">{match.awayTeam.teamName}</span>
                  </div>
                </div>

                {/* 进球与事件面板 */}
                {match.status === 'completed' && match.events && match.events.length > 0 && (
                  <div className="matchEventsSection">
                    <div className="eventsGrid">
                      {/* 主队事件 */}
                      <div className="teamEvents homeEvents">
                        <div className="eventLabel">
                          <span className="fullTeamName">👕 {match.homeTeam.teamName} 事件</span>
                          <span className="shortTeamName">👕 主队</span>
                        </div>
                        <div className="eventsTimeline">
                          {match.events
                            .filter(e => e.teamType === 'home')
                            .sort((a, b) => {
                              const parseTime = (t: any) => parseInt(String(t || '').replace(/'/g, '')) || 0;
                              return parseTime(a.eventTime) - parseTime(b.eventTime);
                            })
                            .map((e, i) => {
                              const icon = e.eventType === 'goal' ? '⚽' :
                                           e.eventType === 'own_goal' ? '🥅' :
                                           e.eventType === 'penalty' ? '🎯' :
                                           e.eventType === 'yellow_card' ? '🟨' :
                                           e.eventType === 'red_card' ? '🟥' : e.eventType === 'yellow_to_red' ? '\uD83D\uDFE8\uD83D\uDFE5' :
                                           e.eventType === 'substitution' ? '🔄' :
                                           e.eventType === 'penalty_shootout_goal' ? '⚽' :
                                           e.eventType === 'penalty_shootout_miss' ? '❌' :
                                           e.eventType === 'penalty_miss' ? '❌' : '📢';
                              return (
                                <div key={i} className="timelineItem">
                                  <span className="eventTime">{e.eventTime}</span>
                                  <span className="eventIcon">{icon}</span>
                                  <span className="eventDesc">
                                    {e.eventType === 'substitution' ? (
                                      <span>
                                        换上 <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong>，换下 <strong style={{ cursor: e.subPlayerId ? 'pointer' : 'default', textDecoration: e.subPlayerId ? 'underline' : 'none', color: e.subPlayerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.subPlayerId && onPlayerClick(e.subPlayerId, e.subPlayerName || ''); }}>{e.subPlayerName} ({e.subJerseyNumber}号)</strong>
                                      </span>
                                    ) : e.eventType === 'own_goal' ? (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="ownGoalBadge">乌龙球</span>
                                      </span>
                                    ) : e.eventType === 'penalty' ? (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="penaltyBadge">点球</span>
                                        {e.assistPlayerName && (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                            (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={(evt) => { evt.stopPropagation(); e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || ''); }}>{e.assistPlayerName}</strong>)
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName ? `${e.playerName} (${e.jerseyNumber}号)` : ''}</strong>{' '}
                                        {e.eventType === 'yellow_card' ? '黄牌' :
                                         e.eventType === 'red_card' ? '红牌' : e.eventType === 'yellow_to_red' ? '两黄变一红' :
                                         e.eventType === 'goal' ? '进球' :
                                         e.eventType === 'penalty_shootout_goal' ? '点球大战进球' :
                                         e.eventType === 'penalty_shootout_miss' ? '点球大战罚失' :
                                         e.eventType === 'penalty_miss' ? '点球罚失' :
                                         (e.description || '事件')}
                                        {e.eventType === 'goal' && e.assistPlayerName && (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                            (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={(evt) => { evt.stopPropagation(); e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || ''); }}>{e.assistPlayerName}</strong>)
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          {match.events.filter(e => e.teamType === 'home').length === 0 && (
                            <div className="noEvents">暂无事件记录</div>
                          )}
                        </div>
                      </div>

                      <div className="eventsGridDivider"></div>

                      {/* 客队事件 */}
                      <div className="teamEvents awayEvents">
                        <div className="eventLabel">
                          <span className="fullTeamName">👚 {match.awayTeam.teamName} 事件</span>
                          <span className="shortTeamName">👚 客队</span>
                        </div>
                        <div className="eventsTimeline">
                          {match.events
                            .filter(e => e.teamType === 'away')
                            .sort((a, b) => {
                              const parseTime = (t: any) => parseInt(String(t || '').replace(/'/g, '')) || 0;
                              return parseTime(a.eventTime) - parseTime(b.eventTime);
                            })
                            .map((e, i) => {
                              const icon = e.eventType === 'goal' ? '⚽' :
                                           e.eventType === 'own_goal' ? '🥅' :
                                           e.eventType === 'penalty' ? '🎯' :
                                           e.eventType === 'yellow_card' ? '🟨' :
                                           e.eventType === 'red_card' ? '🟥' : e.eventType === 'yellow_to_red' ? '\uD83D\uDFE8\uD83D\uDFE5' :
                                           e.eventType === 'substitution' ? '🔄' :
                                           e.eventType === 'penalty_shootout_goal' ? '⚽' :
                                           e.eventType === 'penalty_shootout_miss' ? '❌' :
                                           e.eventType === 'penalty_miss' ? '❌' : '📢';
                              return (
                                <div key={i} className="timelineItem">
                                  <span className="eventTime">{e.eventTime}</span>
                                  <span className="eventIcon">{icon}</span>
                                  <span className="eventDesc">
                                    {e.eventType === 'substitution' ? (
                                      <span>
                                        换上 <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong>，换下 <strong style={{ cursor: e.subPlayerId ? 'pointer' : 'default', textDecoration: e.subPlayerId ? 'underline' : 'none', color: e.subPlayerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.subPlayerId && onPlayerClick(e.subPlayerId, e.subPlayerName || ''); }}>{e.subPlayerName} ({e.subJerseyNumber}号)</strong>
                                      </span>
                                    ) : e.eventType === 'own_goal' ? (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="ownGoalBadge">乌龙球</span>
                                      </span>
                                    ) : e.eventType === 'penalty' ? (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="penaltyBadge">点球</span>
                                        {e.assistPlayerName && (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                            (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={(evt) => { evt.stopPropagation(); e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || ''); }}>{e.assistPlayerName}</strong>)
                                          </span>
                                        )}
                                      </span>
                                    ) : (
                                      <span>
                                        <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={(evt) => { evt.stopPropagation(); e.playerId && onPlayerClick(e.playerId, e.playerName || ''); }}>{e.playerName ? `${e.playerName} (${e.jerseyNumber}号)` : ''}</strong>{' '}
                                        {e.eventType === 'yellow_card' ? '黄牌' :
                                         e.eventType === 'red_card' ? '红牌' : e.eventType === 'yellow_to_red' ? '两黄变一红' :
                                         e.eventType === 'goal' ? '进球' :
                                         e.eventType === 'penalty_shootout_goal' ? '点球大战进球' :
                                         e.eventType === 'penalty_shootout_miss' ? '点球大战罚失' :
                                         e.eventType === 'penalty_miss' ? '点球罚失' :
                                         (e.description || '事件')}
                                        {e.eventType === 'goal' && e.assistPlayerName && (
                                          <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                            (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={(evt) => { evt.stopPropagation(); e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || ''); }}>{e.assistPlayerName}</strong>)
                                          </span>
                                        )}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              );
                            })}
                          {match.events.filter(e => e.teamType === 'away').length === 0 && (
                            <div className="noEvents">暂无事件记录</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="matchFooter">
                  <div className="matchDetail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {match.location}
                  </div>
                  <div className="matchDetail">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {new Date(match.matchDate).toLocaleDateString('zh-CN')}
                  </div>
                  {match.mvpPlayerName && (
                    <div className="matchDetail" style={{ color: '#e65100', fontWeight: 'bold', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={(evt) => { evt.stopPropagation(); match.mvpPlayerId && onPlayerClick(match.mvpPlayerId, match.mvpPlayerName || ''); }}>
                      🏆 MVP: <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>{match.mvpPlayerName}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* 分页 */}
            {total > limit && (
              <div className="pagination">
                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="paginationButton"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <div className="paginationNumbers">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`paginationNumber ${currentPage === page ? 'active' : ''}`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="paginationButton"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="matchesSidebar">
            {/* 即将开始的赛事 */}
            <div className="upcomingSection">
              <h3 className="sectionTitleSmall">即将开始</h3>
              {upcomingMatches.length > 0 ? (
                <div className="upcomingList">
                  {upcomingMatches.map((match) => (
                    <div key={match.id} className="upcomingItem">
                      <div className="upcomingDate">
                        <span className="upcomingDay">
                          {new Date(match.matchDate).getDate()}
                        </span>
                        <span className="upcomingMonth">
                          {new Date(match.matchDate).toLocaleDateString('zh-CN', { month: 'short' })}
                        </span>
                      </div>
                      <div className="upcomingInfo">
                        <div className="upcomingTeams">
                          {match.homeTeam.teamName} vs {match.awayTeam.teamName}
                        </div>
                        <div className="upcomingTime">
                          {new Date(match.matchDate).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="emptyUpcoming">
                  <p>暂无即将开始的比赛</p>
                </div>
              )}
            </div>

            {/* 统计信息 */}
            <div className="statsSection">
              <h3 className="sectionTitleSmall">赛事统计</h3>
              <div className="statsGrid">
                <div className="statCard">
                  <span className="statValue">{matchStats.total}</span>
                  <span className="statLabel">总比赛数</span>
                </div>
                <div className="statCard">
                  <span className="statValue">{matchStats.completed}</span>
                  <span className="statLabel">已结束</span>
                </div>
                <div className="statCard">
                  <span className="statValue">{matchStats.scheduled}</span>
                  <span className="statLabel">即将开始</span>
                </div>
                <div className="statCard">
                  <span className="statValue">{matchStats.ongoing}</span>
                  <span className="statLabel">进行中</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
