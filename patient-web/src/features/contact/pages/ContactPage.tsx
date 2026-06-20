import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageSquare, CheckCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SectionContainer } from '@/components/common';
import { homeApi } from '@/features/home/api/homeApi';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', subject: 'Khác', message: '' });
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    homeApi.getSystemSettings().then(setSettings).catch(console.error);
  }, []);

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await homeApi.submitContactMessage({
        fullName: form.name,
        phone: form.phone,
        email: form.email,
        subject: form.subject,
        content: form.message
      });
      setSent(true);
    } catch (error) {
      console.error(error);
      alert('Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const contactCards = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Hotline 24/7',
      value: settings?.phone || '1900 2115',
      sub: 'Miễn phí cuộc gọi',
      accent: 'from-sky-400 to-primary-500',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email hỗ trợ',
      value: settings?.email || 'cskh@clinic.com',
      sub: 'Phản hồi trong 24h',
      accent: 'from-primary-500 to-primary-600',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Địa chỉ',
      value: settings?.address ? settings.address.split(',')[0] : '71-73 Ngô Thời Nhiệm',
      sub: settings?.address ? settings.address.split(',').slice(1).join(',').trim() : 'Phường Võ Thị Sáu, Quận 3',
      accent: 'from-primary-600 to-brand-dark',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Giờ làm việc',
      value: settings?.operatingHours ? settings.operatingHours.split(',')[0] : 'T2 – T7: 07:00 – 16:30',
      sub: settings?.operatingHours ? settings.operatingHours.split(',').slice(1).join(',').trim() : 'Chủ nhật: 07:00 – 12:00',
      accent: 'from-sky-500 to-primary-500',
    },
  ];

  const faqItems = [
    { q: 'Làm thế nào để đặt lịch khám?', id: 'booking' },
    { q: 'Hủy lịch hẹn trước bao lâu?', id: 'cancellation' },
    { q: 'Các phương thức thanh toán?', id: 'payment' },
    { q: 'Phòng khám có khám ngoài giờ không?', id: 'after-hours' },
  ] as { q: string; id: string }[];

  const topics = ['Đặt lịch khám', 'Thanh toán', 'Kết quả xét nghiệm', 'Góp ý dịch vụ', 'Khác'];

  return (
    <main className="w-full min-h-screen bg-[#f0f9ff]">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[var(--color-banner-dark-start)] via-[var(--color-banner-dark-mid)] to-primary-500 py-20 px-4">
        {/* decorative blobs */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <SectionContainer className="max-w-5xl text-center relative z-10">
          <span className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-bold px-4 py-1.5 rounded-full mb-6 border border-white/20 tracking-wider uppercase drop-shadow-sm">
            <MessageSquare className="w-3.5 h-3.5" />
            Hỗ trợ khách hàng
          </span>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight leading-tight drop-shadow-sm">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-white/90 text-base max-w-xl mx-auto leading-relaxed drop-shadow-sm">
            Đội ngũ CSKH luôn sẵn sàng hỗ trợ bạn. Hãy để lại thông tin — chúng tôi sẽ phản hồi sớm nhất!
          </p>
        </SectionContainer>
      </div>

      {/* ── Contact Cards ── */}
      <div className="relative -mt-8 z-10">
        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {contactCards.map((card, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-primary-100 p-5 flex flex-col gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.accent} flex items-center justify-center text-white shadow-sm`}>
                  {card.icon}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="font-black text-[14px] text-brand-dark leading-snug">{card.value}</p>
                  <p className="text-slate-500 text-[12px] mt-0.5">{card.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>

      {/* ── Main Content ── */}
      <div className="py-12">
        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* Left Column */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              {/* Map embed */}
              <div className="rounded-2xl overflow-hidden shadow-sm border border-primary-100 h-48 bg-primary-50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4451748655666!2d106.68583731533417!3d10.77676879232476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46c0b6a4e5%3A0x1a93d38fcaee63b3!2zNzEgTmfDtCBUaOG7nWkgTmhpw6ptLCBQaMaw4budbmcgVsO1IFRo4buLIFPDoXUsIFF14bqtbiAzLCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1692900000000!5m2!1svi!2s"
                  width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ phòng khám"
                />
              </div>

              {/* Clinic info strip */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5">
                <p className="text-[11px] font-bold uppercase tracking-widest text-primary-400 mb-1">Phòng khám</p>
                <h3 className="font-black text-brand-dark text-[15px] mb-2">{settings?.clinicName || 'Trustcare Clinic'}</h3>
                <p className="text-slate-500 text-[13px] flex items-start gap-2 leading-relaxed">
                  <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                  {settings?.address || '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM'}
                </p>
              </div>

              {/* FAQ links */}
              <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-black text-brand-dark text-[13px] uppercase tracking-widest">Câu hỏi thường gặp</h4>
                  <Link to="/faq" className="text-[11px] font-bold text-primary-500 hover:text-primary-700 transition-colors cursor-pointer">
                    Xem tất cả →
                  </Link>
                </div>
                <div className="flex flex-col divide-y divide-slate-50">
                  {faqItems.map((item) => (
                    <Link
                      to="/faq"
                      state={{ defaultOpen: item.id }}
                      key={item.id}
                      className="flex items-center justify-between py-2.5 text-[13px] text-slate-600 hover:text-primary-700 transition-colors group cursor-pointer"
                    >
                      <span className="font-medium group-hover:font-semibold transition-all">{item.q}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary-500 shrink-0 group-hover:translate-x-0.5 transition-all" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-primary-100 shadow-sm p-12 flex flex-col items-center justify-center text-center h-full gap-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mb-2">
                    <CheckCircle className="w-10 h-10 text-primary-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-brand-dark mb-2">Gửi thành công!</h2>
                    <p className="text-slate-500 text-[15px] max-w-xs leading-relaxed">
                      Chúng tôi đã nhận yêu cầu và sẽ liên hệ lại trong vòng <strong className="text-brand-dark">24 giờ</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', phone: '', email: '', subject: 'Khác', message: '' }); }}
                    className="mt-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-white font-bold rounded-xl transition-colors text-[14px] cursor-pointer active:scale-[0.98]"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-primary-100 shadow-sm overflow-hidden">
                  {/* Form header */}
                  <div className="px-8 py-5 border-b border-slate-200 bg-slate-50">
                    <h2 className="font-black text-brand-dark text-[18px]">Gửi tin nhắn cho chúng tôi</h2>
                    <p className="text-slate-500 text-[13px] mt-0.5">Điền thông tin bên dưới — chúng tôi sẽ liên hệ lại sớm nhất!</p>
                  </div>

                  <form className="flex flex-col gap-5 p-8" onSubmit={handleSendEmail}>
                    {/* Name + Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Họ và tên <span className="text-red-400">*</span></label>
                        <Input
                          required
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Nguyễn Văn A"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[14px] focus-visible:ring-primary-200 focus-visible:border-primary-400"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Số điện thoại <span className="text-red-400">*</span></label>
                        <Input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="0900 000 000"
                          className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[14px] focus-visible:ring-primary-200 focus-visible:border-primary-400"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Email</label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="email@example.com"
                        className="h-11 rounded-xl border-slate-200 bg-slate-50 text-[14px] focus-visible:ring-primary-200 focus-visible:border-primary-400"
                      />
                    </div>

                    {/* Topics */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Chủ đề</label>
                      <div className="flex flex-wrap gap-2">
                        {topics.map(t => (
                          <button
                            type="button"
                            onClick={() => setForm(f => ({ ...f, subject: t }))}
                            key={t}
                            className={`px-3.5 py-1.5 text-[12px] font-semibold rounded-full border transition-all duration-150 cursor-pointer ${
                              form.subject === t
                                ? 'bg-primary-500 border-primary-500 text-white shadow-sm'
                                : 'border-slate-200 text-slate-600 hover:border-primary-300 hover:text-primary-700 hover:bg-primary-50'
                            }`}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Message */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[12px] font-bold text-slate-600 uppercase tracking-wider">Nội dung cần hỗ trợ <span className="text-red-400">*</span></label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 text-[14px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="self-end flex items-center gap-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl h-12 px-10 font-bold text-[14px] transition-all shadow-sm cursor-pointer active:scale-[0.98]"
                    >
                      {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </div>
    </main>
  );
};