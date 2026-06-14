import React from 'react';
import {
  Bell,
  Settings,
  LogOut,
  Menu,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  const userEmail = user?.email || 'Unknown User';
  const displayRole = user?.roles?.[0] || 'GUEST';

  const avatarLetter = userEmail.charAt(0).toUpperCase();

  const iconButton =
    'h-10 w-10 flex items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-blue-600 transition-all duration-200 cursor-pointer';

  return (
    <header
      className="
        h-16
        bg-white/95
        backdrop-blur-sm
        border-b
        border-slate-200
        px-6
        sticky
        top-0
        z-20
        flex
        items-center
        justify-between
        shadow-sm
        shrink-0
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className={iconButton}
        >
          <Menu size={20} />
        </button>

        <div className="min-w-0">
          <h1 className="text-lg font-bold text-slate-800 truncate">
            Dashboard
          </h1>

          <p className="text-xs text-slate-500 truncate">
            Hệ thống quản lý phòng khám
          </p>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">
        <button
          className={iconButton}
          title="Cài đặt"
        >
          <Settings size={18} />
        </button>

        <button
          className={`relative ${iconButton}`}
          title="Thông báo"
        >
          <Bell size={18} />

          <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-red-500 border border-white" />
        </button>

        <div className="mx-2 h-8 w-px bg-slate-200" />

        {/* USER CARD */}
        <div
          className="
            flex
            items-center
            gap-3
            rounded-2xl
            border
            border-slate-200
            bg-white
            px-3
            py-2
            hover:shadow-sm
            transition-all
          "
        >
          {/* Avatar */}
          <div
            className="
              h-10
              w-10
              rounded-xl
              bg-gradient-to-br
              from-blue-500
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
              text-sm
              shrink-0
            "
          >
            {avatarLetter}
          </div>

          {/* User info */}
          <div className="hidden md:flex flex-col min-w-0">
            <span
              className="
                text-sm
                font-semibold
                text-slate-800
                truncate
                max-w-[180px]
              "
              title={userEmail}
            >
              {userEmail}
            </span>

            <span
              className="
                mt-1
                w-fit
                rounded-full
                bg-blue-50
                px-2
                py-0.5
                text-[10px]
                font-semibold
                text-blue-700
              "
            >
              {displayRole}
            </span>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            title="Đăng xuất"
            className="
              h-9
              w-9
              flex
              items-center
              justify-center
              rounded-xl
              text-slate-400
              hover:text-red-600
              hover:bg-red-50
              transition-all
              cursor-pointer
            "
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
}