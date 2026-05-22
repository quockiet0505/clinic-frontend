import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { FormTextarea, SectionContainer } from '@/components/common';

export const ContactPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('Your message has been successfully sent to cskh@clinic.com!');
    }, 1500);
  };

  return (
    <main className="w-full min-h-screen bg-[#f5f7f9] py-12">
      <SectionContainer className="max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black text-[#003B5C] mb-4">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-[15px]">
            Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Vui lòng để lại thông tin hoặc liên hệ trực tiếp qua hotline để được giải đáp thắc mắc nhanh nhất.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: THÔNG TIN CƠ SỞ Y TẾ */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <Card className="rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="bg-[#00b5f1] px-6 py-4 rounded-t-2xl">
                <h3 className="text-white font-bold text-[15px] uppercase tracking-wide ">
                  THÔNG TIN CƠ SỞ Y TẾ
                </h3>
              </div>
              <CardContent className="p-6 flex flex-col gap-6 bg-white">
                <div>
                  <h4 className="text-[#003B5C] font-black text-[18px] mb-2">
                    Trung Tâm Mắt Quốc Tế Phương Đông
                  </h4>
                  <p className="text-slate-500 text-[13px] flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM
                  </p>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#eaf7fd] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#00b5f1]" />
                  </div>
                  <div className="mt-1">
                    <h3 className="font-bold text-[#003B5C] text-[15px] mb-1">Hotline</h3>
                    <p className="text-[15px] font-bold text-[#ff8a00]">1900 2115</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#eaf7fd] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#00b5f1]" />
                  </div>
                  <div className="mt-1">
                    <h3 className="font-bold text-[#003B5C] text-[15px] mb-1">Email</h3>
                    <p className="text-[14px] text-slate-600">cskh@clinic.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#eaf7fd] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#00b5f1]" />
                  </div>
                  <div className="mt-1">
                    <h3 className="font-bold text-[#003B5C] text-[15px] mb-1">Giờ làm việc</h3>
                    <p className="text-[14px] text-slate-600 leading-relaxed">
                      Thứ 2 - Thứ 7: 07:00 - 16:30<br />Chủ nhật: 07:00 - 12:00
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN: FORM LIÊN HỆ  */}
          <div className="lg:col-span-2">
            <Card className="rounded-2xl overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow h-full bg-white">
              <div className="bg-[#00b5f1] px-6 py-4 rounded-t-2xl">
                <h3 className="text-white font-bold text-[15px] uppercase tracking-wide">
                  GỬI TIN NHẮN CHO CHÚNG TÔI
                </h3>
              </div>
              <CardContent className="p-8">
                <form className="flex flex-col gap-6" onSubmit={handleSendEmail}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-[#003B5C]">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        placeholder="Nhập họ tên của bạn"
                        className="h-14 rounded-2xl px-5 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1] border-slate-200 bg-slate-50/50"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[14px] font-bold text-[#003B5C]">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        required
                        type="tel"
                        placeholder="Nhập số điện thoại"
                        className="h-14 rounded-2xl px-5 text-[15px] focus-visible:ring-[#00b5f1]/20 focus-visible:border-[#00b5f1] border-slate-200 bg-slate-50/50"
                      />
                    </div>
                  </div>
                  <FormTextarea
                    label="Nội dung"
                    required
                    value=""
                    onChange={() => {}}
                    placeholder="Vui lòng nhập nội dung bạn cần tư vấn..."
                  />
                  <div className="pt-2">
                    <Button
                      disabled={isLoading}
                      type="submit"
                      className="bg-[#00b5f1] hover:bg-[#0098cc] ml-auto text-white rounded-xl h-14 px-10 font-bold flex items-center gap-2 shadow-md w-full sm:w-auto transition-all"
                    >
                      {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                      {isLoading ? 'Đang gửi email...' : 'Gửi yêu cầu'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </SectionContainer>
    </main>
  );
};