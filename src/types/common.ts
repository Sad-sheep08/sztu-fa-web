export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  stats?: {
    total: number;
    completed: number;
    scheduled: number;
    ongoing: number;
  };
}
