import React, { useRef, useState, useEffect } from 'react';
import { CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { homeApi } from '@/features/home/api/homeApi';
import { getStaticUrl } from '@/utils/url';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  id: number;
  title: string;
  iconUrl: string;
}

export const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);
  const [bannerUrl, setBannerUrl] = useState('/images/banners/hero-banner.webp');
  const [searchKeyword, setSearchKeyword] = useState('');
  const staticUrl = getStaticUrl();

  // const
  const handleQuickActionClick = (title: string) => {
    const value = title.toLowerCase();
  
    if (value.includes('bác sĩ')) {
      navigate('/appointments/book?source=doctor');
    }
  
    else if (
      value.includes('chuyên khoa') ||
      value.includes('khám chuyên khoa')
    ) {
      navigate('/appointments/book?source=specialty');
    }
  
    else if (
      value.includes('dịch vụ') ||
      value.includes('xét nghiệm')
    ) {
      navigate('/appointments/book?source=service');
    }
  
    else {
      navigate('/appointments/book');
    }
  
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    homeApi.getQuickActions().then(setQuickActions).catch(console.error);
    homeApi.getBanner().then(url => setBannerUrl(url)).catch(console.error);
  }, []);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
    console.log('Searching for:', keyword);
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

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'left' ? -300 : 300, behavior: 'smooth' });
  };

  return (
    <div className="relative bg-white pb-0">
      <div className="relative w-full h-[400px] md:h-[480px]">
        <img
          src={`${staticUrl}${bannerUrl}`}
          alt="Hero Banner"
          className="w-full h-full object-cover"
          onError={(e) => (e.currentTarget.src = `${staticUrl}/images/default-banner.jpg`)}
        />
        <div className="absolute inset-0 flex flex-col items-center pt-8 md:pt-16 px-4 bg-gradient-to-b from-brand-dark/10 via-transparent to-transparent">
          <h1 className="text-2xl md:text-4xl font-bold text-white mb-6 text-center drop-shadow-md">
            Kết nối Người Dân với Cơ sở & Dịch vụ Y tế hàng đầu
          </h1>
          <div className="w-full max-w-3xl mb-8">
            <SearchInput
              value={searchKeyword}
              onSearch={handleSearch}
              placeholder="Tìm kiếm gói khám..."
            />
          </div>
          <div className="flex flex-col items-start gap-2.5 text-white font-medium text-sm md:text-base drop-shadow-md mx-auto">
            <p className="flex items-center gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" /><span>Đặt khám nhanh - Lấy số thứ tự trực tuyến - Tư vấn sức khỏe từ xa</span></p>
            <p className="flex items-center gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" /><span>Đặt khám theo giờ - Đặt càng sớm để có số thứ tự thấp nhất</span></p>
            <p className="flex items-center gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-400 fill-white/20 shrink-0" /><span>Được hoàn tiền khi hủy khám - Có cơ hội nhận ưu đãi hoàn tiền</span></p>
          </div>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-gradient-white-blue/70 to-white pointer-events-none"></div>
      </div>

      <div className="container mx-auto px-4 relative z-20 -mt-16 max-w-5xl">
        <div className="relative flex justify-center">
          {showLeft && (
            <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-primary-500 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          <div ref={scrollRef} onScroll={handleScroll} className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 pt-2 px-2 w-fit max-w-full mx-auto justify-center [&::-webkit-scrollbar]:hidden">
            {quickActions.map((action) => (
              <div
                key={action.id}
                onClick={() => handleQuickActionClick(action.title)}
                className="min-w-[130px] max-w-[130px] h-[130px] snap-start shrink-0 bg-white rounded-2xl p-4 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center"
              >
                <div className="h-12 w-12 mb-3 flex items-center justify-center">
                  <img
                    src={`${staticUrl}${action.iconUrl}`}
                    alt={action.title}
                    className="max-w-full max-h-full hover:scale-110 transition-transform duration-300"
                    onError={(e) => (e.currentTarget.src = `${staticUrl}/icons/placeholder.png`)}
                  />
                </div>
                <span className="font-semibold text-slate-700 text-xs leading-tight hover:text-primary-500 transition-colors">{action.title}</span>
              </div>
            ))}
          </div>
          {showRight && (
            <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-md text-slate-600 hover:text-primary-500 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};