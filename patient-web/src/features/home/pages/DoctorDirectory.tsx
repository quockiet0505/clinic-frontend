import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, User, Stethoscope, ClipboardList, CalendarDays, Wallet, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState, Pagination, SectionContainer, ActionButton } from '@/components/common';
import { SearchInput } from '@/components/common/SearchInput';
import { homeApi } from '../api/homeApi';
import { getStaticUrl } from '@/utils/url';
import type { Doctor } from '../types/home';

export const DoctorDirectory: React.FC = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('ALL');
  
  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const specialtyTimeout = useRef<NodeJS.Timeout>();
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceTimeout = useRef<NodeJS.Timeout>();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const staticUrl = getStaticUrl();

  useEffect(() => {
    homeApi.getDoctors().then(setDoctors);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredDoctors = doctors.filter((doc) => {
    const matchesSearch = doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || doc.expertiseName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialtyFilter === 'ALL' || doc.expertiseName === specialtyFilter;
    
    let matchesPrice = true;
    const fee = doc.consultationFee || 300000;
    if (priceFilter === 'LOW') matchesPrice = fee < 300000;
    else if (priceFilter === 'MEDIUM') matchesPrice = fee >= 300000 && fee <= 500000;
    else if (priceFilter === 'HIGH') matchesPrice = fee > 500000;

    return matchesSearch && matchesSpecialty && matchesPrice;
  });

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const currentItems = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const defaultRating = 4.9;

  const handleBooking = (doctorId: number) => {
    navigate(`/appointments/book?type=doctor&doctorId=${doctorId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const specialties = Array.from(new Set(doctors.map(d => d.expertiseName).filter(Boolean)));

  return (
    <main className="w-full min-h-screen bg-[#f4f8fb] pb-16">
      <div className="relative w-full min-h-[380px] flex items-center justify-center bg-[#154679] pt-10 pb-20">
        <div className="absolute inset-0 z-0">
          <img src={`${staticUrl}/images/banners/doctor.webp`} onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop'; }} alt="Doctor Banner" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#154679]/95 via-[#154679]/80 to-transparent"></div>
        </div>
        <SectionContainer className="max-w-6xl relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h1 className="text-[32px] md:text-[36px] leading-tight font-black uppercase tracking-wide mb-5 text-white drop-shadow-sm">
              GỌI VIDEO VỚI<br/><span className="text-[#38bdf8]">BÁC SĨ CHUYÊN KHOA</span>
            </h1>
            <div className="flex flex-col gap-3 font-medium text-[15px] mb-7 text-slate-100">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Khám và tư vấn sức khỏe từ xa tiện lợi</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Được nhắn tin riêng tư với bác sĩ</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Thời lượng tư vấn tối thiểu 15 phút, đảm bảo chất lượng</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Bảo mật tuyệt đối hồ sơ y tế</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 w-fit shadow-lg">
              <span>Liên hệ hỗ trợ đặt khám:</span>
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
              placeholder="Tìm theo tên bác sĩ, chuyên khoa..." 
              className="h-[56px] w-full shadow-none border-0 px-2" 
            />
          </div>
        </div>
      </div>

      <SectionContainer className="max-w-5xl">
        {/* Khu vực Lọc riêng biệt */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-16 mb-6">
          <h2 className="text-[22px] font-bold text-brand-dark">Danh sách Bác sĩ</h2>
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Chuyên khoa Filter */}
            <div 
              className="w-[200px] shrink-0 relative z-50"
              onMouseEnter={() => { if(specialtyTimeout.current) clearTimeout(specialtyTimeout.current); setIsSpecialtyOpen(true); }}
              onMouseLeave={() => { specialtyTimeout.current = setTimeout(() => setIsSpecialtyOpen(false), 150); }}
            >
              <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm transition-colors cursor-pointer ${isSpecialtyOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-700'}`}>
                <span className="text-[14px] font-medium truncate pr-2">
                  {specialtyFilter === 'ALL' ? 'Tất cả chuyên khoa' : specialtyFilter}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-200 ${isSpecialtyOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className={`absolute left-0 right-0 top-full pt-1.5 transition-all duration-200 ${isSpecialtyOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5 max-h-60 overflow-y-auto">
                  <button onClick={() => { setSpecialtyFilter('ALL'); setIsSpecialtyOpen(false); setCurrentPage(1); }} className={`w-full text-left py-2 px-3 text-[13.5px] rounded-lg transition-all cursor-pointer ${specialtyFilter === 'ALL' ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}>Tất cả chuyên khoa</button>
                  {specialties.map(spec => (
                    <button key={spec} onClick={() => { setSpecialtyFilter(spec as string); setIsSpecialtyOpen(false); setCurrentPage(1); }} className={`w-full text-left py-2 px-3 text-[13.5px] rounded-lg transition-all cursor-pointer ${specialtyFilter === spec ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}>
                      {spec}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mức giá Filter */}
            <div 
              className="w-[180px] shrink-0 relative z-40"
              onMouseEnter={() => { if(priceTimeout.current) clearTimeout(priceTimeout.current); setIsPriceOpen(true); }}
              onMouseLeave={() => { priceTimeout.current = setTimeout(() => setIsPriceOpen(false), 150); }}
            >
              <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm transition-colors cursor-pointer ${isPriceOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-700'}`}>
                <span className="text-[14px] font-medium">
                  {priceFilter === 'ALL' ? 'Mọi mức giá' : priceFilter === 'LOW' ? 'Dưới 300k' : priceFilter === 'MEDIUM' ? '300k - 500k' : 'Trên 500k'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-200 ${isPriceOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className={`absolute right-0 top-full pt-1.5 transition-all duration-200 w-[200px] ${isPriceOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                  {[
                    { value: 'ALL', label: 'Mọi mức giá' },
                    { value: 'LOW', label: 'Dưới 300.000đ' },
                    { value: 'MEDIUM', label: '300.000đ - 500.000đ' },
                    { value: 'HIGH', label: 'Trên 500.000đ' },
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {currentItems.length > 0 ? (
            currentItems.map((doctor, idx) => (
              <div key={doctor.staffId} className="bg-white rounded-[28px] p-6 border border-slate-100 shadow-[0_4px_24px_-8px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-10px_rgba(0,181,241,0.15)] hover:border-primary-200 transition-all duration-300 flex gap-6 hover:-translate-y-1 group">
                
                {/* Left Side: Avatar & Rating */}
                <div className="w-[140px] shrink-0 flex flex-col items-center">
                  <div className="w-[140px] h-[150px] bg-[#eef5fa] rounded-2xl overflow-hidden relative border border-slate-50 group-hover:border-primary-100 transition-colors">
                    <img src={`${staticUrl}${doctor.imageUrl}`} alt={doctor.fullName} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 py-1.5 bg-white/90 backdrop-blur-sm text-center text-[12px] font-bold text-slate-700 border-t border-white shadow-sm">
                      Xem chi tiết
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 border border-primary-400 rounded-xl px-4 py-2 bg-white shadow-sm text-primary-500 w-full">
                    <div className="flex items-center gap-1 font-bold text-[14px]">{defaultRating.toFixed(1)}<Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /></div>
                    <div className="w-px h-3.5 bg-slate-300"></div>
                    <div className="flex items-center gap-1 font-bold text-[14px]">{10 + idx * 15}<User className="w-3.5 h-3.5 text-orange-400 fill-current" /></div>
                  </div>
                </div>

                {/* Right Side: Info & Actions */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl mb-3 text-brand-dark">
                    <span className="font-normal text-primary-500">Bác sĩ </span>
                    <strong className="font-black text-primary-500">{doctor.fullName}</strong>
                  </h3>
                  <div className="w-full h-px bg-slate-100 mb-4"></div>
                  
                  <div className="flex flex-col gap-3 text-[14.5px] flex-1 text-slate-700">
                    <div className="flex items-start gap-3">
                      <Stethoscope className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>Chuyên khoa: <span className="font-medium text-brand-dark">{doctor.expertiseName || 'Chuyên khoa tổng quát'}</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <ClipboardList className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <div className="flex justify-between items-center flex-1">
                        <span className="line-clamp-1">Chuyên trị: Tư vấn tâm lý - điều trị...</span>
                        <button className="border border-primary-200 text-primary-500 bg-primary-50 px-1 py-0.5 rounded-md shrink-0 hover:bg-primary-500 hover:text-white transition-colors">
                          <ChevronsRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarDays className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>Lịch khám: <span className="font-medium text-brand-dark">Hẹn khám</span></span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Wallet className="w-4.5 h-4.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>Giá khám: <span className="font-bold text-brand-dark">{formatPrice(doctor.consultationFee || 300000)}</span></span>
                    </div>
                  </div>

                  <ActionButton
                    onClick={() => handleBooking(doctor.staffId)}
                    className="mt-5 w-full h-[46px] text-[15px] font-bold rounded-xl shadow-lg shadow-primary-500/20"
                  >
                    Đặt ngay
                  </ActionButton>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10">
              <EmptyState title="Không tìm thấy bác sĩ" description="Vui lòng thay đổi bộ lọc hoặc tìm kiếm bằng từ khóa khác." />
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