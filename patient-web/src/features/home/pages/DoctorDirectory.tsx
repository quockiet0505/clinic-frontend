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
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('ALL');
  const [priceFilter, setPriceFilter] = useState('ALL');
  const [genderFilter, setGenderFilter] = useState('ALL');

  const [isSpecialtyOpen, setIsSpecialtyOpen] = useState(false);
  const specialtyTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isPriceOpen, setIsPriceOpen] = useState(false);
  const priceTimeout = useRef<NodeJS.Timeout | undefined>(undefined);
  const [isGenderOpen, setIsGenderOpen] = useState(false);
  const genderTimeout = useRef<NodeJS.Timeout | undefined>(undefined);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const staticUrl = getStaticUrl(); // dùng cho avatar bác sĩ

  const [bannerUrl, setBannerUrl] = useState('/images/banners/doctor.webp');

  useEffect(() => {
    homeApi.getSpecialties()
      .then((data: any) => {
        if (Array.isArray(data)) {
          setSpecialties(data.map((item: any) => item.name).filter(Boolean));
        }
      })
      .catch(console.error);

    homeApi.getBanner('doctor')
      .then(url => setBannerUrl(url))
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      setIsLoading(true);
      try {
        const params: any = {
          page: currentPage - 1,
          size: itemsPerPage,
        };

        if (searchTerm) params.search = searchTerm;
        if (specialtyFilter !== 'ALL') params.expertiseName = specialtyFilter;
        if (genderFilter !== 'ALL') params.gender = genderFilter;

        if (priceFilter === 'LOW') {
          params.maxPrice = 299999;
        } else if (priceFilter === 'MEDIUM') {
          params.minPrice = 300000;
          params.maxPrice = 500000;
        } else if (priceFilter === 'HIGH') {
          params.minPrice = 500001;
        }

        const res = await homeApi.getDoctorsPaginated(params);
        setDoctors(res.content || []);
        setTotalPages(res.totalPages || 1);
      } catch (error) {
        console.error("Lỗi tải danh sách bác sĩ:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, [currentPage, searchTerm, specialtyFilter, genderFilter, priceFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleBooking = (doctorId: number) => {
    navigate(`/appointments/book?type=doctor&doctorId=${doctorId}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="w-full min-h-screen bg-[#f0f9ff] pb-16">
      <div className="relative w-full min-h-[380px] flex items-center justify-center pt-10 pb-20">
        <div className="absolute inset-0 z-0">
          <img
            src={bannerUrl} // đã có full URL
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop'; }}
            alt="Doctor Banner"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-[var(--color-banner-dark-end)]"></div>
        </div>
        <SectionContainer className="max-w-6xl relative z-10 w-full text-white">
          <div className="max-w-2xl">
            <h1 className="text-[32px] md:text-[36px] leading-tight font-black uppercase tracking-wide mb-5 text-white drop-shadow-sm">
              ĐỘI NGŨ<br /><span className="text-[#38bdf8]">BÁC SĨ CHUYÊN KHOA</span>
            </h1>
            <div className="flex flex-col gap-3 font-medium text-[15px] mb-7 text-slate-100">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Đội ngũ bác sĩ giàu kinh nghiệm, chuyên môn cao</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Tư vấn sức khỏe từ xa tiện lợi, bảo mật tuyệt đối</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-[#38bdf8] shrink-0 mt-0.5" />Thời lượng tư vấn tối thiểu 15 phút, đảm bảo chất lượng</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 w-fit shadow-lg">
              <span>Liên hệ hỗ trợ đặt khám:</span>
              <a href="tel:19002115" className="flex items-center gap-1.5 text-white font-black text-xl hover:text-primary-300 transition-colors">19002115</a>
            </div>
          </div>
        </SectionContainer>

        {/* Removed floating search bar from here, moved to unified toolbar */}
      </div>

      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8 mb-6">
          <h2 className="text-[22px] font-bold text-brand-dark hidden lg:block">Danh sách Bác sĩ</h2>
          
          <div className="flex-1 w-full lg:w-auto bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-2">
            <div className="w-full lg:w-[45%] lg:flex-1 shrink min-w-[200px]">
              <SearchInput
                value={searchTerm}
                onSearch={(val) => { setSearchTerm(val); setCurrentPage(1); }}
                placeholder="Tìm tên bác sĩ, chuyên khoa..."
                className="h-11 shadow-none border-transparent hover:border-slate-200 bg-slate-50 focus-within:bg-white focus-within:border-primary-300 transition-all"
              />
            </div>
            <div className="w-px h-8 bg-slate-100 hidden lg:block mx-1 shrink-0"></div>
            <div className="flex flex-wrap lg:flex-nowrap items-center justify-end gap-2 w-full lg:w-auto shrink-0">
            {/* Chuyên khoa Filter */}
            <div
              className="w-[200px] shrink-0 relative z-50"
              onMouseEnter={() => { if (specialtyTimeout.current) clearTimeout(specialtyTimeout.current); setIsSpecialtyOpen(true); }}
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

            {/* Price Filter */}
            <div
              className="w-[180px] shrink-0 relative z-40"
              onMouseEnter={() => { if (priceTimeout.current) clearTimeout(priceTimeout.current); setIsPriceOpen(true); }}
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

            {/* Gender Filter */}
            <div
              className="w-[140px] shrink-0 relative z-30"
              onMouseEnter={() => { if (genderTimeout.current) clearTimeout(genderTimeout.current); setIsGenderOpen(true); }}
              onMouseLeave={() => { genderTimeout.current = setTimeout(() => setIsGenderOpen(false), 150); }}
            >
              <button className={`w-full h-11 flex items-center justify-between px-4 rounded-xl bg-white border shadow-sm transition-colors cursor-pointer ${isGenderOpen ? 'border-primary-500 text-primary-600' : 'border-slate-200 text-slate-700'}`}>
                <span className="text-[14px] font-medium">
                  {genderFilter === 'ALL' ? 'Giới tính' : genderFilter === 'MALE' ? 'Nam' : 'Nữ'}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 transition-transform duration-200 ${isGenderOpen ? 'rotate-180 text-primary-500' : 'text-slate-400'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
              </button>
              <div className={`absolute right-0 top-full pt-1.5 transition-all duration-200 w-full ${isGenderOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}`}>
                <div className="rounded-xl bg-white border border-slate-100 shadow-xl p-1.5 flex flex-col gap-0.5">
                  {[
                    { value: 'ALL', label: 'Tất cả' },
                    { value: 'MALE', label: 'Nam' },
                    { value: 'FEMALE', label: 'Nữ' },
                  ].map(item => (
                    <button key={item.value} onClick={() => { setGenderFilter(item.value); setIsGenderOpen(false); setCurrentPage(1); }} className={`w-full text-left py-2 px-3 text-[13.5px] rounded-lg transition-all cursor-pointer ${genderFilter === item.value ? 'bg-primary-50 text-primary-600 font-bold' : 'text-slate-700 hover:bg-slate-50 font-medium'}`}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12 ${isLoading ? 'opacity-50 pointer-events-none' : 'transition-opacity duration-300'}`}>
          {doctors.length > 0 ? (
            doctors.map((doctor, idx) => (
              <div key={doctor.staffId} className="bg-white rounded-[24px] p-5 border border-slate-100 shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_-10px_rgba(0,181,241,0.15)] hover:border-primary-200 transition-all duration-300 flex flex-col sm:flex-row gap-5 hover:-translate-y-1 group">
                <div className="w-full sm:w-[130px] shrink-0 flex flex-col items-center">
                  <div className="w-[120px] h-[120px] sm:w-[130px] sm:h-[130px] bg-gradient-to-br from-primary-50 to-[#eef5fa] rounded-2xl overflow-hidden relative border border-slate-100 group-hover:border-primary-200 transition-colors">
                    <img src={`${staticUrl}${doctor.imageUrl}`} alt={doctor.fullName} className="w-full h-full object-cover" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2 border border-slate-100 rounded-xl px-3 py-1.5 bg-slate-50 text-slate-600 w-full">
                    <div className="flex items-center gap-1 font-bold text-[13px]">{doctor.rating?.toFixed(1) || '4.5'}<Star className="w-3.5 h-3.5 text-amber-400 fill-current" /></div>
                    <div className="w-px h-3.5 bg-slate-200"></div>
                    <div className="flex items-center gap-1 font-bold text-[13px]">{doctor.patientCount || (50 + (doctor.staffId % 20))}<User className="w-3.5 h-3.5 text-primary-400 fill-current" /></div>
                  </div>
                </div>

                <div className="flex-1 flex flex-col">
                  <h3 className="text-[18px] mb-2 text-brand-dark leading-tight">
                    <span className="font-normal text-slate-500 text-[14px] block mb-0.5">Bác sĩ chuyên khoa</span>
                    <strong className="font-black text-brand-dark">{doctor.fullName}</strong>
                  </h3>
                  
                  <div className="flex flex-col gap-2.5 text-[14px] flex-1 text-slate-600 mt-2">
                    <div className="flex items-start gap-2.5">
                      <Stethoscope className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-700">{doctor.expertiseName || 'Đa khoa'}</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <ClipboardList className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <div className="flex justify-between items-center flex-1">
                        <span className="line-clamp-1">{doctor.specialtyTreatment || 'Đang cập nhật...'}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <Wallet className="w-4 h-4 text-primary-400 shrink-0 mt-0.5" />
                      <span>Giá khám: <span className="font-bold text-primary-600">{formatPrice(doctor.consultationFee || 0)}</span></span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-slate-50 flex">
                    <ActionButton
                      onClick={() => handleBooking(doctor.staffId)}
                      className="w-full h-11 text-[14px] font-bold rounded-xl shadow-md shadow-primary-500/20"
                    >
                      Đặt khám ngay
                    </ActionButton>
                  </div>
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