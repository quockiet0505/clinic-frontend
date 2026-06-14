import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ChevronLeft, UserCircle, Activity, ClipboardList, Pill } from 'lucide-react';
import { Button } from '@/components/ui/button';
import VitalSignsForm from '../components/VitalSignsForm';
import ConsultationForm from '../components/ConsultationForm';
import PrescriptionBuilder from '../components/PrescriptionBuilder';

export default function ConsultationWorkspace() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notes' | 'prescriptions'>('notes');

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-[calc(100vh-6rem)] flex flex-col">
      <div className="max-w-[1400px] mx-auto w-full flex flex-col h-full space-y-6">
        {/* Header - không có thanh bao quanh, nút Thoát riêng bên trái */}
        <div className="flex justify-between items-center shrink-0">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 font-medium text-slate-500 hover:text-slate-800 transition-colors px-2 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <ChevronLeft size={20} /> Thoát phiên làm việc
          </button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="font-medium border-blue-200 text-blue-600 bg-white hover:bg-blue-50 hover:border-blue-300 rounded-xl h-10 px-5 cursor-pointer"
            >
              <Save size={16} className="mr-2" /> Lưu nháp
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 rounded-xl h-10 shadow-sm cursor-pointer">
              <Save size={16} className="mr-2" /> Hoàn tất khám
            </Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
          {/* Left panel */}
          <div className="lg:col-span-4 flex flex-col gap-6 overflow-y-auto pr-2">
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <UserCircle size={18} className="text-blue-600" />
                <h2 className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Thông tin bệnh nhân</h2>
              </div>
              <div className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl mb-3">L</div>
                <h3 className="font-bold text-lg text-slate-800">Liam Anderson</h3>
                <p className="text-sm text-slate-500">Hồ sơ #{id}</p>
                <div className="flex gap-2 mt-3 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span>Nam, 41</span> | <span className="text-rose-500">Nhóm máu: O+</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm shrink-0">
              <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <Activity size={18} className="text-rose-600" />
                <h2 className="font-semibold text-slate-600 text-sm uppercase tracking-wider">Chỉ số sinh tồn</h2>
              </div>
              <div className="p-5"><VitalSignsForm /></div>
            </div>
          </div>

          {/* Right panel */}
          <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex border-b border-slate-100 px-5 pt-1 bg-slate-50 shrink-0">
              <button
                onClick={() => setActiveTab('notes')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'notes'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <ClipboardList size={16} /> Phiếu Khám Bệnh
              </button>
              <button
                onClick={() => setActiveTab('prescriptions')}
                className={`cursor-pointer flex items-center gap-2 px-5 py-3 font-semibold text-sm transition-all border-b-2 ${
                  activeTab === 'prescriptions'
                    ? 'border-blue-600 text-blue-600 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Pill size={16} /> Kê Đơn Thuốc
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto bg-slate-50/30">
              {activeTab === 'notes' && <ConsultationForm />}
              {activeTab === 'prescriptions' && <PrescriptionBuilder />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}