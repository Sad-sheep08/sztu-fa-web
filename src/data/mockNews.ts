export interface MockActivity {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  location: string;
  category: string;
  wechatUrl: string;
}

export const mockActivities: MockActivity[] = [
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
