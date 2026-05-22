// src/features/home/components/HeroSection.tsx

import React, {
  useRef,
  useState,
  useEffect,
} from 'react';

import {
  Search,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { homeApi } from '@/features/home/api/homeApi';

export const HeroSection: React.FC = () => {
  const scrollRef =
    useRef<HTMLDivElement>(null);

  const [showLeft, setShowLeft] =
    useState(false);

  const [showRight, setShowRight] =
    useState(true);

  const validTitles = [
    'Đặt khám tại cơ sở',
    'Đặt khám chuyên khoa',
    'Đặt lịch xét nghiệm',
    'Đặt khám ngoài giờ',
    'Đặt khám theo bác sĩ',
  ];

  const quickActions = homeApi
    .getQuickActions()
    .filter((a) =>
      validTitles.includes(a.title),
    );

  const handleScroll = () => {
    if (scrollRef.current) {
      const {
        scrollLeft,
        scrollWidth,
        clientWidth,
      } = scrollRef.current;

      setShowLeft(scrollLeft > 1);

      setShowRight(
        scrollLeft + clientWidth <
          scrollWidth - 5,
      );
    }
  };

  useEffect(() => {
    handleScroll();

    const current =
      scrollRef.current;

    if (current) {
      current.addEventListener(
        'scroll',
        handleScroll,
      );

      window.addEventListener(
        'resize',
        handleScroll,
      );
    }

    return () => {
      if (current) {
        current.removeEventListener(
          'scroll',
          handleScroll,
        );

        window.removeEventListener(
          'resize',
          handleScroll,
        );
      }
    };
  }, []);

  const scroll = (
    direction: 'left' | 'right',
  ) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left:
          direction === 'left'
            ? -300
            : 300,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="relative bg-[#eaf4fa] pb-12">
      {/* HERO */}
      <div className="relative w-full h-[400px] md:h-[480px]">
        <img
          src="/images/hero-banner.webp"
          alt="Hero Banner"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center pt-8 md:pt-16 px-4 bg-gradient-to-b from-[#003B5C]/10 via-transparent to-transparent">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center drop-shadow-md">
            Kết nối Người Dân với
            Cơ sở & Dịch vụ Y tế
            hàng đầu
          </h1>

          {/* SEARCH */}
          <div className="w-full max-w-3xl relative flex items-center bg-white rounded-full p-1 shadow-lg border border-slate-100 mb-8 cursor-text">
            <div className="pl-4 pr-2">
              <Search className="h-5 w-5 text-slate-400" />
            </div>

            <Input
              type="text"
              placeholder="Tìm kiếm gói khám..."
              className="flex-1 border-0 shadow-none focus-visible:ring-0 text-base rounded-full h-12"
            />
          </div>

          {/* INFO */}
          <div className="flex flex-col items-start gap-2.5 text-white font-medium text-[13px] md:text-sm drop-shadow-md mx-auto">
            <p className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" />

              <span>
                Đặt khám nhanh -
                Lấy số thứ tự trực
                tuyến - Tư vấn sức
                khỏe từ xa
              </span>
            </p>

            <p className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" />

              <span>
                Đặt khám theo giờ -
                Đặt càng sớm để có
                số thứ tự thấp nhất
              </span>
            </p>

            <p className="flex items-center gap-3">
              <CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" />

              <span>
                Được hoàn tiền khi
                hủy khám - Có cơ
                hội nhận ưu đãi
                hoàn tiền
              </span>
            </p>
          </div>
        </div>

        {/* FADE */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#eaf4fa] to-transparent pointer-events-none"></div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="container mx-auto px-4 relative z-20 -mt-16 max-w-5xl">
        <div className="relative flex justify-center">
          {/* LEFT */}
          {showLeft && (
            <button
              onClick={() =>
                scroll('left')
              }
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-[#00b5f1] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* SLIDER */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 pt-2 px-2 w-fit max-w-full mx-auto justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {quickActions.map(
              (action) => (
                <div
                  key={action.id}
                  className="min-w-[130px] max-w-[130px] h-[130px] snap-start shrink-0 bg-white rounded-2xl p-4 shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
                >
                  <div className="h-12 w-12 mb-3 flex items-center justify-center">
                    <img
                      src={action.iconUrl}
                      alt={action.title}
                      className="max-w-full max-h-full hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <span className="font-semibold text-slate-700 text-[13px] leading-tight hover:text-[#00b5f1] transition-colors">
                    {action.title}
                  </span>
                </div>
              ),
            )}
          </div>

          {/* RIGHT */}
          {showRight && (
            <button
              onClick={() =>
                scroll('right')
              }
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-[#00b5f1] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};