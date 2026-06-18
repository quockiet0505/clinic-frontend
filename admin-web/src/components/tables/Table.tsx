// components/tables/Table.tsx
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
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
  maxHeight?: string;
  pagination?: PaginationProps;
  rowClassName?: string;
}

export default function Table<T extends Record<string, any>>({
  data,
  columns,
  onRowClick,
  loading = false,
  emptyMessage = 'Không có dữ liệu',
  maxHeight = '400px',
  pagination,
  rowClassName,
}: TableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-slate-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return <div className="text-center py-12 text-slate-400 text-sm">{emptyMessage}</div>;
  }

  const start = pagination ? (pagination.page - 1) * pagination.size : 0;
  const end = pagination ? Math.min(start + pagination.size, data.length) : data.length;
  const currentData = pagination ? data.slice(start, end) : data;
  const totalPages = pagination ? Math.ceil(pagination.total / pagination.size) : 1;

  return (
    <div className="space-y-4">
      <div className="overflow-auto" style={{ maxHeight }}>
        <table className="w-full text-sm table-fixed border-collapse">
          <thead className="sticky top-0 z-10 bg-slate-100/90 backdrop-blur-sm border-b border-slate-200 shadow-sm">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={`px-6 py-3 text-left font-semibold text-slate-700 text-sm ${col.className || ''}`}
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
                    className={`px-6 py-3 text-sm text-slate-700 truncate ${col.className || ''}`}
                    title={typeof item[col.key as keyof T] === 'string' ? item[col.key as keyof T] : undefined}
                  >
                    {col.render ? col.render(item) : item[col.key as keyof T]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-2 py-3 border-t border-slate-200 bg-slate-50/50 rounded-b-2xl">
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
  );
}