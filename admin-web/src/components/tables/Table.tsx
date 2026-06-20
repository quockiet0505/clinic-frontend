// components/tables/Table.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  /** Alignment & width — applied to both header and body */
  className?: string;
  /** Override header alignment/width only */
  headerClassName?: string;
  /** Skip truncate on body cell (use for avatar / multi-line cells) */
  noTruncate?: boolean;
}

export interface PaginationProps {
  page: number;
  size: number;
  total: number;
  onPageChange: (page: number) => void;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  pagination?: PaginationProps;
  rowClassName?: string;
  maxHeight?: string;
}

export default function Table<T extends Record<string, any>>({
  data = [],
  columns,
  onRowClick,
  emptyMessage = 'Không có dữ liệu',
  pagination,
  rowClassName,
}: TableProps<T>) {
  const safeData = data || [];

  if (!safeData.length) {
    return <div className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</div>;
  }

  // Server-side pagination: data is already the current page — do not slice
  const start = pagination ? (pagination.page - 1) * pagination.size : 0;
  const end = pagination ? Math.min(start + safeData.length, pagination.total) : safeData.length;
  const currentData = safeData;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.size) : 1;

  return (
    <div className="flex flex-col h-full w-full">
      {/* Vùng cuộn - chiếm toàn bộ không gian còn lại */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 font-semibold text-slate-700 text-sm text-left ${col.headerClassName || (col.className || '').replace(/text-(center|right)/g, '')}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((item, index) => (
              <tr
                key={index}
                onClick={() => onRowClick?.(item)}
                className={`border-b border-slate-100 hover:bg-slate-50/70 transition-colors ${onRowClick ? 'cursor-pointer' : ''} ${rowClassName || ''}`}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-6 py-3 text-sm text-slate-700 ${col.noTruncate ? 'overflow-visible' : 'truncate'} ${col.className || 'text-left'}`}
                    title={!col.render && typeof item[col.key as keyof T] === 'string' ? String(item[col.key as keyof T]) : undefined}
                  >
                    {col.render ? col.render(item) : item[col.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))}
            {/* Spacer cuối */}
            <tr className="h-4 border-0">
              <td colSpan={columns.length} className="border-0 p-0" />
            </tr>
          </tbody>
        </table>


        {/* Phân trang - chỉ hiển thị khi có >1 trang */}
      {pagination && totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-between px-2 py-3 border-t border-slate-200 bg-slate-50/50">
          <div className="text-sm text-slate-500">
            Hiển thị <span className="font-medium text-slate-700">{start + 1}</span> –{' '}
            <span className="font-medium text-slate-700">{Math.min(end, pagination.total)}</span> /{' '}
            <span className="font-medium text-slate-700">{pagination.total}</span> kết quả
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`p-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition-all ${
                pagination.page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:text-slate-700 cursor-pointer'
              }`}
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-medium text-slate-700">
              {pagination.page} / {totalPages}
            </span>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page === totalPages}
              className={`p-2 rounded-lg border border-slate-200 bg-white text-slate-500 transition-all ${
                pagination.page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50 hover:text-slate-700 cursor-pointer'
              }`}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      </div>

      
    </div>
  );
}