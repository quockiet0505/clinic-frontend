// types/common.ts
export interface BaseFilterParams {
  search?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;   // 0-based khi gửi API
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  page?: number;
  size?: number;
  totalPages?: number;
}