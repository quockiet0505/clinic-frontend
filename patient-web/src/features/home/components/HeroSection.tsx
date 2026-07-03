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

const TYPEWRITER_TEXTS = [
  "Tìm kiếm chuyên khoa...",
  "Tìm kiếm bác sĩ...",
  "Tìm kiếm dịch vụ y tế..."
];

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [bannerUrl, setBannerUrl] = useState('/images/banners/hero-banner.jpg');
  const [searchKeyword, setSearchKeyword] = useState('');

  const [placeholderText, setPlaceholderText] = useState('');
  const [typeIndex, setTypeIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPEWRITER_TEXTS[typeIndex];
    let timer: NodeJS.Timeout;

    if (isDeleting) {
      if (placeholderText === '') {
        setIsDeleting(false);
        setTypeIndex((prev) => (prev + 1) % TYPEWRITER_TEXTS.length);
        timer = setTimeout(() => {}, 400); // pause before typing next
      } else {
        timer = setTimeout(() => setPlaceholderText(currentWord.slice(0, placeholderText.length - 1)), 50); // fast delete
      }
    } else {
      if (placeholderText === currentWord) {
        timer = setTimeout(() => setIsDeleting(true), 2000); // wait at full word
      } else {
        timer = setTimeout(() => setPlaceholderText(currentWord.slice(0, placeholderText.length + 1)), 80); // typing speed
      }
    }
    return () => clearTimeout(timer);
  }, [placeholderText, isDeleting, typeIndex]);

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
          Overlay BOTTOM→TOP:
          ─ Dưới: banner-overlay-start (màu mờ đục)
          ─ Trên: banner-overlay-end (trong suốt)
        */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-banner-overlay-start)] via-[var(--color-banner-overlay-mid)] to-[var(--color-banner-overlay-end)]" />

        {/* Fade đáy xuống nền trang */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[#f0f9ff]/40 to-[#f0f9ff] pointer-events-none" />

        {/* Content - Thêm pb-20 để đẩy nội dung lên, tránh bị Quick Actions đè */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 pb-20 items-center text-center">
          <div className="container mx-auto max-w-6xl flex flex-col items-center">
            {/* Tăng max-w để chữ dàn ngang được trên 1 dòng */}
            <div className="w-full max-w-[1000px] flex flex-col items-center">

              <div className="inline-flex items-center gap-2.5 bg-white/60 border border-white/60 text-brand-dark text-[12px] md:text-[13px] font-bold px-4 py-1.5 rounded-full mb-6 backdrop-blur-md tracking-wide shadow-sm hover:bg-white/80 transition-colors cursor-default">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                Nền tảng Y tế Số Thông minh 24/7
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-slate-900 leading-[1.2] mb-5 tracking-tight drop-shadow-sm">
                Kết nối với <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-sky-400">Đội ngũ Bác sĩ chuyên khoa</span><br className="hidden md:block" /> dịch vụ chuẩn quốc tế
              </h1>

              <p className="text-slate-600 text-[15px] md:text-[17px] font-medium mb-8 leading-relaxed max-w-[650px] mx-auto drop-shadow-sm">
                Trải nghiệm chăm sóc sức khỏe hiện đại. Đặt lịch nhanh chóng, tư vấn từ xa và quản lý hồ sơ bệnh án trọn đời chỉ với vài thao tác.
              </p>

              <div className="mb-10 w-full max-w-[650px] mx-auto relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary-200 to-sky-200 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500"></div>
                <div className="relative">
                  <SearchInput
                    value={searchKeyword}
                    onSearch={handleSearch}
                    placeholder={placeholderText || '|'}
                    className="shadow-xl border-white/80 h-[60px] text-lg focus-within:border-primary-400 focus-within:ring-4 focus-within:ring-primary-100 transition-all bg-white/90 backdrop-blur-sm"
                  />
                </div>
              </div>

              {/* Trust stats - Gộp thành 1 thanh ngang dài để tạo liên kết sang phải */}
              <div className="flex items-center justify-center gap-4 md:gap-10 px-8 py-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white shadow-sm w-fit mx-auto text-left hover:shadow-md transition-shadow">
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
