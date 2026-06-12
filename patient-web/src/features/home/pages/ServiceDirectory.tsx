import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState, Pagination, SectionContainer, ActionButton } from '@/components/common';
import { SearchInput } from '@/components/common/SearchInput';
import { homeApi } from '../api/homeApi';
import { getStaticUrl } from '@/utils/url';
import type { ServicePackage } from '../types/home';

export const ServiceDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('ALL');

  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceTimeout = useRef<NodeJS.Timeout>();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const staticUrl = getStaticUrl();

  useEffect(() => {
    homeApi.getServices().then(setServices);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredServices = services.filter((s) => {
    const matchesSearch = s.serviceName.toLowerCase().includes(searchTerm.toLowerCase());

    let matchesPrice = true;
    const price = s.discountPrice || s.originalPrice || 0;
    if (priceFilter === 'LOW') matchesPrice = price < 500000;
    else if (priceFilter === 'MEDIUM') matchesPrice = price >= 500000 && price <= 2000000;
    else if (priceFilter === 'HIGH') matchesPrice = price > 2000000;

    return matchesSearch && matchesPrice;
  });

  const totalPages = Math.ceil(filteredServices.length / itemsPerPage) || 1;
  const currentItems = filteredServices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleBooking = (serviceId: number) => {
    navigate(`/appointments/book?type=service&serviceId=${serviceId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="w-full min-h-screen bg-[#f4f8fb] pb-16">
      <div className="relative w-full min-h-[380px] flex items-center justify-center bg-[#154679] pt-10 pb-20">
        <div className="absolute inset-0 z-0">
          <img src={`${staticUrl}/images/banners/service.jpg`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=2080&auto=format&fit=crop'; }} alt="Service Banner" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#154679]/60 via-[#154679]/20 to-transparent"></div>        </div>
        <SectionContainer className="max-w-6xl relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h1 className="text-[32px] md:text-[36px] leading-tight font-black uppercase tracking-wide mb-5 text-white drop-shadow-sm">
              ĐẶT LỊCH<br /><span className="text-[#38bdf8]">XÉT NGHIỆM</span>
            </h1>
            <div className="flex flex-col gap-3 font-medium text-[15px] mb-7 text-slate-100">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Đặt lịch xét nghiệm trực tiếp, không qua khâu khám trước</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Giảm thiểu thời gian chờ đợi</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Được hoàn phí nếu hủy phiếu</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Được hưởng chính sách hoàn tiền khi đặt lịch trên medpro</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Linh hoạt lựa chọn xét nghiệm tại cơ sở hoặc tại nhà</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 w-fit shadow-lg">
              <span>Liên hệ chuyên gia để tư vấn thêm:</span>
              <a href="tel:19002115" className="flex items-center gap-1.5 text-white font-black text-xl hover:text-primary-300 transition-colors">19002115</a>
              <span className="opacity-60">hoặc</span>
              <Button className="bg-warning hover:bg-warning/90 text-white rounded-xl px-5 py-4 shadow-lg shadow-warning/20 border-none font-bold">Chat ngay</Button>
            </div>
          </div>
        </SectionContainer>

        {/* Floating Search Bar (Gọn hơn) */}
        <div className="absolute left-0 right-0 -bottom-7 flex justify-center z-20 px-4">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_12px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden">
            <SearchInput
              value={searchTerm}
              onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
              placeholder="Tìm kiếm dịch vụ xét nghiệm..."
              className="h-[56px] w-full shadow-none border-0 px-2"
            />
          </div>
        </div>
      </div>

      <SectionContainer className="max-w-5xl">
        {/* Khu vực Lọc riêng biệt */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 mb-6">
          <h2 className="text-[22px] font-bold text-brand-dark">Danh sách Dịch vụ Xét nghiệm</h2>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mức giá Filter */}
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {currentItems.length > 0 ? (
            currentItems.map((service) => (
              <div
                key={service.serviceId}
                className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-10px_rgba(0,181,241,0.15)] hover:border-primary-200 transition-all duration-300 flex flex-col sm:flex-row gap-6 hover:-translate-y-1 group cursor-pointer"
              >
                <div className="w-[100px] h-[100px] bg-gradient-to-br from-primary-50 to-[#eef9ff] rounded-2xl p-4 flex items-center justify-center shrink-0 border border-primary-100 group-hover:border-primary-300 transition-colors">
                  <img src={`${staticUrl}${service.imageUrl}`} alt={service.serviceName} className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-dark text-[17px] leading-snug mb-3 line-clamp-2 group-hover:text-primary-500 transition-colors">{service.serviceName}</h3>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg w-fit text-slate-600 text-[13px] font-medium border border-slate-100">
                      <Building2 className="w-4 h-4 text-primary-500" />
                      <span>Phòng khám ClinicPro</span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mt-5 gap-4">
                    <span className="text-[#ff6b00] font-black text-[18px]">{formatPrice(service.discountPrice || service.originalPrice || 0)}</span>
                    <ActionButton
                      onClick={() => handleBooking(service.serviceId)}
                      className="h-[42px] px-6 text-[14.5px] font-bold rounded-xl shadow-lg shadow-primary-500/20"
                    >
                      Đặt khám
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))
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