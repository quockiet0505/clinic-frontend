import React, { useEffect, useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import SelectReact from 'react-select';
import { staffApi } from '@/features/staffs/api/staffApi';
import { settingsApi } from '@/features/settings/api/settingsApi';
import { Staff } from '@/features/staffs/types/staff';
import { Expertise } from '@/features/settings/types/settings';
import { Appointment } from '../types/appointment';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (data: any) => void;
  appointment: Appointment | null;
}

export default function TransferDoctorDialog({ isOpen, onClose, onTransfer, appointment }: Props) {
  const [doctors, setDoctors] = useState<Staff[]>([]);
  const [expertises, setExpertises] = useState<Expertise[]>([]);
  
  const [selectedExpertiseId, setSelectedExpertiseId] = useState<string>('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedExpertiseId('');
      setSelectedDoctorId('');
      
      Promise.all([
        staffApi.getAllPaged({ size: 100, staffType: 'DOCTOR' }),
        settingsApi.getExpertisesPaged({ size: 100 })
      ]).then(([doctorRes, expertiseRes]) => {
        setDoctors(doctorRes.content);
        setExpertises(expertiseRes.content);
      }).catch(console.error);
    }
  }, [isOpen]);

  const filteredDoctors = selectedExpertiseId 
    ? doctors.filter(d => String(d.expertiseId) === selectedExpertiseId)
    : doctors;

  const handleSubmit = () => {
    if (selectedDoctorId) {
      onTransfer({ newDoctorId: selectedDoctorId });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[480px] p-0 border-0 rounded-[24px] shadow-2xl">
        <div className="p-5 bg-primary-50 border-b border-primary-100 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600 text-sm">
            <ArrowRightLeft size={24} />
          </div>
          <DialogTitle className="text-2xl font-semibold">Chuyển Bác sĩ</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium mt-1">
            {appointment ? `Chuyển ca khám của bệnh nhân ${appointment.patientName} sang bác sĩ khác.` : ''}
          </DialogDescription>
        </div>

        <div className="p-5 bg-white space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Lọc theo chuyên khoa (Tuỳ chọn)
            </label>
            <SelectReact
              value={selectedExpertiseId ? { value: selectedExpertiseId, label: expertises.find(e => String(e.expertiseId) === selectedExpertiseId)?.expertiseName } : null}
              onChange={(val: any) => {
                setSelectedExpertiseId(val?.value || '');
                setSelectedDoctorId(''); // Reset doctor when expertise changes
              }}
              options={expertises.map(e => ({ value: String(e.expertiseId), label: e.expertiseName }))}
              isClearable
              placeholder="Chọn chuyên khoa..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '36px',
                  borderRadius: '0.75rem',
                  borderColor: '#e2e8f0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#93c5fd' }
                }),
                menu: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-slate-700">
              Chọn bác sĩ mới <span className="text-red-500">*</span>
            </label>
            <SelectReact
              value={selectedDoctorId ? { value: selectedDoctorId, label: doctors.find(d => String(d.staffId) === selectedDoctorId)?.fullName } : null}
              onChange={(val: any) => setSelectedDoctorId(val?.value || '')}
              options={filteredDoctors.map(d => ({ value: String(d.staffId), label: `${d.fullName} (${d.expertiseName || 'Chưa có khoa'})` }))}
              isClearable
              placeholder="Tìm kiếm bác sĩ..."
              classNamePrefix="react-select"
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '36px',
                  borderRadius: '0.75rem',
                  borderColor: '#e2e8f0',
                  boxShadow: 'none',
                  '&:hover': { borderColor: '#93c5fd' }
                }),
                menu: (base) => ({ ...base, zIndex: 9999 })
              }}
            />
          </div>
        </div>

        <DialogFooter className="p-5 pb-7 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end rounded-b-[24px]">
          <Button
            variant="outline"
            onClick={onClose}
            className="h-9 px-6 rounded-xl text-sm font-bold border-slate-300 text-slate-700 hover:text-red-600 hover:bg-red-50 hover:border-red-300"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedDoctorId}
            className="h-9 px-6 rounded-xl text-sm font-bold bg-primary hover:bg-primary-600 shadow-sm text-white"
          >
            Xác nhận chuyển
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}