import React from 'react';

import {
  Pagination as ShadcnPagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  return (
    <ShadcnPagination className="mt-12">

      <PaginationContent className="gap-2">

        <PaginationItem>
          <PaginationPrevious
            className="cursor-pointer rounded-xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-200 transition-all"
            onClick={() => {
              if (currentPage > 1) {
                onPageChange(currentPage - 1);
              }
            }}
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <PaginationItem key={page}>

              <PaginationLink
                isActive={page === currentPage}
                onClick={() => onPageChange(page)}
                className={`cursor-pointer rounded-xl min-w-[42px] h-[42px] flex items-center justify-center border transition-all duration-200 ${
                  page === currentPage
                    ? 'bg-primary-500 text-white border-primary-500 shadow-md hover:bg-primary-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-primary-200 hover:bg-primary-50 hover:text-primary-500'
                }`}
              >
                {page}
              </PaginationLink>

            </PaginationItem>
          );
        })}

        <PaginationItem>
          <PaginationNext
            className="cursor-pointer rounded-xl border border-slate-200 bg-white hover:bg-primary-50 hover:border-primary-200 transition-all"
            onClick={() => {
              if (currentPage < totalPages) {
                onPageChange(currentPage + 1);
              }
            }}
          />
        </PaginationItem>

      </PaginationContent>
    </ShadcnPagination>
  );
};