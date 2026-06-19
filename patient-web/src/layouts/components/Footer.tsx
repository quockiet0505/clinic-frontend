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
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          
          {/* Section 1: Clinic Overview & Core Contacts */}
          <div className="flex flex-col gap-4">
            <div className="text-white font-bold text-2xl tracking-tight">
              {settings?.clinicName ? (
                <span dangerouslySetInnerHTML={{ __html: settings.clinicName.replace('pro', '<span class="text-orange-500">pro</span>') }} />
              ) : (
                <>clinic<span className="text-orange-500">pro</span></>
              )}
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Hệ thống đăng ký khám từ xa và quản lý y tế thông minh, nâng tầm trải nghiệm chăm sóc sức khỏe toàn diện.
            </p>
            <div className="flex flex-col gap-2 text-sm mt-2 text-gray-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Hotline: {settings?.phone || '1900 2115'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Email: {settings?.email || 'contact@clinicpro.vn'}</span>
              </div>
            </div>
          </div>

          {/* Section 2: Patient Shortcuts Links */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Dịch vụ cốt lõi</h3>
            <ul className="flex flex-col gap-3 text-sm text-gray-400">
              <li><Link to="/booking" className="hover:text-white hover:underline transition">Đặt lịch hẹn trực tuyến</Link></li>
              <li><Link to="/chatbot" className="hover:text-white hover:underline transition">Tư vấn triệu chứng với AI</Link></li>
              <li><Link to="/portal/appointments" className="hover:text-white hover:underline transition">Tra cứu số thứ tự khám</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:underline transition">Câu hỏi thường gặp (FAQ)</Link></li>
            </ul>
          </div>

          {/* Section 3: Shift Hours Operations */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Thời gian làm việc</h3>
            <div className="flex items-start gap-2.5 text-sm text-gray-400">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-gray-200">Giờ hoạt động</p>
                <p className="text-white font-medium text-sm mt-0.5">{settings?.operatingHours || '07:00 - 17:00 (T2 - CN)'}</p>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  * Hệ thống đặt lịch trực tuyến hoạt động liên tục 24/7 phục vụ người dân.
                </p>
              </div>
            </div>
          </div>

          {/* Section 4: Physical Address Map Info */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Địa chỉ phòng khám</h3>
            <div className="flex items-start gap-2.5 text-sm text-gray-400">
              <MapPin className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="leading-relaxed text-gray-300">
                {settings?.address || '781/B1-B3-B5 Lê Hồng Phong, Phường 12, Quận 10, Thành phố Hồ Chí Minh, Việt Nam.'}
              </p>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs bg-gray-800/50 p-2.5 rounded-lg border border-gray-800 text-emerald-400 w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>Phòng khám không sử dụng BHYT</span>
            </div>
          </div>

        </div>

        {/* Copyright Footer Sub-bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 ClinicPro Systems. Bảo lưu mọi quyền đối với nền tảng quản lý phòng khám.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-gray-400 transition">Điều khoản dịch vụ</a>
            <a href="#" className="hover:text-gray-400 transition">Chính sách bảo mật</a>
          </div>
        </div>
      </div>
    </footer>
  );
};