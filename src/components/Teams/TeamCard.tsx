import type { Team } from '../../types';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  onClick: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, isSelected, onClick }) => {
  return (
    <div
      className={`teamCard ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <div className="teamImageWrapper" style={{ position: 'relative' }}>
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: team.gender === 'FEMALE' ? '#ff4d4f' : '#1890ff',
          color: '#fff',
          fontSize: '11px',
          padding: '2px 8px',
          borderRadius: '4px',
          zIndex: 2,
          fontWeight: 600
        }}>
          {team.gender === 'FEMALE' ? '女子组' : '男子组'}
        </span>
        <img
          src={team.teamLogo || 'https://picsum.photos/seed/team/300/200'}
          alt={team.teamName}
          className="teamImage"
          loading="lazy"
        />
        <div className="teamOverlay"></div>
        <div className="teamBadge">
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id={`teamGrad${team.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#1A56DB', stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: '#2563EB', stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill={`url(#teamGrad${team.id})`} />
            <path
              d="M50 15 L55 35 L75 35 L60 48 L65 68 L50 55 L35 68 L40 48 L25 35 L45 35 Z"
              fill="#BFDBFE"
            />
          </svg>
        </div>
      </div>
      <div className="teamContent">
        <h3 className="teamName">{team.teamName}</h3>
        <div className="teamInfo">
          <div className="teamInfoItem">
            <span className="teamInfoLabel">主教练</span>
            <span className="teamInfoValue">{team.headCoach || '暂无'}</span>
          </div>
          <div className="teamInfoItem">
            <span className="teamInfoLabel">队长</span>
            <span className="teamInfoValue">{team.teamLeader || '暂无'}</span>
          </div>
          <div className="teamInfoItem">
            <span className="teamInfoLabel">队医</span>
            <span className="teamInfoValue">{team.teamDoctor || '暂无'}</span>
          </div>
          <div className="teamInfoItem">
            <span className="teamInfoLabel">主场球衣</span>
            <span className="teamInfoValue">{team.homeJerseyColor || '暂无'}</span>
          </div>
        </div>
        <button className="teamDetailsButton">查看详情</button>
      </div>
    </div>
  );
};

export default TeamCard;
