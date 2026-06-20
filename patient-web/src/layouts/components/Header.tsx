import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  FileText,
  FlaskConical,
  Heart,
  LogOut,
  Menu,
  Phone,
  Pill,
  User,
  UserCircle,
  X,
  Star,
} from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { HoverDropdown } from '@/components/common/HoverDropdown';
import { GradientButton } from '@/components/common/GradientButton';
import { HeaderMenuDropdown } from '@/components/common/index';
import { NotificationPanel } from '@/features/home/components/NotificationPanel';
import { useAuth } from '@/hooks/useAuth';
import { appointmentApi } from '@/features/appointments/api/appointmentApi';
import { homeApi } from '@/features/home/api/homeApi'; // 👈 import thêm
import type { Expertise, Service } from '@/features/appointments/types/appointment';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [language, setLanguage] = useState('vi');
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [logoUrl, setLogoUrl] = useState('/images/logo.png'); // fallback

  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  // Fetch logo
  useEffect(() => {
    homeApi.getLogo()
      .then(url => setLogoUrl(url))
      .catch(() => console.error('Failed to load logo'));
  }, []);

  // Fetch dữ liệu cho dropdown chuyên khoa & xét nghiệm
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [exps, servs] = await Promise.all([
          appointmentApi.getExpertises(),
          appointmentApi.getServices(),
        ]);
        setExpertises(exps);
        setServices(servs);
      } catch (error) {
        console.error('Failed to fetch menu data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsSheetOpen(false);
  };

  const getInitials = () => {
    if (user?.fullName) {
      const names = user.fullName.split(' ');
      const lastName = names[names.length - 1];
      return lastName.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'KH';
  };

  const displayName = user?.fullName || user?.email?.split('@')[0] || 'Tài khoản';

  const languageOptions = [
    { label: 'Tiếng Việt', value: 'vi', icon: 'https://flagcdn.com/w20/vn.png' },
    { label: 'English', value: 'en', icon: 'https://flagcdn.com/w20/gb.png' },
  ];

  // Dữ liệu cho dropdown Bác sĩ (tĩnh)
  const doctorMenuItems = [
    { label: 'Tất cả bác sĩ', to: '/doctors' },
    { label: 'Bác sĩ nổi bật', to: '/#featured-doctors-section' },
    { label: 'Đặt khám bác sĩ', to: '/appointments/book?mode=doctor' },
  ];

  // Dữ liệu cho dropdown Chuyên khoa (động)
  const expertiseMenuItems = [
    ...(expertises || []).slice(0, 8).map(exp => ({
      label: exp.expertiseName,
      to: `/appointments/book?expertiseId=${exp.expertiseId}`,
    })),
    {
      label: 'Xem tất cả',
      to: '/#specialties-section',
      isSpecial: true,
    },
  ];

  // Dữ liệu cho dropdown Dịch vụ (động)
  const serviceMenuItems = [
    ...(services || []).slice(0, 6).map(svc => ({
      label: svc.serviceName,
      to: `/appointments/book?serviceId=${svc.serviceId}`,
    })),
    { label: 'Xem tất cả', to: '/services', isSpecial: true },
  ];

  return (
    <header
      className={`sticky top-0 z-[100] w-full transition-all duration-300 bg-white backdrop-blur-md ${
        isScrolled ? 'shadow-soft py-2' : 'border-b border-border-default py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img src={logoUrl} alt="Clinic Logo" className="h-10" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden xl:flex items-center gap-1">
            {/* Trang chủ */}
            <Link
              to="/"
              className={`relative px-4 py-2 rounded-full font-bold text-[13.5px] uppercase tracking-wide transition-all duration-200 ${
                isActive('/')
                  ? 'text-primary-500'
                  : 'text-slate-700 hover:text-primary-500'
              }`}
            >
              Trang chủ
              {isActive('/') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-primary-500" />
              )}
            </Link>

            {/* Bác sĩ dropdown */}
            <HeaderMenuDropdown
              title="Bác sĩ"
              active={location.pathname.includes('/doctors')}
              items={doctorMenuItems}
              width="w-48"
            />

            {/* Chuyên khoa dropdown */}
            <HeaderMenuDropdown
              title="Chuyên khoa"
              active={location.pathname.includes('/specialties')}
              items={expertiseMenuItems}
              width="w-48"
            />

            {/* Dịch vụ dropdown */}
            <HeaderMenuDropdown
              title="Dịch vụ"
              active={location.pathname.includes('/services')}
              items={serviceMenuItems}
              width="w-65"
            />

            {/* Liên hệ */}
            <Link
              to="/contact"
              className={`relative px-4 py-2 rounded-full font-bold text-[13.5px] uppercase tracking-wide transition-all duration-200 ${
                isActive('/contact')
                  ? 'text-primary-500'
                  : 'text-slate-700 hover:text-primary-500'
              }`}
            >
              Liên hệ
              {isActive('/contact') && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-[3px] w-8 rounded-full bg-primary-500" />
              )}
            </Link>
          </nav>

          {/* Right side: Phone + booking link, Language, Login */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tư vấn / Đặt khám
              </span>
              <div className="flex items-center gap-3">
                <a
                  href="tel:19002115"
                  className="flex items-center gap-1.5 text-warning font-black text-lg hover:scale-105 transition-transform"
                >
                  <Phone className="w-4 h-4 fill-current" /> 1900 2115
                </a>
                <Link
                  to="/appointments/book"
                  className="text-primary-500 font-bold text-sm hover:underline"
                >
                  Đặt khám
                </Link>
              </div>
            </div>

            <div className="w-px h-10 bg-slate-200" />

            {/* Notification Panel */}
            {isAuthenticated && (
              <>
                <NotificationPanel />
                <div className="w-px h-10 bg-slate-200" />
              </>
            )}

            {/* Language Selector */}
            <HoverDropdown
              value={language}
              items={languageOptions}
              onChange={setLanguage}
            />

            <div className="w-px h-10 bg-slate-200" />

            {/* Nút đăng nhập (dùng GradientButton) */}
            {loading ? null : !isAuthenticated ? (
              <GradientButton
                onClick={() => navigate('/auth/login')}
                icon={<User className="w-4 h-4" />}
              >
                Đăng nhập
              </GradientButton>
            ) : (
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 pr-3 bg-white hover:bg-slate-50 rounded-full transition-all cursor-pointer border border-slate-200 shadow-sm group-hover:border-primary-200 group-hover:bg-primary-50/30">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-[13px] shadow-inner shrink-0">
                    {getInitials()}
                  </div>
                  <span className="text-[13.5px] font-bold text-slate-700 max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400 transition-transform duration-200 group-hover:rotate-180 group-hover:text-primary-500"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </button>
                <div className="absolute right-0 top-full pt-3 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300 z-50">
                  <div className="w-64 rounded-2xl bg-white border border-slate-100 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col">
                    <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-sm font-black text-brand-dark">{displayName}</p>
                      <p className="text-xs text-slate-500 mt-1 break-all font-medium">{user?.email}</p>
                    </div>
                    <div className="p-2 flex flex-col gap-1">
                      <button
                        onClick={() => navigate('/profile')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <UserCircle className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Hồ sơ cá nhân
                      </button>
                      <button
                        onClick={() => navigate('/appointments/my')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <CalendarDays className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Lịch sử đặt khám
                      </button>
                      <button
                        onClick={() => navigate('/profile/reviews')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <Star className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Lịch sử đánh giá
                      </button>
                      <button
                        onClick={() => navigate('/records')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <Heart className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Hồ sơ sức khoẻ
                      </button>

                      <button
                        onClick={() => navigate('/records/prescriptions')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <Pill className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Đơn thuốc
                      </button>
                      <button
                        onClick={() => navigate('/records/lab-results')}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-primary-50 hover:text-primary-600 transition-colors cursor-pointer flex items-center group/item"
                      >
                        <FlaskConical className="mr-3 h-4 w-4 text-slate-400 group-hover/item:text-primary-500" />
                        Kết quả xét nghiệm
                      </button>
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center"
                      >
                        <LogOut className="mr-3 h-4 w-4" />
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0 border-l-border-default bg-white">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-default">
                  <img src={logoUrl} alt="Clinic Logo" className="h-10" />
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="px-6 py-5 border-b border-border-default">
                  {isAuthenticated ? (
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center font-bold text-base">
                        {getInitials()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-brand-dark text-sm">{displayName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 break-all">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <GradientButton
                      onClick={() => navigate('/auth/login')}
                      className="w-full justify-center"
                    >
                      Đăng nhập
                    </GradientButton>
                  )}
                </div>
                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="flex flex-col gap-1">
                    <Link
                      to="/"
                      onClick={() => setIsSheetOpen(false)}
                      className={`px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                        isActive('/')
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Trang chủ
                    </Link>
                    <Link
                      to="/doctors"
                      onClick={() => setIsSheetOpen(false)}
                      className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Bác sĩ
                    </Link>
                    <Link
                      to="/specialties"
                      onClick={() => setIsSheetOpen(false)}
                      className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Chuyên khoa
                    </Link>
                    <Link
                      to="/services"
                      onClick={() => setIsSheetOpen(false)}
                      className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Dịch vụ
                    </Link>
                    <Link
                      to="/contact"
                      onClick={() => setIsSheetOpen(false)}
                      className={`px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                        isActive('/contact')
                          ? 'bg-primary-50 text-primary-500'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      Liên hệ
                    </Link>
                    <div className="pt-2">
                      <Link
                        to="/appointments/book"
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center justify-center bg-primary-500 text-white rounded-xl h-12 font-bold text-sm w-full hover:bg-primary-600"
                      >
                        Đặt khám
                      </Link>
                    </div>
                  </div>
                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-border-default my-5" />
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/appointments/my"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Lịch sử đặt khám
                        </Link>
                        <Link
                          to="/profile/reviews"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Lịch sử đánh giá
                        </Link>
                        <Link
                          to="/records"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Hồ sơ sức khoẻ
                        </Link>
                        <Link
                          to="/records/prescriptions"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Đơn thuốc
                        </Link>
                        <Link
                          to="/records/lab-results"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50"
                        >
                          Kết quả xét nghiệm
                        </Link>
                      </div>
                    </>
                  )}
                </div>
                {isAuthenticated && (
                  <div className="p-4 border-t border-border-default">
                    <button
                      onClick={handleLogout}
                      className="w-full h-12 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};