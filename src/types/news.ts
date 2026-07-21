export interface News {
  id: string;
  title: string;
  category: string;
  description: string;
  coverImage?: string | null;
  wechatUrl: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
