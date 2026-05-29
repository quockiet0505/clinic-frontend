import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Star, User, Stethoscope, ClipboardList, CalendarDays, CircleDollarSign, ChevronsRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState, Pagination, SearchFilterBar, SectionContainer, ActionButton } from '@/components/common';
import { homeApi } from '../api/homeApi';
import { getStaticUrl } from '@/utils/url';
import type { Doctor } from '../types/home';

export const DoctorDirectory: React.FC = () => {
  const navigate = useNavigate();
  // ... các state và logic giữ nguyên
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const staticUrl = getStaticUrl();

  useEffect(() => {
    homeApi.getDoctors().then(setDoctors);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const filteredDoctors = doctors.filter((doc) =>
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.expertise?.expertiseName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage) || 1;
  const currentItems = filteredDoctors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const defaultRating = 4.5;

  const handleBooking = (doctorId: number) => {
    navigate(`/appointments/book?type=doctor&doctorId=${doctorId}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <main className="w-full min-h-screen bg-[linear-gradient(180deg,#eef9ff_0%,#f8fcff_22%,#ffffff_42%)] pb-16">
      {/* ... phần header giữ nguyên ... */}
      <div className="relative w-full bg-transparent pt-10 pb-24">
        <SectionContainer className="max-w-6xl">
          <div className="bg-white rounded-3xl p-8 shadow-sm max-w-3xl border border-slate-100">
            <h1 className="text-2xl font-black text-primary-500 uppercase tracking-wide mb-5">Gọi video với bác sĩ</h1>
            <div className="flex flex-col gap-2.5 text-brand-dark font-medium text-sm mb-6">
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />Khám/tư vấn sức khỏe từ xa</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />Được nhắn tin với bác sĩ</p>
              <p className="flex items-start gap-3"><CheckCircle2 className="w-[18px] h-[18px] text-green-500 shrink-0 mt-0.5" />Được tư vấn tối thiểu 15 phút</p>
            </div>
            <div className="w-full h-px bg-slate-200 mb-5"></div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="text-brand-dark">Liên hệ chuyên gia</span>
              <a href="tel:19002115" className="flex items-center gap-1.5 text-primary-500 font-black text-lg">19002115</a>
              <Button className="bg-warning hover:bg-warning/80 text-white rounded-lg">Chat ngay</Button>
            </div>
          </div>
        </SectionContainer>
        <div className="absolute left-0 right-0 -bottom-7 flex justify-center z-20 px-4">
          <SearchFilterBar value={searchTerm} onChange={(val) => { setSearchTerm(val); setCurrentPage(1); }} placeholder="Tìm kiếm bác sĩ..." />
        </div>
      </div>

      <SectionContainer className="max-w-5xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-[60px] mb-10">
          {currentItems.length > 0 ? (
            currentItems.map((doctor, idx) => (
              <div key={doctor.staffId} className="cursor-pointer bg-white rounded-2xl p-5 shadow-md border border-slate-100 flex flex-col sm:flex-row gap-5 hover:shadow-xl hover:border-primary-500 transition-all">
                <div className="w-[130px] shrink-0 flex flex-col gap-3">
                  <div className="w-full h-[140px] bg-slate-100 rounded-xl overflow-hidden">
                    <img src={`${staticUrl}${doctor.imageUrl}`} alt={doctor.fullName} className="w-full h-full object-cover" />
                  </div>
                  <Button variant="secondary" className="text-xs">Xem chi tiết</Button>
                  <div className="flex items-center justify-between border border-primary-500 rounded-md px-2 py-1.5 bg-primary-50">
                    <div className="flex items-center gap-1 text-primary-500 font-bold text-[13px]">{defaultRating.toFixed(1)}<Star className="w-3.5 h-3.5 text-yellow-500 fill-current" /></div>
                    <div className="w-px h-3 bg-primary-500/30"></div>
                    <div className="flex items-center gap-1 text-primary-500 font-bold text-[13px]">{10 + idx * 15}<User className="w-3.5 h-3.5 text-orange-400 fill-current" /></div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-primary-500 text-lg mb-4">{doctor.fullName}</h3>
                  <div className="flex flex-col gap-2.5 text-sm flex-1">
                    <div className="flex items-start gap-2"><Stethoscope className="w-4 h-4 text-slate-400 shrink-0" /><span>{doctor.expertise?.expertiseName || 'Chuyên khoa tổng quát'}</span></div>
                    <div className="flex items-start gap-2"><ClipboardList className="w-4 h-4 text-slate-400 shrink-0" /><div className="flex justify-between items-center flex-1"><span>Khám tổng quát</span><button className="border border-primary-500 text-primary-500 p-0.5 rounded"><ChevronsRight className="w-3 h-3" /></button></div></div>
                    <div className="flex items-start gap-2"><CalendarDays className="w-4 h-4 text-slate-400 shrink-0" /><span>Hẹn khám</span></div>
                    <div className="flex items-start gap-2"><CircleDollarSign className="w-4 h-4 text-slate-400 shrink-0" /><span>{formatPrice(doctor.consultationFee || 200000)}</span></div>
                  </div>
                  {/* Thay Button bằng ActionButton, */}
                  <ActionButton
                    onClick={() => handleBooking(doctor.staffId)}
                    // className="mt-5 rounded-full "
                    className="mt-4 h-11 px-6 text-sm"
                  >
                    Đặt ngay
                  </ActionButton>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full"><EmptyState title="Không tìm thấy bác sĩ" description="Vui lòng thử từ khóa khác." /></div>
          )}
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </SectionContainer>
    </main>
  );
};