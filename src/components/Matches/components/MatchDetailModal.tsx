import React from 'react';
import type { Match } from '../../../types';

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

interface MatchDetailModalProps {
  selectedMatchForModal: Match | null;
  modalTab: 'events' | 'lineups';
  onClose: () => void;
  onTabChange: (tab: 'events' | 'lineups') => void;
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

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  selectedMatchForModal,
  modalTab,
  onClose,
  onTabChange,
  onPlayerClick,
}) => {
  if (!selectedMatchForModal) return null;

  return (
    <div className="matchModalOverlay" onClick={onClose}>
      <div className="matchModal" onClick={(e) => e.stopPropagation()}>
        <button className="matchModalClose" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        
        <div className="matchModalHeader">
          <span className="matchModalStatus" style={{ backgroundColor: statusColors[selectedMatchForModal.status] }}>
            {statusMap[selectedMatchForModal.status]}
          </span>
          <span className="matchModalHeaderTitle">赛事回顾</span>
        </div>

        <div className="matchModalBody">
          <div className="matchScoreBoxLarge">
            <div className="modalTeam">
              <div className="modalTeamLogo">
                <img src={selectedMatchForModal.homeTeam.teamLogo || 'https://picsum.photos/seed/matchlogo/100/100'} alt={selectedMatchForModal.homeTeam.teamName} />
              </div>
              <span className="modalTeamName">{selectedMatchForModal.homeTeam.teamName}</span>
            </div>
            <div className="modalScore">
              <span className="modalScoreNumber">{selectedMatchForModal.status === 'scheduled' ? '-' : selectedMatchForModal.homeScore}</span>
              <span className="modalScoreSeparator">:</span>
              <span className="modalScoreNumber">{selectedMatchForModal.status === 'scheduled' ? '-' : selectedMatchForModal.awayScore}</span>
            </div>
            <div className="modalTeam">
              <div className="modalTeamLogo">
                <img src={selectedMatchForModal.awayTeam.teamLogo || 'https://picsum.photos/seed/matchlogo/100/100'} alt={selectedMatchForModal.awayTeam.teamName} />
              </div>
              <span className="modalTeamName">{selectedMatchForModal.awayTeam.teamName}</span>
            </div>
          </div>

          <div className="matchInfoDetails">
            <div className="infoItem">
              <span className="infoIcon">📍</span>
              <div className="infoContent">
                <span className="infoLabel">比赛地点</span>
                <span className="infoValue">{selectedMatchForModal.location || '学校足球场'}</span>
              </div>
            </div>
            <div className="infoItem">
              <span className="infoIcon">📅</span>
              <div className="infoContent">
                <span className="infoLabel">比赛时间</span>
                <span className="infoValue">{formatDate(selectedMatchForModal.matchDate)}</span>
              </div>
            </div>
            {selectedMatchForModal.mvpPlayerName && (
              <div 
                className="infoItem" 
                style={{ cursor: selectedMatchForModal.mvpPlayerId ? 'pointer' : 'default' }} 
                onClick={() => selectedMatchForModal.mvpPlayerId && onPlayerClick(selectedMatchForModal.mvpPlayerId, selectedMatchForModal.mvpPlayerName || '')}
              >
                <span className="infoIcon">🏆</span>
                <div className="infoContent">
                  <span className="infoLabel">本场最佳 (MVP)</span>
                  <span className="infoValue" style={{ fontWeight: 'bold', color: '#e65100', textDecoration: selectedMatchForModal.mvpPlayerId ? 'underline' : 'none' }}>
                    {selectedMatchForModal.mvpPlayerName}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* 详情弹窗标签页切换 */}
          <div className="modalTabContainer" style={{ display: 'flex', borderBottom: '2px solid var(--border-color, #eee)', marginBottom: '20px', gap: '15px' }}>
            <button
              className={`modalTabButton ${modalTab === 'events' ? 'active' : ''}`}
              onClick={() => onTabChange('events')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: modalTab === 'events' ? 'var(--primary-color)' : 'var(--text-light)',
                borderBottom: modalTab === 'events' ? '3px solid var(--primary-color)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '-2px'
              }}
            >
              📝 关键事件
            </button>
            <button
              className={`modalTabButton ${modalTab === 'lineups' ? 'active' : ''}`}
              onClick={() => onTabChange('lineups')}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                color: modalTab === 'lineups' ? 'var(--primary-color)' : 'var(--text-light)',
                borderBottom: modalTab === 'lineups' ? '3px solid var(--primary-color)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '-2px'
              }}
            >
              🏃‍♂️ 双方阵容
            </button>
          </div>

          {/* 关键事件面板 */}
          {modalTab === 'events' && (
            selectedMatchForModal.events && selectedMatchForModal.events.length > 0 ? (
              <div className="matchEventsSection modalEvents" style={{ marginTop: 0 }}>
                <h3 className="eventsTitle">📝 比赛关键事件回顾</h3>
                <div className="unifiedTimeline">
                  {selectedMatchForModal.events
                    .sort((a, b) => {
                      const parseTime = (t: any) => {
                        const cleaned = String(t || '').replace(/'/g, '');
                        if (cleaned.includes('+')) {
                          const parts = cleaned.split('+');
                          return (parseInt(parts[0]) || 0) + (parseInt(parts[1]) || 0) / 100;
                        }
                        return parseInt(cleaned) || 0;
                      };
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
                      const isHome = e.teamType === 'home';
                      const teamName = isHome ? selectedMatchForModal.homeTeam.teamName : selectedMatchForModal.awayTeam.teamName;
                      const teamLogo = isHome ? selectedMatchForModal.homeTeam.teamLogo : selectedMatchForModal.awayTeam.teamLogo;
                      
                      return (
                        <div key={i} className={`timelineRow ${isHome ? 'rowHome' : 'rowAway'}`}>
                          <div className="timelineDotContainer">
                            <span className="eventTime">{e.eventTime}</span>
                            <span className={`eventIconContainer eventIcon-${e.eventType}`}>
                              {icon}
                            </span>
                          </div>
                          <div className="timelineEventCard">
                            <div className="eventCardHeader">
                              <img className="miniTeamLogo" src={teamLogo || 'https://picsum.photos/seed/logo/20/20'} alt={teamName} />
                              <span className="miniTeamName">{teamName}</span>
                            </div>
                            <span className="eventDesc">
                              {e.eventType === 'substitution' ? (
                                <span>
                                  换上 <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={() => e.playerId && onPlayerClick(e.playerId, e.playerName || '')}>{e.playerName} ({e.jerseyNumber}号)</strong>，换下 <strong style={{ cursor: e.subPlayerId ? 'pointer' : 'default', textDecoration: e.subPlayerId ? 'underline' : 'none', color: e.subPlayerId ? 'var(--primary-color)' : 'inherit' }} onClick={() => e.subPlayerId && onPlayerClick(e.subPlayerId, e.subPlayerName || '')}>{e.subPlayerName} ({e.subJerseyNumber}号)</strong>
                                </span>
                              ) : e.eventType === 'own_goal' ? (
                                <span>
                                  <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={() => e.playerId && onPlayerClick(e.playerId, e.playerName || '')}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="ownGoalBadge">乌龙球</span>
                                </span>
                              ) : e.eventType === 'penalty' ? (
                                <span>
                                  <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={() => e.playerId && onPlayerClick(e.playerId, e.playerName || '')}>{e.playerName} ({e.jerseyNumber}号)</strong> <span className="penaltyBadge">点球</span>
                                  {e.assistPlayerName && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                      (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={() => e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || '')}>{e.assistPlayerName}</strong>)
                                    </span>
                                  )}
                                </span>
                              ) : (
                                <span>
                                  <strong style={{ cursor: e.playerId ? 'pointer' : 'default', textDecoration: e.playerId ? 'underline' : 'none', color: e.playerId ? 'var(--primary-color)' : 'inherit' }} onClick={() => e.playerId && onPlayerClick(e.playerId, e.playerName || '')}>{e.playerName ? `${e.playerName} (${e.jerseyNumber}号)` : ''}</strong>{' '}
                                  {e.eventType === 'yellow_card' ? '黄牌' :
                                   e.eventType === 'red_card' ? '红牌' : e.eventType === 'yellow_to_red' ? '两黄变一红' :
                                   e.eventType === 'goal' ? '进球' :
                                   e.eventType === 'penalty_shootout_goal' ? '点球大战进球' :
                                   e.eventType === 'penalty_shootout_miss' ? '点球大战罚失' :
                                   e.eventType === 'penalty_miss' ? '点球罚失' :
                                   (e.description || '事件')}
                                  {e.eventType === 'goal' && e.assistPlayerName && (
                                    <span style={{ fontSize: '0.85rem', color: 'var(--primary-color)', marginLeft: '6px', fontStyle: 'italic' }}>
                                      (助攻: <strong style={{ cursor: e.assistPlayerId ? 'pointer' : 'default', textDecoration: e.assistPlayerId ? 'underline' : 'none' }} onClick={() => e.assistPlayerId && onPlayerClick(e.assistPlayerId, e.assistPlayerName || '')}>{e.assistPlayerName}</strong>)
                                    </span>
                                  )}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="noEventsMessage">
                ⚽ 暂无比赛事件记录
              </div>
            )
          )}

          {/* 阵容对比面板 */}
          {modalTab === 'lineups' && (
            <div className="modalLineupsContainer" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', padding: '10px 0' }}>
              {/* 主队阵容 */}
              <div className="modalLineupColumn">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid var(--border-color)', paddingBottom: '6px' }}>
                  {selectedMatchForModal.homeTeam.teamName} (主)
                </h3>
                
                <div className="lineupSubSection">
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '10px', borderLeft: '3px solid #4caf50', paddingLeft: '8px' }}>首发球员</h4>
                  <div className="lineupPlayersList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(!selectedMatchForModal.lineups || selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'home' && l.lineupType === 'starting').length === 0) ? (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic', paddingLeft: '8px' }}>未公布首发</span>
                    ) : (
                      selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'home' && l.lineupType === 'starting').map((l: any) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: 'var(--bg-light, #f8f9fa)', borderRadius: '8px', fontSize: '0.95rem' }}>
                          <span style={{ fontWeight: 800, color: '#4caf50', minWidth: '24px' }}>#{l.player?.jerseyNumber ?? ''}</span>
                          <strong
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-color)' }}
                            onClick={() => onPlayerClick(l.playerId, l.player?.name || '')}
                          >
                            {l.player?.name || '未知球员'}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="lineupSubSection" style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '10px', borderLeft: '3px solid #2196f3', paddingLeft: '8px' }}>替补席</h4>
                  <div className="lineupPlayersList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(!selectedMatchForModal.lineups || selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'home' && l.lineupType === 'substitute').length === 0) ? (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic', paddingLeft: '8px' }}>未公布替补</span>
                    ) : (
                      selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'home' && l.lineupType === 'substitute').map((l: any) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: 'var(--bg-light, #f8f9fa)', borderRadius: '8px', fontSize: '0.95rem' }}>
                          <span style={{ fontWeight: 800, color: '#2196f3', minWidth: '24px' }}>#{l.player?.jerseyNumber ?? ''}</span>
                          <strong
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-color)' }}
                            onClick={() => onPlayerClick(l.playerId, l.player?.name || '')}
                          >
                            {l.player?.name || '未知球员'}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* 客队阵容 */}
              <div className="modalLineupColumn">
                <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: 'var(--primary-color)', marginBottom: '15px', borderBottom: '2px solid var(--border-color)', paddingBottom: '6px' }}>
                  {selectedMatchForModal.awayTeam.teamName} (客)
                </h3>
                
                <div className="lineupSubSection">
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '10px', borderLeft: '3px solid #4caf50', paddingLeft: '8px' }}>首发球员</h4>
                  <div className="lineupPlayersList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(!selectedMatchForModal.lineups || selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'away' && l.lineupType === 'starting').length === 0) ? (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic', paddingLeft: '8px' }}>未公布首发</span>
                    ) : (
                      selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'away' && l.lineupType === 'starting').map((l: any) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: 'var(--bg-light, #f8f9fa)', borderRadius: '8px', fontSize: '0.95rem' }}>
                          <span style={{ fontWeight: 800, color: '#4caf50', minWidth: '24px' }}>#{l.player?.jerseyNumber ?? ''}</span>
                          <strong
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-color)' }}
                            onClick={() => onPlayerClick(l.playerId, l.player?.name || '')}
                          >
                            {l.player?.name || '未知球员'}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="lineupSubSection" style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-color)', marginBottom: '10px', borderLeft: '3px solid #2196f3', paddingLeft: '8px' }}>替补席</h4>
                  <div className="lineupPlayersList" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(!selectedMatchForModal.lineups || selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'away' && l.lineupType === 'substitute').length === 0) ? (
                      <span style={{ color: 'var(--text-light)', fontSize: '0.9rem', fontStyle: 'italic', paddingLeft: '8px' }}>未公布替补</span>
                    ) : (
                      selectedMatchForModal.lineups.filter((l: any) => l.teamType === 'away' && l.lineupType === 'substitute').map((l: any) => (
                        <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px', backgroundColor: 'var(--bg-light, #f8f9fa)', borderRadius: '8px', fontSize: '0.95rem' }}>
                          <span style={{ fontWeight: 800, color: '#2196f3', minWidth: '24px' }}>#{l.player?.jerseyNumber ?? ''}</span>
                          <strong
                            style={{ cursor: 'pointer', textDecoration: 'underline', color: 'var(--text-color)' }}
                            onClick={() => onPlayerClick(l.playerId, l.player?.name || '')}
                          >
                            {l.player?.name || '未知球员'}
                          </strong>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
