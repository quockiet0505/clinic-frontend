import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, User, Menu, Search, LogOut, UserCircle, CalendarDays, FileText, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/common/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock useAuth - thay bằng hook thật sau
const useAuth = () => {
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;
  const isAuthenticated = !!user;
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/';
  };
  return { user, isAuthenticated, logout };
};

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

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

  return (
    <header className={`bg-white sticky top-0 z-40 w-full transition-all duration-300 ${isScrolled ? 'shadow-md py-2' : 'border-b border-slate-100 py-4'}`}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-shrink-0">
            <Logo />
          </div>

          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 
                  ${isActive(item.path) 
                    ? 'bg-[#EAF7FD] text-[#00b5f1]' 
                    : 'text-slate-600 hover:text-[#00b5f1] hover:bg-slate-50'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex flex-1 max-w-sm relative group">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400 group-focus-within:text-[#00b5f1] transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Tìm bác sĩ, chuyên khoa, dịch vụ..."
              className="w-full bg-slate-100 border border-transparent text-slate-800 text-sm rounded-full pl-10 pr-4 py-2.5 focus:outline-none focus:bg-white focus:border-[#00b5f1]/30 focus:ring-4 focus:ring-[#00b5f1]/10 transition-all"
            />
          </div>

          <div className="hidden md:flex items-center gap-5 flex-shrink-0">
            <div className="flex flex-col items-end">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tư vấn / Đặt khám</span>
              <a href="tel:19002115" className="flex items-center gap-1.5 text-[#ff8a00] font-black text-lg hover:scale-105 transition-transform">
                <Phone className="w-4 h-4 fill-current" />
                1900 2115
              </a>
            </div>

            <div className="w-px h-10 bg-slate-200"></div>

            {!isAuthenticated ? (
              <Link
                to="/auth/login"
                className="group flex items-center gap-2 bg-[#00b5f1] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#009bc2] hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-200"
              >
                <User className="w-4 h-4" />
                Đăng nhập
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 rounded-full px-4 py-2 transition-colors">
                    <span className="text-sm font-bold text-slate-700">
                      {getInitials()} {displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
              align="end" 
              className="min-w-[var(--radix-dropdown-menu-trigger-width)] !border-0 border-none shadow-lg rounded-xl bg-white p-1 outline-none ring-0"
              >
                {/* Header: tên người dùng */}
                <div className="px-3 py-3 border-b border-slate-100">
                  <p className="text-sm font-bold text-slate-800">{displayName}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Xin chào,</p>
                </div>
                
                <DropdownMenuItem 
                  onClick={() => navigate('/profile')} 
                  className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-lg hover:bg-[#EAF7FD] hover:text-[#00b5f1] focus:bg-[#EAF7FD] focus:text-[#00b5f1]"
                >
                  <UserCircle className="mr-2 h-4 w-4" />
                  Hồ sơ cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/appointments/my')} 
                  className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-lg hover:bg-[#EAF7FD] hover:text-[#00b5f1] focus:bg-[#EAF7FD] focus:text-[#00b5f1]"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Lịch sử đặt khám
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => navigate('/records')} 
                  className="cursor-pointer py-2.5 px-3 text-slate-700 rounded-lg hover:bg-[#EAF7FD] hover:text-[#00b5f1] focus:bg-[#EAF7FD] focus:text-[#00b5f1]"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Hồ sơ y tế
                </DropdownMenuItem>
                
                <div className="border-t border-slate-100 my-1"></div>
                
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="cursor-pointer py-2.5 px-3 text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <button className="xl:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition">
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};