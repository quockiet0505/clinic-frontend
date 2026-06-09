import React from 'react';
import { Pill, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface MedicineCardProps {
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  type: 'Tablet' | 'Capsule' | 'Syrup' | 'Injection' | string;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicineName,
  dosage,
  frequency,
  duration,
  instructions,
  type,
}) => {
  return (
    <Card className="p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-500">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-[16px]">{medicineName}</h3>
            <span className="text-[13px] font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              {type} • {dosage}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center gap-2 text-[14px] text-slate-600">
          <Clock className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{frequency}</span>
        </div>
        <div className="flex items-center gap-2 text-[14px] text-slate-600">
          <AlertCircle className="w-4 h-4 text-slate-400" />
          <span className="font-medium">{duration}</span>
        </div>
      </div>
      {instructions && (
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
          <p className="text-[13.5px] text-slate-600 font-medium leading-relaxed">
            <span className="font-bold text-slate-700">Chỉ định: </span>
            {instructions}
          </p>
        </div>
      )}
    </Card>
  );
};
