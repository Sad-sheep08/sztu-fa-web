import type { Season } from '../../types';
import { SeasonSelector } from '../common';

interface TeamFiltersProps {
  globalSeasons: Season[];
  globalSeasonId: string;
  searchTerm: string;
  onSeasonChange: (seasonId: string) => void;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

const TeamFilters: React.FC<TeamFiltersProps> = ({
  globalSeasons,
  globalSeasonId,
  searchTerm,
  onSeasonChange,
  onSearchTermChange,
  onSearch,
  onReset,
  onKeyDown,
}) => {
  return (
    <>
      {/* 搜索框 */}
      <div className="teamSearch">
        <div className="searchInputWrapper">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="搜索球队名称..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            onKeyDown={onKeyDown}
            className="searchInput"
          />
          {searchTerm && (
            <button onClick={onReset} className="searchClear" aria-label="清除搜索">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
        <button onClick={onSearch} className="searchButton">
          搜索
        </button>
      </div>

      {/* 赛季筛选器 */}
      <div className="filterControls" style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center', margin: '20px 0 25px 0', padding: '15px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>选择赛季:</span>
          <SeasonSelector
            seasons={globalSeasons}
            selectedSeasonId={globalSeasonId}
            onChange={onSeasonChange}
            includeAllOption
          />
        </div>
      </div>
    </>
  );
};

export default TeamFilters;
