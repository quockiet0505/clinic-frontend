import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, CalendarCheck, Star, Users } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { homeApi } from '@/features/home/api/homeApi';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: number;
  title: string;
  iconUrl: string;
}

const TRUST_STATS = [
  { value: '500+', label: 'Bác sĩ', icon: <Users className="w-4 h-4" /> },
  { value: '20', label: 'Chuyên khoa', icon: <CalendarCheck className="w-4 h-4" /> },
  { value: '4.9★', label: 'Đánh giá TB', icon: <Star className="w-4 h-4 fill-current" /> },
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [bannerUrl, setBannerUrl] = useState('/images/banners/hero-banner.jpg');
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    homeApi.getQuickActions().then(setQuickActions).catch(console.error);
    homeApi.getBanner('main')
      .then(url => setBannerUrl(url))
      .catch(console.error);
  }, []);

  const handleQuickActionClick = (title: string) => {
    const value = title.toLowerCase();
    if (value.includes('bác sĩ')) navigate('/appointments/book?source=doctor');
    else if (value.includes('chuyên khoa')) navigate('/appointments/book?source=specialty');
    else if (value.includes('dịch vụ') || value.includes('xét nghiệm')) navigate('/appointments/book?source=service');
    else navigate('/appointments/book');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    if (keyword.trim()) {
      navigate(`/services?search=${encodeURIComponent(keyword.trim())}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeft(scrollLeft > 1);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  useEffect(() => {
    handleScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (current) current.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [quickActions]);

  const scroll = (dir: 'left' | 'right') =>
    scrollRef.current?.scrollBy({ left: dir === 'left' ? -300 : 300, behavior: 'smooth' });

  return (
    <div className="relative bg-gradient-to-b from-[#e0f2fe] to-white pb-0">

      {/* ── Banner + Text overlay ── */}
      <div className="relative w-full h-[500px] md:h-[600px]">

        {/* Banner giữ từ API */}
        <img
          src={bannerUrl}
          alt="Hero Banner"
          className="w-full h-full object-cover object-center"
          onError={(e) => { e.currentTarget.src = '/images/banners/hero-banner.jpg'; }}
        />

        {/*
          Overlay LEFT→RIGHT:
          ─ Trái: banner-overlay-start → Trắng gần như đặc để chữ nổi bật hoàn toàn
          ─ Giữa: banner-overlay-mid → Chuyển màu mềm mại, kéo dài hơn sang phải
          ─ Phải: banner-overlay-end → Ảnh lộ ra tự nhiên
        */}
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-banner-overlay-start)] via-[var(--color-banner-overlay-mid)] to-[var(--color-banner-overlay-end)]" />

        {/* Fade đáy xuống nền trang */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#f0f9ff]/40 to-[#f0f9ff] pointer-events-none" />

        {/* Content - Thêm pb-20 để đẩy nội dung lên, tránh bị Quick Actions đè */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 pb-20">
          <div className="container mx-auto max-w-6xl">
            {/* Tăng max-w để chữ dàn ngang được trên 1 dòng */}
            <div className="max-w-[750px]">

              <span className="inline-flex items-center gap-2 bg-primary-50 border border-primary-200 text-primary-600 text-[11px] font-bold px-3.5 py-1.5 rounded-full mb-5 backdrop-blur-sm tracking-wider uppercase drop-shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse shrink-0" />
                Đặt khám trực tuyến · Không chờ đợi
              </span>

              <h1 className="text-3xl md:text-[40px] lg:text-[46px] font-black text-brand-dark leading-tight mb-4 tracking-tight drop-shadow-sm">
                Kết nối với <span className="text-primary-600">Bác sĩ chuyên khoa</span>
                <br className="hidden md:block" />
                hàng đầu tại nhà
              </h1>

              <p className="text-slate-600 text-sm md:text-base font-medium mb-8 leading-relaxed max-w-[500px] drop-shadow-sm">
                Đặt lịch nhanh chóng, tư vấn từ xa, hoàn tiền nếu hủy.
                Chăm sóc sức khỏe chưa bao giờ dễ dàng đến vậy.
              </p>

              <div className="mb-8 max-w-[600px]">
                <SearchInput
                  value={searchKeyword}
                  onSearch={handleSearch}
                  placeholder="Tìm bác sĩ, dịch vụ, chuyên khoa..."
                  className="shadow-2xl shadow-slate-300/80 border-slate-200 h-14 focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all"
                />
              </div>

              {/* Trust stats - Gộp thành 1 thanh ngang dài để tạo liên kết sang phải */}
              <div className="flex items-center gap-4 md:gap-8 px-6 py-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm w-fit">
                {TRUST_STATS.map((stat, i) => (
                  <React.Fragment key={stat.label}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-brand-dark font-black text-[18px] leading-none">{stat.value}</p>
                        <p className="text-slate-600 text-[13px] font-medium mt-1 whitespace-nowrap">{stat.label}</p>
                      </div>
                    </div>
                    {i < TRUST_STATS.length - 1 && (
                      <div className="w-px h-10 bg-slate-300/50 hidden sm:block" />
                    )}
                  </React.Fragment>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions — float lên như code gốc ── */}
      <div className="container mx-auto px-4 relative z-20 -mt-16 max-w-5xl">
        <div className="relative flex justify-center">
          {showLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-primary-500 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 pt-2 px-2 w-fit max-w-full mx-auto justify-center [&::-webkit-scrollbar]:hidden"
          >
            {quickActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleQuickActionClick(action.title)}
                className="min-w-[130px] max-w-[130px] h-[130px] snap-start shrink-0 bg-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <div className="h-12 w-12 mb-3 flex items-center justify-center">
                  <img
                    src={action.iconUrl}
                    alt={action.title}
                    className="max-w-full max-h-full"
                    onError={(e) => { e.currentTarget.src = '/icons/placeholder.png'; }}
                  />
                </div>
                <span className="font-semibold text-slate-700 text-xs leading-tight hover:text-primary-500 transition-colors">
                  {action.title}
                </span>
              </div>
            ))}
          </div>

          {showRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-primary-500 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
