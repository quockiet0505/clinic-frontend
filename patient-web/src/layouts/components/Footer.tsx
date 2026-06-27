import React, { useEffect, useState } from 'react';
import { Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { homeApi } from '@/features/home/api/homeApi';

export const Footer: React.FC = () => {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    homeApi.getSystemSettings()
      .then(setSettings)
      .catch(console.error);
  }, []);

  return (
    <footer className="bg-brand-dark text-primary-100 pt-16 pb-8 border-t border-brand-dark">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Section 1: Clinic Overview & Core Contacts */}
          <div className="flex flex-col gap-4">
            <div className="text-white font-bold text-2xl tracking-tight">
              {settings?.clinicName ? (
                <span dangerouslySetInnerHTML={{ __html: settings.clinicName.replace('pro', '<span class="text-primary-400">pro</span>') }} />
              ) : (
                <>clinic<span className="text-primary-400">pro</span></>
              )}
            </div>
            <p className="text-sm text-primary-100/80 leading-relaxed">
              Hệ thống đăng ký khám từ xa và quản lý y tế thông minh, nâng tầm trải nghiệm chăm sóc sức khỏe toàn diện.
            </p>
            <div className="flex flex-col gap-2 text-sm mt-2 text-primary-100/90">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>Hotline: {settings?.phone || '1900 2115'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary-400 flex-shrink-0" />
                <span>Email: {settings?.email || 'cskh@clinic.com'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Patient Shortcuts Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Dịch vụ cốt lõi</h3>
            <ul className="flex flex-col gap-3 text-sm text-primary-100/80">
              <li><Link to="/appointments/book" className="hover:text-white hover:underline transition">Đặt lịch hẹn trực tuyến</Link></li>
              <li><Link to="/chatbot" className="hover:text-white hover:underline transition">Tư vấn triệu chứng với AI</Link></li>
              <li><Link to="/appointments/my" className="hover:text-white hover:underline transition">Tra cứu số thứ tự khám</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:underline transition">Câu hỏi thường gặp (FAQ)</Link></li>
            </ul>
          </div>

          {/* Section 3: Shift Hours Operations */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Thời gian làm việc</h3>
            <div className="flex items-start gap-2.5 text-sm text-primary-100/80">
              <Clock className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-white/90">Giờ hoạt động</p>
                <p className="text-white font-medium text-sm mt-0.5">{settings?.operatingHours || '07:30 - 17:00 (T2 - CN)'}</p>
                <p className="text-xs text-primary-100/60 mt-2 leading-relaxed">
                  * Hệ thống đặt lịch trực tuyến hoạt động liên tục 24/7 phục vụ người dân.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Physical Address Map Info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Địa chỉ phòng khám</h3>
            <div className="flex items-start gap-2.5 text-sm text-primary-100/80">
              <MapPin className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed text-primary-100/90">
                {settings?.address || '71-73 Ngô Thời Nhiệm, Phường Võ Thị Sáu, Quận 3, TP.HCM'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs bg-white/5 p-2.5 rounded-lg border border-white/10 text-emerald-400 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Phòng khám không sử dụng BHYT</span>
            </div>
          </div>

        </div>

        {/* Copyright Footer Sub-bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-primary-100/60">
          <p>© 2026 ClinicPro Systems. Bảo lưu mọi quyền đối với nền tảng quản lý phòng khám.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-white transition">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};