// src/features/home/pages/DoctorDirectory.tsx

import React, { useState } from 'react';

import {
  CheckCircle2,
  Phone,
  Star,
  User,
  Stethoscope,
  ClipboardList,
  CalendarDays,
  CircleDollarSign,
  ChevronsRight,
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
  Doctor,
} from '@/features/home/types/home';

export const DoctorDirectory: React.FC =
  () => {
    const allDoctors: Doctor[] =
      homeApi.getFeaturedDoctors();

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

    const filteredDoctors =
      allDoctors.filter(
        (doc) =>
          doc.fullName
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase(),
            ) ||
          doc.specialtyName
            .toLowerCase()
            .includes(
              searchTerm.toLowerCase(),
            ),
      );

    const totalPages =
      Math.ceil(
        filteredDoctors.length /
          itemsPerPage,
      ) || 1;

    const indexOfLastItem =
      currentPage * itemsPerPage;

    const indexOfFirstItem =
      indexOfLastItem - itemsPerPage;

    const currentItems =
      filteredDoctors.slice(
        indexOfFirstItem,
        indexOfLastItem,
      );

    return (
      <main className="w-full min-h-screen bg-[#f5f7f9] pb-16">
        <div className="relative w-full bg-[#eaf4fa] pt-10 pb-20">
          <SectionContainer className="max-w-6xl">
            <div className="bg-white rounded-[24px] p-8 shadow-sm max-w-3xl border border-slate-100">
              <h1 className="text-[24px] font-black text-[#00b5f1] uppercase tracking-wide mb-5">
                Gọi video với bác sĩ
              </h1>

              <div className="flex flex-col gap-2.5 text-[#003B5C] font-medium text-[13.5px] mb-6">
                <p className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />

                  Khám/tư vấn sức khỏe từ xa
                </p>

                <p className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />

                  Được nhắn tin với bác sĩ
                </p>

                <p className="flex items-start gap-3">
                  <CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />

                  Được tư vấn tối thiểu 15 phút
                </p>
              </div>

              <div className="w-full h-px bg-slate-200 mb-5"></div>

              <div className="flex flex-wrap items-center gap-3 text-[14.5px]">
                <span className="text-[#003B5C]">
                  Liên hệ chuyên gia
                </span>

                <a
                  href="tel:19002115"
                  className="flex items-center gap-1.5 text-[#00b5f1] font-black text-lg"
                >
                  <Phone className="w-4 h-4" />

                  19002115
                </a>

                <Button className="bg-[#f58220] hover:bg-[#e0751a] text-white rounded-lg">
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
                placeholder="Tìm kiếm bác sĩ..."
              />
            </div>
          </div>
        </div>

        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[60px] mb-10">
            {currentItems.length >
            0 ? (
              currentItems.map(
                (doc, index) => (
                  <div
                    key={doc.id}
                    className="bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col sm:flex-row gap-5 hover:shadow-xl hover:border-[#00b5f1] transition-all"
                  >
                    <div className="w-[130px] shrink-0 flex flex-col gap-3">
                      <div className="w-full h-[140px] bg-slate-100 rounded-xl overflow-hidden">
                        <img
                          src={
                            doc.avatarUrl
                          }
                          alt={
                            doc.fullName
                          }
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <Button
                        variant="secondary"
                        className="text-xs"
                      >
                        Xem chi tiết
                      </Button>

                      <div className="flex items-center justify-between border border-[#00b5f1] rounded-md px-2 py-1.5 bg-[#f4f9fb]">
                        <div className="flex items-center gap-1 text-[#00b5f1] font-bold text-[13px]">
                          {doc.rating.toFixed(
                            1,
                          )}

                          <Star className="w-3.5 h-3.5 text-yellow-500 fill-current" />
                        </div>

                        <div className="w-px h-3 bg-[#00b5f1]/30"></div>

                        <div className="flex items-center gap-1 text-[#00b5f1] font-bold text-[13px]">
                          {10 +
                            index *
                              15}

                          <User className="w-3.5 h-3.5 text-orange-400 fill-current" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col">
                      <h3 className="font-bold text-[#00b5f1] text-[18px] mb-4">
                        {doc.fullName}
                      </h3>

                      <div className="flex flex-col gap-2.5 text-[13.5px] flex-1">
                        <div className="flex items-start gap-2">
                          <Stethoscope className="w-[18px] h-[18px] text-slate-400 shrink-0" />

                          <span>
                            {
                              doc.specialtyName
                            }
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <ClipboardList className="w-[18px] h-[18px] text-slate-400 shrink-0" />

                          <div className="flex justify-between items-center flex-1">
                            <span>
                              Khám tổng
                              quát
                            </span>

                            <button className="border border-[#00b5f1] text-[#00b5f1] p-0.5 rounded">
                              <ChevronsRight className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <CalendarDays className="w-[18px] h-[18px] text-slate-400 shrink-0" />

                          <span>
                            Hẹn khám
                          </span>
                        </div>

                        <div className="flex items-start gap-2">
                          <CircleDollarSign className="w-[18px] h-[18px] text-slate-400 shrink-0" />

                          <span>
                            {formatPrice(
                              doc.consultationFee,
                            )}
                          </span>
                        </div>
                      </div>

                      <Button className="mt-5 bg-[#00b5f1] hover:bg-[#0092c4] text-white rounded-full">
                        Đặt ngay
                      </Button>
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="col-span-full">
                <EmptyState
                  title="Không tìm thấy bác sĩ"
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