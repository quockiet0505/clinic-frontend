import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  ChevronDown,
  FileText,
  LogOut,
  Menu,
  Phone,
  Search,
  User,
  UserCircle,
  X,
} from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { FormSelect } from '@/components/common/FormSelect';
import { useAuth } from '@/hooks/useAuth';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [language, setLanguage] = useState('vi');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, loading } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Dịch vụ', path: '/services' },
    { name: 'Bác sĩ', path: '/doctors' },
    { name: 'Đặt khám', path: '/appointments/book' },
    { name: 'Liên hệ', path: '/contact' },
  ];

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
    { label: 'Tiếng Việt', value: 'vi' },
    { label: 'English', value: 'en' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 w-full bg-white transition-all duration-300 ${
        isScrolled ? 'shadow-md py-2' : 'border-b border-border-default py-4'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          {/* LOGO */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-500'
                    : 'text-slate-600 hover:text-primary-500 hover:bg-slate-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* SEARCH */}
          <div className="hidden lg:flex flex-1 max-w-sm relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-primary-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm bác sĩ, chuyên khoa, dịch vụ..."
              className="w-full bg-slate-100 border border-transparent text-slate-800 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-primary-500/30 focus:ring-4 focus:ring-primary-500/10 transition-all"
            />
          </div>

          {/* RIGHT SECTION (DESKTOP) */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Hotline */}
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Tư vấn / Đặt khám
              </span>
              <a
                href="tel:19002115"
                className="flex items-center gap-1.5 text-warning font-black text-lg hover:scale-105 transition-transform"
              >
                <Phone className="w-4 h-4 fill-current" />
                1900 2115
              </a>
            </div>

            <div className="w-px h-10 bg-slate-200" />

            {/* Language Selector */}
            <div className="w-[130px]">
              <FormSelect
                compact
                value={language}
                onChange={setLanguage}
                options={languageOptions}
                placeholder="Ngôn ngữ"
              />
            </div>

            <div className="w-px h-10 bg-slate-200" />

            {/* Auth Section */}
            {loading ? null : !isAuthenticated ? (
              <Link
                to="/auth/login"
                className="group flex items-center gap-2 bg-primary-500 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-primary-600 hover:shadow-lg transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Đăng nhập
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="cursor-pointer flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full px-4 py-2 transition-all duration-200">
                    <span className="text-sm font-bold text-slate-700">
                      {getInitials()} {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-max max-w-[90vw] !border-0 ring-0 outline-none shadow-xl rounded-2xl bg-white p-2"
                >
                  <div className="px-3 py-3 border-b border-border-default">
                    <p className="text-sm font-bold text-brand-dark">{displayName}</p>
                    <p className="text-xs text-slate-500 mt-0.5 break-all">{user?.email}</p>
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate('/profile')}
                    className="cursor-pointer py-3 px-3 text-slate-700 rounded-xl transition-all duration-200 hover:bg-primary-50 hover:text-primary-500 focus:bg-primary-50 focus:text-primary-500"
                  >
                    <UserCircle className="mr-2 h-4 w-4" />
                    Hồ sơ cá nhân
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/appointments/my')}
                    className="cursor-pointer py-3 px-3 text-slate-700 rounded-xl transition-all duration-200 hover:bg-primary-50 hover:text-primary-500 focus:bg-primary-50 focus:text-primary-500"
                  >
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Lịch sử đặt khám
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => navigate('/records')}
                    className="cursor-pointer py-3 px-3 text-slate-700 rounded-xl transition-all duration-200 hover:bg-primary-50 hover:text-primary-500 focus:bg-primary-50 focus:text-primary-500"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Hồ sơ y tế
                  </DropdownMenuItem>
                  <div className="border-t border-border-default my-2" />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer py-3 px-3 text-red-600 rounded-xl transition-all duration-200 hover:bg-red-50 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Đăng xuất
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* MOBILE SHEET MENU */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <button className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[320px] p-0 border-l-border-default bg-white"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-6 py-5 border-b border-border-default">
                  <Logo />
                  <button
                    onClick={() => setIsSheetOpen(false)}
                    className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
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
                      <div className="flex-1 ">
                        <p className="font-bold text-brand-dark text-sm">{displayName}</p>
                        <p className="text-xs text-slate-500 mt-0.5 break-all">{user?.email}</p>
                      </div>
                    </div>
                  ) : (
                    <Link
                      to="/auth/login"
                      onClick={() => setIsSheetOpen(false)}
                      className="cursor-pointer flex items-center justify-center bg-primary-500 text-white rounded-xl h-12 font-bold text-sm w-full hover:bg-primary-600 transition-all"
                    >
                      Đăng nhập
                    </Link>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsSheetOpen(false)}
                        className={`px-4 py-3 rounded-xl text-[15px] font-semibold transition-all ${
                          isActive(item.path)
                            ? 'bg-primary-50 text-primary-500'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>

                  {isAuthenticated && (
                    <>
                      <div className="h-px bg-border-default my-5" />
                      <div className="flex flex-col gap-1">
                        <Link
                          to="/profile"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          Hồ sơ cá nhân
                        </Link>
                        <Link
                          to="/appointments/my"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          Lịch sử đặt khám
                        </Link>
                        <Link
                          to="/records"
                          onClick={() => setIsSheetOpen(false)}
                          className="px-4 py-3 rounded-xl text-[15px] font-semibold text-slate-700 hover:bg-slate-50 transition-all"
                        >
                          Hồ sơ y tế
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {isAuthenticated && (
                  <div className="p-4 border-t border-border-default">
                    <button
                      onClick={handleLogout}
                      className="w-full h-12 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-all"
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