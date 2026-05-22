import React from 'react';
import { Link } from 'react-router-dom';
import { X, Phone, User, Calendar, Stethoscope, MessageSquare } from 'lucide-react';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop overlay */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Drawer Content */}
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white p-6 shadow-xl flex flex-col justify-between animate-in slide-in-from-right duration-300">
        <div>
          {/* Header section of the mobile menu */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-100">
            <span className="text-xl font-bold text-blue-600">
              clinic<span className="text-orange-500">pro</span>
            </span>
            <button 
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-4 mt-8">
            <Link 
              to="/" 
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              Trang chủ
            </Link>
            <Link 
              to="/booking" 
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Calendar className="w-5 h-5 text-blue-500" />
              Đặt lịch khám
            </Link>
            <Link 
              to="/chatbot" 
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Tư vấn AI Bot
            </Link>
            <Link 
              to="/portal/appointments" 
              onClick={onClose}
              className="flex items-center gap-3 py-3 px-4 rounded-xl text-gray-700 font-medium hover:bg-blue-50 hover:text-blue-600 transition"
            >
              <Stethoscope className="w-5 h-5 text-emerald-500" />
              Lịch sử khám bệnh
            </Link>
          </nav>
        </div>

        {/* Action button container at the bottom */}
        <div className="border-t border-gray-100 pt-6 flex flex-col gap-4">
          <div className="flex items-center justify-center gap-2 text-orange-500 font-bold text-lg py-2">
            <Phone className="w-5 h-5 animate-pulse" />
            <span>1900 2115</span>
          </div>
          <Link
            to="/auth/login"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 shadow-md shadow-blue-200 transition"
          >
            <User className="w-5 h-5" />
            Đăng nhập / Đăng ký
          </Link>
        </div>
      </div>
    </div>
  );
};