import { useState, useEffect } from 'react';
import './Activities.css';
import { fetchNews } from '../../api';
import type { News } from '../../types';

interface Activity {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  category: string;
  wechatUrl: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    title: '第八届"校长杯"半决赛落幕',
    description: '绿茵巅峰对决，双雄会师决赛🔥烽烟再起，巅峰鏖战！四强强队齐聚绿茵，全力以赴冲击决赛席位，两场高强度对决精彩纷呈、看点炸裂。最终两支老牌冠军队伍强势突围，成功会师总决赛！',
    image: '/activity1.jpg',
    date: '2026-06-10',
    location: '北区足球场',
    category: '赛事',
    wechatUrl: '#',
  },
  {
    id: '2',
    title: '女足省赛创历史最佳战绩',
    description: '在2025年广东省青少年校园足球联赛（大学组）中，我校女子足球队奋勇拼搏，首次闯进八强，最终荣获赛事一等奖，创造了自建队以来的历史最佳战绩！',
    image: '/activity2.jpg',
    date: '2025-12-20',
    location: '广东省体育场',
    category: '赛事',
    wechatUrl: '#',
  },
  {
    id: '3',
    title: '男足校队年度招新',
    description: '当阳光洒在绿茵场上，当球鞋与草坪碰撞出清脆声响，当进球后的欢呼响彻校园 —— 你是否也曾驻足观望，渴望成为这片赛场的主角？现在，机会来了！',
    image: '/activity3.jpg',
    date: '2025-09-19',
    location: '北区五人制足球场',
    category: '招新',
    wechatUrl: '#',
  },
];

const Activities: React.FC = () => {
  const [newsList, setNewsList] = useState<News[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNewsData = async () => {
      try {
        const res = await fetchNews(1, 6); // 拉取最新的6条文章在网格中统一排版
        if (res && res.data && res.data.length > 0) {
          setNewsList(res.data);
        }
      } catch (err) {
        console.error('获取前台资讯列表失败，采用本地 Mock 数据 fallback:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadNewsData();
  }, []);

  const hasNews = newsList.length > 0;

  const displayList = hasNews 
    ? newsList.map(n => ({
        id: n.id,
        title: n.title,
        description: n.description,
        image: n.coverImage || '/activity1.jpg',
        date: n.date,
        location: '微信公众号',
        category: n.category,
        wechatUrl: n.wechatUrl
      }))
    : mockActivities;

  return (
    <section className="activities" id="activities">
      <div className="activitiesContainer">
        <div className="sectionHeader">
          <span className="sectionTag">活动动态</span>
          <h2 className="sectionTitle">
            最新<span>活动资讯</span>
          </h2>
          <p className="sectionDescription">
            了解协会最新活动动态，参与丰富多彩的足球活动
          </p>
        </div>

        <div className="activitiesGrid">
          {displayList.map((activity, index) => (
            <div key={activity.id} className="activityCard">
              <div className="activityImageWrapper">
                <img src={activity.image} alt={activity.title} className="activityImage" loading="lazy" />
                <span className="activityCategory">{activity.category}</span>
                {index === 0 && <span className="activityLatestBadge">最新发布</span>}
              </div>
              <div className="activityContent">
                <div className="activityDate">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {activity.date}
                </div>
                <h3 className="activityTitle">{activity.title}</h3>
                <p className="activityDescription">{activity.description}</p>
                <div className="activityMeta">
                  <div className="activityLocation">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {activity.location}
                  </div>
                  <a 
                    href={activity.wechatUrl} 
                    target={activity.wechatUrl === '#' ? '_self' : '_blank'} 
                    rel="noopener noreferrer" 
                    className="activityLink"
                  >
                    查看详情
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="viewMoreWrapper">
          <a 
            href={displayList[0]?.wechatUrl || '#'} 
            target={displayList[0]?.wechatUrl === '#' ? '_self' : '_blank'} 
            rel="noopener noreferrer" 
            className="viewMoreButton"
          >
            查看更多活动
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Activities;