import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Search, AlertTriangle, ChevronDown, ChevronUp, Pill, Loader2 } from 'lucide-react';
import { pharmacyApi } from '../api/pharmacyApi';
import { medicalApi } from '@/features/medical/api/medicalApi';
import Select from 'react-select';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function InteractionCheckerDialog({ isOpen, onClose }: Props) {
  const [options, setOptions] = useState<{ value: number; label: string }[]>([]);
  const [selectedMeds, setSelectedMeds] = useState<readonly { value: number; label: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState<any[]>([]);
  const [hasChecked, setHasChecked] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen) {
      pharmacyApi.getMedicines().then(data => {
        setOptions(data.map(m => ({ value: m.medicineId, label: m.name })));
      });
      setSelectedMeds([]);
      setWarnings([]);
      setHasChecked(false);
    }
  }, [isOpen]);

  const handleCheck = async () => {
    if (selectedMeds.length < 2) return;
    setLoading(true);
    try {
      const ids = selectedMeds.map(m => m.value);
      const data = await medicalApi.checkInteractions(ids);
      setWarnings(data);
      setHasChecked(true);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-white p-0 overflow-hidden rounded-[24px]">
        <div className="bg-indigo-600 p-6 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Search size={20} />
          </div>
          <div>
            <DialogTitle className="text-xl font-bold">Tra cứu Tương tác thuốc</DialogTitle>
            <p className="text-indigo-100 text-sm mt-1">
              Chọn các loại thuốc để kiểm tra nguy cơ tương tác trước khi kê đơn.
            </p>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700">Chọn thuốc cần tra cứu (ít nhất 2)</label>
            <Select
              isMulti
              options={options}
              value={selectedMeds}
              onChange={(val) => {
                setSelectedMeds(val);
                setHasChecked(false);
              }}
              placeholder="Gõ tên thuốc để chọn..."
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '48px',
                  borderRadius: '0.75rem',
                  borderColor: '#e2e8f0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#cbd5e1' },
                })
              }}
            />
          </div>

          <div className="flex justify-end">
            <Button 
              onClick={handleCheck} 
              disabled={selectedMeds.length < 2 || loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 px-6 font-semibold cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin mr-2" /> : <AlertTriangle size={18} className="mr-2" />}
              {loading ? 'Đang kiểm tra...' : 'Kiểm tra tương tác'}
            </Button>
          </div>

          {hasChecked && (
            <div className="mt-6 border-t border-slate-100 pt-6">
              <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
                Kết quả kiểm tra: 
                {warnings.length === 0 ? (
                  <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm">An toàn (0 tương tác)</span>
                ) : (
                  <span className="text-rose-600 bg-rose-50 px-3 py-1 rounded-full text-sm">Phát hiện {warnings.length} tương tác</span>
                )}
              </h3>

              {warnings.length > 0 && (
                <div className="space-y-3">
                  {warnings.map((w, idx) => (
                    <div key={idx} className="border border-rose-200 bg-rose-50/50 rounded-xl overflow-hidden transition-all duration-300">
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer hover:bg-rose-50"
                        onClick={() => setExpandedId(expandedId === idx ? null : idx)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                            <Pill size={16} />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-800 text-sm">
                              {w.medicine1} <span className="text-slate-400 font-normal mx-1">&amp;</span> {w.medicine2}
                            </p>
                            <p className="text-xs text-rose-600 font-medium mt-0.5 flex items-center gap-1">
                              <AlertTriangle size={12} /> Tương tác nghiêm trọng
                            </p>
                          </div>
                        </div>
                        <div className="text-slate-400">
                          {expandedId === idx ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </div>
                      </div>
                      
                      {expandedId === idx && (
                        <div className="px-4 pb-4 pt-2 border-t border-rose-100 text-sm space-y-3">
                          <div className="bg-white p-3 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Cơ chế</p>
                            <p className="text-slate-700 leading-relaxed">{w.mechanism}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hậu quả</p>
                            <p className="text-rose-700 font-medium leading-relaxed">{w.consequence}</p>
                          </div>
                          <div className="bg-white p-3 rounded-lg border border-rose-100">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Xử trí / Lời khuyên</p>
                            <p className="text-slate-700 leading-relaxed">{w.management}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
