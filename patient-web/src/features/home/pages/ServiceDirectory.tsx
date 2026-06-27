import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Building2 } from 'lucide-react';
import { EmptyState, Pagination, SectionContainer, ActionButton } from '@/components/common';
import { SearchInput } from '@/components/common/SearchInput';
import { homeApi } from '../api/homeApi';
import { getStaticUrl } from '@/utils/url';
import type { ServicePackage } from '../types/home';

export const ServiceDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isTypeOpen, setIsTypeOpen] = useState(false);
  const typeTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const staticUrl = getStaticUrl();

  const [bannerUrl, setBannerUrl] = useState('/images/banners/service.jpg');

  useEffect(() => {
    homeApi.getServices().then(setServices);
    homeApi.getBanner('service')
      .then(url => setBannerUrl(url))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const q = searchParams.get('search');
    if (q !== null && q !== searchTerm) {
      setSearchTerm(q);
    }
  }, [searchParams]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredServices = services.filter((s) => {
    if (s.serviceType !== 'LAB_TEST' && s.serviceType !== 'X_RAY') return false; // Only show LAB_TEST and X_RAY
    const matchesSearch = s.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || s.serviceType === typeFilter;

    let matchesPrice = true;
    const price = s.discountPrice || s.originalPrice || 0;
    if (priceFilter === 'LOW') matchesPrice = price < 500000;
    else if (priceFilter === 'MEDIUM') matchesPrice = price >= 500000 && price <= 2000000;
    else if (priceFilter === 'HIGH') matchesPrice = price > 2000000;

    return matchesSearch && matchesPrice && matchesType;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const currentItems = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBooking = (serviceId: number) => {
    navigate(`/appointments/book?serviceId=${serviceId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <main className="w-full min-h-screen bg-[#f0f9ff] pb-16">
      <div className="relative w-full min-h-[380px] flex items-center justify-center pt-10 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={bannerUrl}
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop'; }}
            alt="Service Banner"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-[var(--color-banner-dark-end)]"></div>
        </div>
        <SectionContainer className="max-w-6xl relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h1 className="text-[32px] md:text-[36px] leading-tight font-black uppercase tracking-wide mb-5 text-white drop-shadow-sm">
              DỊCH VỤ<br /><span className="text-[#38bdf8]">XÉT NGHIỆM & KHÁM BỆNH</span>
            </h1>
            <div className="flex flex-col gap-3 font-medium text-[15px] mb-7 text-slate-100">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Đặt lịch xét nghiệm trực tiếp, linh hoạt tại nhà hoặc cơ sở</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Giảm thiểu thời gian chờ đợi, nhận kết quả online</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Hỗ trợ hoàn phí khi hủy phiếu theo chính sách</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 w-fit shadow-lg">
              <span>Liên hệ chuyên gia để tư vấn thêm:</span>
              <a href="tel:19002115" className="flex items-center gap-1.5 text-white font-black text-xl hover:text-primary-300 transition-colors">19002115</a>
            </div>
          </div>
        </SectionContainer>

        {/* Removed floating search bar from here, moved to unified toolbar */}
      </div>

      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6">
          <h2 className="text-[22px] font-bold text-brand-dark hidden lg:block">Danh sách Dịch vụ</h2>

          <div className="flex-1 w-full lg:w-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-2">
            <div className="w-full lg:w-[45%] lg:flex-1 shrink min-w-[200px]">
              <SearchInput
                value={searchTerm}
                onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                placeholder="Tìm dịch vụ xét nghiệm..."
                className="h-11 shadow-none border-transparent hover:border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-primary-300 transition-all"
              />
            </div>
            <div className="w-px h-8 bg-slate-100 hidden lg:block mx-1 shrink-0"></div>
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-end gap-2 w-full lg:w-auto shrink-0">
              <div
                className="w-[200px] shrink-0 relative z-40"
                onMouseEnter={() => { if (priceTimeout.current) clearTimeout(priceTimeout.current); setIsPriceOpen(true); }}
                onMouseLeave={() => { priceTimeout.current = setTimeout(() => setIsPriceOpen(false), 150); }}
              >
                <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm transition-colors cursor-pointer ${isPriceOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-700'}`}>
                  <span className="text-[14px] font-medium">
                    {priceFilter === 'ALL' ? 'Mọi mức giá' : priceFilter === 'LOW' ? 'Dưới 500k' : priceFilter === 'MEDIUM' ? '500k - 2 triệu' : 'Trên 2 triệu'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-200 ${isPriceOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className={`absolute right-0 top-full pt-1.5 transition-all duration-200 w-full ${isPriceOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                    {[
                      { value: 'ALL', label: 'Mọi mức giá' },
                      { value: 'LOW', label: 'Dưới 500.000đ' },
                      { value: 'MEDIUM', label: '500.000đ - 2.000.000đ' },
                      { value: 'HIGH', label: 'Trên 2.000.000đ' },
                    ].map(item => (
                      <button key={item.value} onClick={() => { setPriceFilter(item.value); setIsPriceOpen(false); setCurrentPage(1); }} className={`w-full text-left py-2 px-3 text-[13.5px] rounded-lg transition-all cursor-pointer ${priceFilter === item.value ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Type Filter */}
              <div
                className="w-[200px] shrink-0 relative z-30"
                onMouseEnter={() => { if (typeTimeout.current) clearTimeout(typeTimeout.current); setIsTypeOpen(true); }}
                onMouseLeave={() => { typeTimeout.current = setTimeout(() => setIsTypeOpen(false), 150); }}
              >
                <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm transition-colors cursor-pointer ${isTypeOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-700'}`}>
                  <span className="text-[14px] font-medium truncate pr-2">
                    {typeFilter === 'ALL' ? 'Tất cả dịch vụ' : typeFilter === 'LAB_TEST' ? 'Xét nghiệm' : typeFilter === 'X_RAY' ? 'Chụp X-Quang' : 'Khác'}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-200 ${isTypeOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className={`absolute right-0 top-full pt-1.5 transition-all duration-200 w-full ${isTypeOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                  <div className="rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                    {[
                      { value: 'ALL', label: 'Tất cả dịch vụ' },
                      { value: 'LAB_TEST', label: 'Xét nghiệm' },
                      { value: 'X_RAY', label: 'Chụp X-Quang' },
                    ].map(item => (
                      <button key={item.value} onClick={() => { setTypeFilter(item.value); setIsTypeOpen(false); setCurrentPage(1); }} className={`w-full text-left py-2 px-3 text-[13.5px] rounded-lg transition-all cursor-pointer ${typeFilter === item.value ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}>
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {currentItems.length > 0 ? (
            currentItems.map((service) => {
              const hasDiscount = !!(service.discountPrice && service.originalPrice && service.discountPrice < service.originalPrice);
              const discountPercent = hasDiscount ? Math.round((1 - service.discountPrice! / service.originalPrice!) * 100) : 0;

              return (
                <div
                  key={service.serviceId}
                  className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-10px_rgba(0,181,241,0.15)] hover:border-primary-200 transition-all duration-300 flex flex-col sm:flex-row gap-5 hover:-translate-y-1 group cursor-pointer"
                >
                  <div className="w-full sm:w-[120px] shrink-0 flex flex-col items-center">
                    <div className="w-[120px] h-[120px] bg-gradient-to-br from-primary-50 to-[#eef9ff] rounded-2xl p-3 flex items-center justify-center border border-slate-100 group-hover:border-primary-200 transition-colors">
                      <img src={`${staticUrl}${service.imageUrl}`} alt={service.serviceName} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-brand-dark text-[17px] leading-snug mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">{service.serviceName}</h3>
                      {service.description && (
                        <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-2 mb-3">
                          {service.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg w-fit text-slate-600 text-[13px] font-medium border border-slate-100">
                        <Building2 className="w-4 h-4 text-primary-400" />
                        <span>Phòng khám ClinicPro</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between mt-5 gap-4">
                      <div className="flex flex-col">
                        {hasDiscount ? (
                          <>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[13px] font-medium text-slate-400 line-through">
                                {formatPrice(service.originalPrice!)}
                              </span>
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-rose-100 text-rose-600">
                                -{discountPercent}%
                              </span>
                            </div>
                            <span className="text-primary-600 font-black text-[20px] leading-none">
                              {formatPrice(service.discountPrice!)}
                            </span>
                          </>
                        ) : (
                          <span className="text-primary-600 font-black text-[20px] leading-none">
                            {formatPrice(service.originalPrice || 0)}
                          </span>
                        )}
                      </div>
                      <ActionButton
                        onClick={() => handleBooking(service.serviceId)}
                        className="h-10 px-5 text-[13.5px] font-bold rounded-xl shadow-md shadow-primary-500/20 shrink-0"
                      >
                        Đặt lịch ngay
                      </ActionButton>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-10">
              <EmptyState title="Không tìm thấy dịch vụ" description="Vui lòng thử bộ lọc hoặc từ khóa tìm kiếm khác." />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pt-4 border-t border-slate-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </SectionContainer>
    </main>
  );
};