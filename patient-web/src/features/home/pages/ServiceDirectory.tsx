import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  EmptyState,
  Pagination,
  SearchFilterBar,
  SectionContainer,
  ActionButton,
} from '@/components/common';
import { homeApi } from '../api/homeApi';
import { getStaticUrl } from '@/utils/url';
import type { ServicePackage } from '../types/home';

export const ServiceDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState<ServicePackage[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<'all' | 'low' | 'high'>('all');
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
    const price = s.discountPrice || s.price;
    const matchesPrice =
      priceFilter === 'all' ? true : priceFilter === 'low' ? price < 500000 : price >= 500000;
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
    <main className="w-full min-h-screen bg-[linear-gradient(180deg,#eef9ff_0%,#f8fcff_22%,#ffffff_42%)] pb-16">
      <div className="relative w-full pt-10 pb-24">
        <SectionContainer className="max-w-6xl">
          <div className="bg-white/95 backdrop-blur-sm rounded-[32px] p-8 shadow-[0_12px_40px_rgba(15,23,42,0.06)] max-w-3xl border border-white">
            <h1 className="text-3xl font-black text-primary-500 uppercase tracking-wide mb-6">Đặt lịch xét nghiệm</h1>
            <div className="flex flex-col gap-3 text-brand-dark font-medium text-[15px] mb-7">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />Đặt lịch trực tiếp</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />Giảm thời gian chờ</p>
            </div>
            <div className="w-full h-px bg-slate-200 mb-6"></div>
            <div className="flex items-center gap-3">
              <a href="tel:19002115" className="text-primary-500 font-black text-lg flex items-center gap-2">19002115</a>
              <Button className="bg-warning hover:bg-warning/90 text-white rounded-full px-5">Chat ngay</Button>
            </div>
          </div>
        </SectionContainer>
        <div className="absolute left-0 right-0 -bottom-9 flex justify-center z-20 px-4">
          <SearchFilterBar
            value={searchTerm}
            onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
            priceFilter={priceFilter}
            onPriceFilterChange={(val) => { setPriceFilter(val); setCurrentPage(1); }}
            placeholder="Tìm kiếm dịch vụ..."
          />
        </div>
      </div>

      <SectionContainer className="max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[72px] mb-12">
          {currentItems.length > 0 ? (
            currentItems.map((service) => (
              <div
                key={service.serviceId}
                className="bg-white/95 backdrop-blur-sm rounded-3xl p-5 border border-transparent hover:border-primary-500 shadow-[0_8px_30px_rgba(15,23,42,0.06)] hover:shadow-[0_16px_40px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-300 flex gap-4 cursor-pointer hover:bg-primary-50/30"
              >
                <div className="w-[76px] h-[76px] bg-primary-50 rounded-2xl p-3 flex items-center justify-center shrink-0">
                  <img src={`${staticUrl}${service.imageUrl}`} alt={service.serviceName} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-brand-dark text-[16px] leading-snug mb-2 line-clamp-2">{service.serviceName}</h3>
                    <div className="flex items-start gap-2 text-slate-500 text-sm">
                      <Building2 className="w-4 h-4 mt-[2px]" />
                      <span>ClinicPro</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-5">
                    <span className="text-warning font-black text-[17px]">{formatPrice(service.discountPrice || service.price)}</span>
                    {/* Thay Button bằng ActionButton, giữ class cũ */}
                    <ActionButton
                      onClick={() => handleBooking(service.serviceId)}
                      // className="mt-5 rounded-full px-6"
                      className="mt-4 h-11 px-6 text-sm"
                    >
                      Đặt khám
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full">
              <EmptyState title="Không tìm thấy dịch vụ" description="Vui lòng thử từ khóa khác." />
            </div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </SectionContainer>
    </main>
  );
};