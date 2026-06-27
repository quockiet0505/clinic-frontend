import React, { useState, useEffect } from 'react';
import { SectionContainer } from '@/components/common';
import { ChevronDown, MessageCircleQuestion, PhoneCall, CalendarCheck, ShieldQuestion, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const faqs = [
  {
    id: 'booking',
    category: 'Lịch hẹn',
    question: 'Làm thế nào để đặt lịch khám?',
    answer: `Bạn có thể đặt lịch khám tại ClinicPro bằng một trong các phương thức sau:
    <ul class="list-disc pl-5 mt-3 space-y-2">
      <li><strong>Đặt lịch trực tuyến:</strong> Truy cập trang <a href="/appointments/book" class="text-primary-600 hover:underline cursor-pointer font-semibold">Đặt Lịch Hẹn</a> trên website, chọn chuyên khoa/bác sĩ và thời gian mong muốn.</li>
      <li><strong>Gọi điện trực tiếp:</strong> Liên hệ qua Hotline <strong class="text-brand-dark">1900 2115</strong> để được nhân viên hỗ trợ đặt lịch nhanh chóng.</li>
      <li><strong>Trực tiếp tại phòng khám:</strong> Đến quầy tiếp nhận tại 71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM.</li>
    </ul>`,
    icon: <CalendarCheck className="w-5 h-5" />,
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-600',
    accentBadge: 'bg-sky-100 text-sky-700',
    accentBorder: 'border-sky-200',
    accentOpen: 'bg-sky-50/50',
  },
  {
    id: 'cancellation',
    category: 'Chính sách',
    question: 'Hủy lịch hẹn trước bao lâu?',
    answer: `Để đảm bảo quyền lợi và sự thuận tiện cho cả bạn và các bệnh nhân khác, chúng tôi khuyến khích bạn <strong>hủy hoặc thay đổi lịch hẹn ít nhất 3 giờ</strong> trước giờ khám dự kiến.<br><br>Bạn có thể thực hiện dễ dàng tại mục <a href="/appointments/my" class="text-primary-600 hover:underline cursor-pointer font-semibold">Lịch hẹn của tôi</a> và chọn "Hủy lịch hẹn", hoặc gọi trực tiếp vào tổng đài hỗ trợ.`,
    icon: <ShieldQuestion className="w-5 h-5" />,
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-600',
    accentBadge: 'bg-emerald-100 text-emerald-700',
    accentBorder: 'border-emerald-200',
    accentOpen: 'bg-emerald-50/30',
  },
  {
    id: 'payment',
    category: 'Thanh toán',
    question: 'Các phương thức thanh toán?',
    answer: `Tại ClinicPro, chúng tôi hỗ trợ đa dạng các hình thức thanh toán nhằm mang lại sự tiện lợi tối đa:
    <ul class="list-disc pl-5 mt-3 space-y-2">
      <li><strong>Thanh toán tiền mặt:</strong> Tại quầy thu ngân của phòng khám.</li>
      <li><strong>Thẻ ngân hàng (ATM/Visa/MasterCard):</strong> Chúng tôi hỗ trợ quẹt thẻ không mất phí.</li>
      <li><strong>Chuyển khoản / Quét mã QR:</strong> Hỗ trợ thanh toán nhanh qua Momo, ZaloPay và mã VNPay QR.</li>
    </ul>`,
    icon: <MessageCircleQuestion className="w-5 h-5" />,
    accentBg: 'bg-violet-50',
    accentText: 'text-violet-600',
    accentBadge: 'bg-violet-100 text-violet-700',
    accentBorder: 'border-violet-200',
    accentOpen: 'bg-violet-50/30',
  },
  {
    id: 'after-hours',
    category: 'Hoạt động',
    question: 'Phòng khám có khám ngoài giờ không?',
    answer: `Hiện tại, giờ làm việc hành chính của chúng tôi là từ <strong>07:30 – 17:00 (Thứ 2 đến Chủ Nhật)</strong>.<br><br>
    Trong trường hợp cần khám ngoài giờ hoặc cấp cứu, vui lòng liên hệ trước qua đường dây nóng <a href="tel:19002115" class="text-primary-600 font-bold hover:underline cursor-pointer">1900 2115</a> để chúng tôi chuẩn bị đội ngũ y bác sĩ trực tiếp đón nhận.`,
    icon: <PhoneCall className="w-5 h-5" />,
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-600',
    accentBadge: 'bg-amber-100 text-amber-700',
    accentBorder: 'border-amber-200',
    accentOpen: 'bg-amber-50/30',
  }
];

export const FAQPage: React.FC = () => {
  const location = useLocation();
  const defaultOpen = (location.state as { defaultOpen?: string } | null)?.defaultOpen ?? 'booking';
  const [openId, setOpenId] = useState<string | null>(defaultOpen);

  useEffect(() => {
    const id = (location.state as { defaultOpen?: string } | null)?.defaultOpen;
    if (id) setOpenId(id);
  }, [location.state]);

  return (
    <main className="w-full min-h-screen bg-[#f0f9ff]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-20 px-4 text-center">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <SectionContainer className="max-w-4xl relative z-10">
          <span className="inline-block text-[11px] font-bold uppercase tracking-widest text-white mb-4 bg-white/20 px-4 py-1.5 rounded-full border border-white/30 shadow-sm">
            Hỗ trợ & Hướng dẫn
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight drop-shadow-sm">
            Câu Hỏi Thường Gặp
          </h1>
          <p className="text-white/90 text-base max-w-2xl mx-auto leading-relaxed drop-shadow-sm">
            Mọi thắc mắc về dịch vụ, quy trình khám chữa bệnh và cách thanh toán — bạn đều tìm thấy ở đây.
          </p>
        </SectionContainer>
      </div>

      {/* ── Category pills ── */}
      <div className="bg-white border-b border-primary-100 sticky top-[62px] z-20 shadow-sm">
        <SectionContainer className="max-w-4xl">
          <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
            {faqs.map(faq => (
              <button
                key={faq.id}
                onClick={() => setOpenId(faq.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold whitespace-nowrap transition-all cursor-pointer border ${
                  openId === faq.id
                    ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                }`}
              >
                <span className={openId === faq.id ? 'text-white/80' : faq.accentText}>
                  {faq.icon}
                </span>
                {faq.category}
              </button>
            ))}
          </div>
        </SectionContainer>
      </div>

      {/* ── FAQ List ── */}
      <SectionContainer className="max-w-4xl py-10">
        <div className="flex flex-col gap-3">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
                  isOpen ? `${faq.accentBorder} ${faq.accentOpen} shadow-md` : 'border-slate-200 bg-white hover:border-primary-200'
                }`}
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 md:p-6 cursor-pointer text-left focus:outline-none active:scale-[0.99]"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${isOpen ? `${faq.accentBg} ${faq.accentText} shadow-sm` : 'bg-slate-100 text-slate-500'}`}>
                      {faq.icon}
                    </div>
                    <div>
                      <span className={`text-[10px] font-bold uppercase tracking-widest block mb-0.5 ${isOpen ? faq.accentText : 'text-slate-400'}`}>{faq.category}</span>
                      <h3 className={`font-bold text-[15px] md:text-[16px] transition-colors ${isOpen ? 'text-brand-dark' : 'text-slate-700'}`}>
                        {faq.question}
                      </h3>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-all duration-300 ${isOpen ? `${faq.accentText} rotate-180` : 'text-slate-300'}`} />
                </button>

                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div
                    className="px-6 pb-6 text-[14px] leading-relaxed text-slate-600 ml-[60px]"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 bg-gradient-to-br from-brand-dark to-primary-700 rounded-2xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
          <div>
            <h3 className="font-black text-white text-lg">Không tìm thấy câu trả lời?</h3>
            <p className="text-primary-200 text-sm mt-1">Đội ngũ CSKH sẵn sàng hỗ trợ bạn trực tiếp.</p>
          </div>
          <Link
            to="/contact"
            className="flex items-center gap-2 px-6 py-3 bg-white text-brand-dark font-bold rounded-xl hover:bg-primary-50 transition-colors cursor-pointer whitespace-nowrap text-sm"
          >
            Liên hệ ngay
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </SectionContainer>
    </main>
  );
};
