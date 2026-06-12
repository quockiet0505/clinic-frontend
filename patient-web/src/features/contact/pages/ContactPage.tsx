import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2, MessageSquare, CheckCircle, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { SectionContainer } from '@/components/common';

export const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSent(true);
    }, 1500);
  };

  const contactItems = [
    {
      icon: <Phone className="w-5 h-5" />,
      label: 'Hotline 24/7',
      value: '1900 2115',
      sub: 'Miễn phí cuộc gọi',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: <Mail className="w-5 h-5" />,
      label: 'Email hỗ trợ',
      value: 'cskh@clinic.com',
      sub: 'Phản hồi trong 24h',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      label: 'Địa chỉ',
      value: '71-73 Ngô Thời Nhiệm',
      sub: 'Phường Võ Thị Sáu, Quận 3, TP.HCM',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: <Clock className="w-5 h-5" />,
      label: 'Giờ làm việc',
      value: 'T2 – T7: 07:00 – 16:30',
      sub: 'Chủ nhật: 07:00 – 12:00',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
  ];

  return (
    <main className="w-full min-h-screen bg-slate-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-primary-100 to-white py-16">
        <SectionContainer className="max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-600 text-sm font-semibold px-4 py-1.5 rounded-full mb-5 border border-primary-500/20 backdrop-blur-sm">
            <MessageSquare className="w-4 h-4" />
            Hỗ trợ khách hàng
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 leading-tight">
            Liên Hệ Với Chúng Tôi
          </h1>
          <p className="text-slate-600 text-[15px] max-w-xl mx-auto leading-relaxed">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại thông tin — đội ngũ CSKH sẽ phản hồi sớm nhất!
          </p>
        </SectionContainer>
      </div>

      {/* Contact Info Cards */}
      <div className="relative -mt-8 z-10">
        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {contactItems.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 flex flex-col gap-3 hover:shadow-lg transition-all hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    {item.icon}
                  </div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{item.label}</p>
                </div>
                <div>
                  <p className={`font-black text-[15px] ${item.color}`}>{item.value}</p>
                  <p className="text-slate-500 text-[12px] font-medium mt-0.5">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionContainer>
      </div>

      {/* Main Content */}
      <div className="py-12">
        <SectionContainer className="max-w-5xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left: Clinic Info */}
            <div className="lg:col-span-2 flex flex-col gap-5">
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="h-44 w-full overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=800&auto=format&fit=crop"
                    alt="Phòng khám"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-black text-[#003B5C] text-[17px] mb-1">Trung Tâm Y Tế Quốc Tế Phương Đông</h3>
                  <p className="text-slate-500 text-[13px] flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-slate-400" />
                    71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM
                  </p>
                </div>
              </div>

              {/* FAQ Quick links */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
                <h4 className="font-black text-slate-700 text-[14px] mb-4 uppercase tracking-wider">Câu hỏi thường gặp</h4>
                <div className="flex flex-col gap-2">
                  {[
                    'Làm thế nào để đặt lịch khám?',
                    'Hủy lịch hẹn trước bao lâu?',
                    'Các phương thức thanh toán?',
                    'Phòng khám có khám ngoài giờ không?',
                  ].map((q, i) => (
                    <button
                      key={i}
                      className="flex items-center justify-between text-left text-[13px] text-slate-600 font-medium py-2.5 px-3 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                    >
                      <span>{q}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-3">
              {sent ? (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 mb-3">Gửi thành công!</h2>
                  <p className="text-slate-500 text-[15px] font-medium max-w-sm leading-relaxed mb-6">
                    Chúng tôi đã nhận được yêu cầu của bạn và sẽ phản hồi trong vòng 24 giờ.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', phone: '', message: '' }); }}
                    className="px-6 py-3 bg-[#003B5C] hover:bg-[#005f8a] text-white font-bold rounded-xl transition-colors text-[14px]"
                  >
                    Gửi yêu cầu khác
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-black text-slate-800 text-[18px]">Gửi tin nhắn cho chúng tôi</h2>
                    <p className="text-slate-500 text-[13px] font-medium mt-1">Điền thông tin bên dưới — chúng tôi sẽ liên hệ lại sớm nhất!</p>
                  </div>
                  <form className="flex flex-col gap-5 p-8" onSubmit={handleSendEmail}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-slate-600">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Nhập họ tên của bạn"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 text-[14px] focus-visible:ring-blue-200 focus-visible:border-blue-400"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-[13px] font-bold text-slate-600">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <Input
                          required
                          type="tel"
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="Nhập số điện thoại"
                          className="h-12 rounded-xl border-slate-200 bg-slate-50 text-[14px] focus-visible:ring-blue-200 focus-visible:border-blue-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-slate-600">
                        Nội dung cần hỗ trợ <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        value={form.message}
                        onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        placeholder="Mô tả chi tiết vấn đề bạn cần hỗ trợ..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 text-[14px] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    {/* Topics quick-select */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-slate-600">Chủ đề</label>
                      <div className="flex flex-wrap gap-2">
                        {['Đặt lịch khám', 'Thanh toán', 'Kết quả xét nghiệm', 'Góp ý dịch vụ', 'Khác'].map(t => (
                          <button
                            type="button"
                            key={t}
                            className="px-3 py-1.5 text-[12px] font-semibold rounded-full border border-slate-200 text-slate-600 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="mt-1 w-full sm:w-auto ml-auto flex items-center justify-center gap-2.5 bg-[#003B5C] hover:bg-[#005f8a] disabled:opacity-60 text-white rounded-xl h-12 px-10 font-bold text-[14px] transition-all shadow-sm"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                      {isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        </SectionContainer>
      </div>

      {/* Map section */}
      <div className="pb-16">
        <SectionContainer className="max-w-5xl">
          <div className="rounded-2xl overflow-hidden shadow-md border border-slate-200 h-64 bg-slate-200 relative">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4451748655666!2d106.68583731533417!3d10.77676879232476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46c0b6a4e5%3A0x1a93d38fcaee63b3!2zNzEgTmfDtCBUaOG7nWkgTmhpw6ptLCBQaMaw4budbmcgVsO1IFRo4buLIFPDoXUsIFF14bqtbiAzLCBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1692900000000!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Bản đồ phòng khám"
            />
          </div>
        </SectionContainer>
      </div>
    </main>
  );
};