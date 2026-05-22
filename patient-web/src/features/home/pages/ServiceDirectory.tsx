// src/features/home/pages/ServiceDirectory.tsx

import React, { useState } from 'react';

import {
  CheckCircle2,
  Phone,
  Building2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  EmptyState,
  Pagination,
  SearchFilterBar,
  SectionContainer,
} from '@/components/common';

import { homeApi } from '@/features/home/api/homeApi';

import type {
  ServicePackage,
} from '@/features/home/types/home';

export const ServiceDirectory: React.FC =
  () => {
    const allServices: ServicePackage[] =
      homeApi.getListServices();

    const [searchTerm, setSearchTerm] =
      useState('');

    const [currentPage, setCurrentPage] =
      useState(1);

    const itemsPerPage = 10;

    const formatPrice = (
      price: number,
    ) => {
      return new Intl.NumberFormat(
        'vi-VN',
        {
          style: 'currency',
          currency: 'VND',
        },
      ).format(price);
    };

    const filteredServices =
      allServices.filter((service) =>
        service.title
          .toLowerCase()
          .includes(
            searchTerm.toLowerCase(),
          ),
      );

    const totalPages =
      Math.ceil(
        filteredServices.length /
          itemsPerPage,
      ) || 1;

    const currentItems =
      filteredServices.slice(
        (currentPage - 1) *
          itemsPerPage,
        currentPage *
          itemsPerPage,
      );

    return (
      <main className="w-full min-h-screen bg-[#f5f7f9] pb-16">
        <div className="relative w-full bg-[#eaf4fa] pt-10 pb-20">
          <SectionContainer className="max-w-6xl">
            <div className="bg-white rounded-[24px] p-8 shadow-sm max-w-3xl border border-slate-100">
              <h1 className="text-[24px] font-black text-[#00b5f1] uppercase tracking-wide mb-5">
                Đặt lịch xét nghiệm
              </h1>

              <div className="flex flex-col gap-2.5 text-[#003B5C] font-medium text-[13.5px] mb-6">
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />

                  Đặt lịch trực tiếp
                </p>

                <p className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />

                  Giảm thời gian chờ
                </p>
              </div>

              <div className="w-full h-px bg-slate-200 mb-5"></div>

              <div className="flex items-center gap-3">
                <a
                  href="tel:19002115"
                  className="text-[#00b5f1] font-black text-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />

                  19002115
                </a>

                <Button className="bg-[#f58220] hover:bg-[#e0751a] text-white">
                  Chat ngay
                </Button>
              </div>
            </div>
          </SectionContainer>

          <div className="absolute left-0 right-0 -bottom-7 flex justify-center z-20 px-4">
            <div className="w-full max-w-4xl">
              <SearchFilterBar
                value={searchTerm}
                onChange={(value) => {
                  setSearchTerm(value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm kiếm dịch vụ..."
              />
            </div>
          </div>
        </div>

        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[60px] mb-10">
            {currentItems.length >
            0 ? (
              currentItems.map(
                (service) => (
                  <div
                    key={service.id}
                    className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 flex gap-4 hover:shadow-xl transition-all"
                  >
                    <div className="w-[72px] h-[72px] bg-[#eaf4fa] rounded-2xl p-3 flex items-center justify-center">
                      <img
                        src={
                          service.imageUrl
                        }
                        alt={
                          service.title
                        }
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-[#003B5C] text-[16px] mb-2 line-clamp-2">
                          {
                            service.title
                          }
                        </h3>

                        <div className="flex items-start gap-2 text-slate-500 text-sm">
                          <Building2 className="w-4 h-4 mt-[2px]" />

                          <span>
                            {
                              service.clinicName
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span className="text-[#f58220] font-black">
                          {formatPrice(
                            service.discountPrice,
                          )}
                        </span>

                        <Button className="bg-[#00b5f1] hover:bg-[#0092c4] text-white rounded-full">
                          Đặt khám
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="Không tìm thấy dịch vụ"
                  description="Vui lòng thử từ khóa khác."
                />
              </div>
            )}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </SectionContainer>
      </main>
    );
  };