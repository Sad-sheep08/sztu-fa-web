export interface Slide {
  id: number;
  titlePlain: string;
  titleEmphasis: string;
  description: string;
  image: string;
  thumb: string;
}

export const slides: Slide[] = [
  {
    id: 1,
    titlePlain: '热爱足球 ',
    titleEmphasis: '追逐梦想',
    description: '深圳技术大学足球协会，为热爱足球的同学们提供一个展示自我、交流切磋的平台',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=60',
  },
  {
    id: 2,
    titlePlain: '团结拼搏 ',
    titleEmphasis: '共创辉煌',
    description: '在这里，我们不仅锻炼体魄，更收获友谊与团队精神',
    image: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800&q=60',
  },
  {
    id: 3,
    titlePlain: '青春热血 ',
    titleEmphasis: '绿茵飞扬',
    description: '每一场比赛都是成长的机会，每一次训练都是进步的阶梯',
    image: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=1920&q=80',
    thumb: 'https://images.unsplash.com/photo-1489944440615-453fc2b6a9a9?w=800&q=60',
  },
];
