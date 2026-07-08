import React, { useState } from 'react';
import { ShieldCheck, Activity, ChevronDown, Info, AlertTriangle, Loader2, BookOpen } from 'lucide-react';
import AsyncSelect from 'react-select/async';
import { pharmacyApi } from '../api/pharmacyApi';
import { medicalApi } from '@/features/medical/api/medicalApi';
import { Button } from '@/components/ui/button';
import PageHeader from '@/components/common/PageHeader';

interface DrugInteractionWarning {
  medicine1: string;
  medicine2: string;
  mechanism: string;
  consequence: string;
  management: string;
}

export default function DrugInteractionChecker() {
  const [selectedMeds, setSelectedMeds] = useState<{ value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<DrugInteractionWarning[] | null>(null);

  const breadcrumbs = [
    { label: 'Trang chủ', path: '/dashboard' },
    { label: 'Nhà thuốc', path: '/pharmacy/inventory' },
    { label: 'Tra cứu tương tác' }
  ];

  const loadOptions = async (inputValue: string) => {
    if (!inputValue) {
      const data = await pharmacyApi.getMedicines();
      return data.map(m => ({ value: m.medicineId, label: m.name }));
    }
    const data = await pharmacyApi.searchMedicines(inputValue);
    return data.map(m => ({ value: m.medicineId, label: m.name }));
  };

  const handleCheck = async () => {
    if (selectedMeds.length < 2) {
      return;
    }
    setLoading(true);
    setWarnings(null);
    try {
      const medicineIds = selectedMeds.map(m => m.value);
      const res = await medicalApi.checkInteractions(medicineIds);
      setWarnings(res);
    } catch (e) {
      console.error('Có lỗi xảy ra khi tra cứu', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col gap-4 animate-in fade-in duration-500">
      <PageHeader 
        title="Tra cứu Tương tác thuốc" 
        breadcrumbs={breadcrumbs}
      >
        <div className="bg-amber-50 px-4 py-2.5 rounded-[20px] shadow-sm border border-amber-200 flex items-center gap-3 max-w-sm lg:max-w-md">
           <BookOpen size={20} className="text-amber-600 shrink-0" />
           <p className="text-[11px] font-medium text-amber-800 leading-snug">
             Dữ liệu tra cứu dựa trên Danh mục Tương tác thuốc chống chỉ định ban hành kèm theo Quyết định số 5948/QĐ-BYT của Bộ Y Tế.
           </p>
        </div>
      </PageHeader>

      <div className="flex-1 flex flex-col lg:flex-row-reverse gap-5 min-h-0">
        
        {/* Right side: Form (lg:w-1/2) */}
        <div className="lg:w-1/2 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm p-6 shrink-0 h-fit">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chọn thuốc cần tra cứu</h2>
              <p className="text-sm text-slate-500 mt-1">
                Tìm kiếm và chọn nhiều loại thuốc để kiểm tra tương tác chéo trước khi chỉ định kê đơn.
              </p>
            </div>
            
            <div className="space-y-2">
              <AsyncSelect
                isMulti
                cacheOptions
                defaultOptions
                loadOptions={loadOptions}
                value={selectedMeds}
                onChange={(vals) => setSelectedMeds(vals as any)}
                placeholder="Gõ tên thuốc để tìm..."
                noOptionsMessage={() => "Không tìm thấy thuốc"}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    minHeight: '44px',
                    borderRadius: '0.75rem',
                    borderColor: state.isFocused ? '#3b82f6' : '#e2e8f0',
                    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.1)' : 'none',
                    '&:hover': {
                      borderColor: state.isFocused ? '#3b82f6' : '#cbd5e1',
                    },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#eff6ff',
                    borderRadius: '0.375rem',
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: '#1d4ed8',
                    fontWeight: '500',
                    fontSize: '13px',
                  }),
                  multiValueRemove: (base) => ({
                    ...base,
                    color: '#1d4ed8',
                    '&:hover': {
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                    },
                  }),
                }}
              />
            </div>

            <Button 
              onClick={handleCheck}
              disabled={selectedMeds.length < 2 || loading}
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="mr-2 animate-spin" size={18} /> Đang xử lý...</>
              ) : (
                <><Activity className="mr-2" size={18} /> Phân tích tương tác</>
              )}
            </Button>
          </div>
        </div>

        {/* Left side: Results (lg:w-1/2) */}
        <div className="lg:w-1/2 flex flex-col min-h-0 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Kết quả phân tích</h2>
              <p className="text-sm text-slate-500">Mức độ tương tác và hậu quả lâm sàng</p>
            </div>
            {warnings !== null && (
              <div className="text-sm font-semibold">
                {warnings.length === 0 ? (
                  <span className="text-emerald-600 px-3 py-1 bg-emerald-50 rounded-full border border-emerald-200">An toàn</span>
                ) : (
                  <span className="text-rose-600 px-3 py-1 bg-rose-50 rounded-full border border-rose-200">{warnings.length} tương tác</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
            {warnings === null ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                <Activity size={48} className="text-slate-200" />
                <p className="text-sm font-medium">Kết quả phân tích sẽ hiển thị tại đây</p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                {warnings.length === 0 ? (
                  <div className="bg-emerald-50 rounded-xl p-8 border border-emerald-100 flex flex-col items-center justify-center text-center gap-4 min-h-[300px]">
                    <div className="w-16 h-16 shrink-0 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center border border-emerald-200 shadow-sm">
                      <ShieldCheck size={32} />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-xl font-bold text-emerald-800">Không phát hiện tương tác</h2>
                      <p className="text-sm text-emerald-700 font-medium leading-relaxed max-w-sm">
                        Theo cơ sở dữ liệu hiện tại, các loại thuốc bạn vừa chọn không có phản ứng chéo nghiêm trọng. Bạn có thể yên tâm chỉ định.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {warnings.map((warn, idx) => (
                      <InteractionAccordion key={idx} warning={warn} index={idx + 1} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}

function InteractionAccordion({ warning, index }: { warning: DrugInteractionWarning, index: number }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-xl border border-rose-200 shadow-sm overflow-hidden transition-all duration-200">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-3 pr-4">
          <div className="shrink-0 w-8 h-8 rounded-lg bg-rose-100 text-rose-600 font-bold flex items-center justify-center text-sm border border-rose-200">
            {index}
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="font-bold text-slate-800">{warning.medicine1}</span>
            <span className="text-rose-400 font-black px-1">↔</span>
            <span className="font-bold text-slate-800">{warning.medicine2}</span>
          </div>
        </div>
        <div className={`shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
          <ChevronDown size={20} />
        </div>
      </button>

      <div className={`grid transition-all duration-200 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-4 pt-0 border-t border-slate-100 bg-slate-50/50">
            
            <div className="flex flex-col gap-4 mt-4">
              
              {/* Mechanism */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] uppercase tracking-wider">
                  <Info size={12} />
                  <span>Cơ chế tác động</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-slate-200 text-slate-700 text-sm font-medium leading-relaxed h-full">
                  {warning.mechanism}
                </div>
              </div>

              {/* Consequence */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-rose-600 font-bold text-[10px] uppercase tracking-wider">
                  <AlertTriangle size={12} />
                  <span>Hậu quả lâm sàng</span>
                </div>
                <div className="bg-white p-3.5 rounded-lg border border-rose-100 text-slate-800 text-sm font-medium leading-relaxed h-full shadow-sm">
                  {warning.consequence}
                </div>
              </div>
              
              {/* Management */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[10px] uppercase tracking-wider">
                  <ShieldCheck size={12} />
                  <span>Cách xử lý & Quản lý</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-100 text-emerald-900 text-sm font-medium leading-relaxed">
                  {warning.management}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
