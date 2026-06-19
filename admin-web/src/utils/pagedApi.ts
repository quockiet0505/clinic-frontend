import { PageResponse } from '@/types/common';

export function parsePagedResponse<T>(apiResponse: {
  success?: boolean;
  data?: PageResponse<T>;
}): { content: T[]; totalElements: number } {
  const pageData = apiResponse?.data;
  if (apiResponse?.success !== false && pageData) {
    return {
      content: pageData.content ?? [],
      totalElements: pageData.totalElements ?? 0,
    };
  }
  console.error('Invalid paged API response:', apiResponse);
  return { content: [], totalElements: 0 };
}

/** Chuẩn hóa số từ BigDecimal/string API trả về */
export function toNumber(value: unknown): number {
  if (value == null) return 0;
  if (typeof value === 'number') return value;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? 0 : parsed;
}
