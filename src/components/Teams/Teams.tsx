import { useState } from 'react';
import './Teams.css';
import type { Team } from '../../types';
import TeamCard from './TeamCard';
import TeamFilters from './TeamFilters';
import TeamModal from './TeamModal';
import { useTeamDirectory, useTeamRoster } from './hooks';

const Teams: React.FC = () => {
  const directory = useTeamDirectory();
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const roster = useTeamRoster(selectedTeam);

  return (
    <section className="teams" id="teams">
      <div className="teamsContainer">
        <div className="sectionHeader">
          <span className="sectionTag">球队信息</span>
          <h2 className="sectionTitle">我们的<span>球队</span></h2>
          <p className="sectionDescription">多支实力强劲的球队，展现SZTU足球风采</p>
        </div>

        <TeamFilters
          globalSeasons={directory.globalSeasons}
          globalSeasonId={directory.globalSeasonId}
          selectedGender={directory.selectedGender}
          searchTerm={directory.searchTerm}
          onSeasonChange={directory.changeSeason}
          onGenderChange={directory.changeGender}
          onSearchTermChange={directory.setSearchTerm}
          onSearch={directory.search}
          onReset={directory.reset}
          onKeyDown={(event) => { if (event.key === 'Enter') directory.search(); }}
        />

        <button
          onClick={() => directory.loadTeams(
            directory.currentPage,
            directory.globalSeasonId,
            directory.selectedGender,
            directory.isSearching ? directory.searchTerm : undefined,
          )}
          className="refreshButton"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          刷新
        </button>

        {directory.error && (
          <div className="errorMessage">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {directory.error}
          </div>
        )}

        {directory.loading ? (
          <div className="loadingContainer"><div className="loadingSpinner" /><p>加载中...</p></div>
        ) : directory.teams.length === 0 ? (
          <div className="emptyState">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-5m16 0h-2.586a1 1 0 0 0-.707.293l-2.414 2.414a1 1 0 0 1-.707.293h-3.172a1 1 0 0 1-.707-.293l-2.414-2.414A1 1 0 0 0 6.586 13H4" />
            </svg>
            <p>暂无球队数据</p>
          </div>
        ) : (
          <>
            <div className="teamsGrid">
              {directory.teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  isSelected={selectedTeam?.id === team.id}
                  onClick={() => setSelectedTeam(team)}
                />
              ))}
            </div>

            {!directory.isSearching && directory.total > directory.limit && (
              <div className="pagination">
                <button onClick={() => directory.setCurrentPage(directory.currentPage - 1)} disabled={directory.currentPage === 1} className="paginationButton">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
                </button>
                <div className="paginationNumbers">
                  {Array.from({ length: directory.totalPages }, (_, index) => index + 1).map((page) => (
                    <button key={page} onClick={() => directory.setCurrentPage(page)} className={`paginationNumber ${directory.currentPage === page ? 'active' : ''}`}>
                      {page}
                    </button>
                  ))}
                </div>
                <button onClick={() => directory.setCurrentPage(directory.currentPage + 1)} disabled={directory.currentPage === directory.totalPages} className="paginationButton">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
                </button>
              </div>
            )}
          </>
        )}

        {selectedTeam && (
          <TeamModal
            team={selectedTeam}
            seasons={roster.seasons}
            selectedSeasonId={roster.selectedSeasonId}
            displayPlayers={roster.displayPlayers}
            playersLoading={roster.playersLoading}
            rosterError={roster.rosterError}
            onClose={() => setSelectedTeam(null)}
            onSeasonChange={roster.setSelectedSeasonId}
            onPreviewImage={setPreviewImage}
          />
        )}

        {previewImage && (
          <div className="imagePreviewOverlay" onClick={() => setPreviewImage(null)}>
            <div className="imagePreviewContainer" onClick={(event) => event.stopPropagation()}>
              <img src={previewImage} alt="大图预览" className="previewLargeImage" />
              <button className="previewCloseButton" onClick={() => setPreviewImage(null)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Teams;
