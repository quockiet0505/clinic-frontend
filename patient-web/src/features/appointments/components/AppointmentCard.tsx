import React from 'react';
import { CalendarDays, Clock, MapPin, Stethoscope, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { CancelAppointmentDialog } from './CancelAppointmentDialog';
import type { AppointmentHistoryItem } from '../types/appointment';
import { format } from 'date-fns';

interface Props {
  appointment: AppointmentHistoryItem;
  onCancelSuccess: () => void;
}

export const AppointmentCard: React.FC<Props> = ({ appointment, onCancelSuccess }) => {
  const navigate = useNavigate();
  
  // Dùng màu mặc định Tailwind (green, slate) cho các trạng thái chung, màu primary cho trạng thái chờ khám
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'PENDING':
      case 'CONFIRMED':
        return 'bg-primary-50 text-primary-600 border border-primary-200';
      case 'COMPLETED':
        return 'bg-green-50 text-green-700 border border-green-200';
      case 'CANCELLED':
        return 'bg-slate-100 text-slate-500 border border-slate-200';
      default:
        return 'bg-slate-100 text-slate-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'CHỜ XÁC NHẬN';
      case 'CONFIRMED': return 'ĐÃ XÁC NHẬN';
      case 'COMPLETED': return 'ĐÃ KHÁM';
      case 'CANCELLED': return 'ĐÃ HỦY';
      default: return status;
    }
  };

  const isUpcoming = appointment.status === 'CONFIRMED' || appointment.status === 'PENDING';

  return (
    <Card className={`rounded-3xl border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group bg-white overflow-hidden ${appointment.status === 'CANCELLED' ? 'opacity-70' : ''}`}>
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        <div className="flex-1 flex flex-col gap-4 w-full">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`px-3 py-1.5 rounded-lg text-[11px] font-black tracking-wider ${getStatusStyles(appointment.status)}`}>
              {getStatusText(appointment.status)}
            </span>
            <div className={`flex items-center gap-4 font-bold text-[15px] ${appointment.status === 'CANCELLED' ? 'text-slate-400' : 'text-brand-dark'}`}>
              <span className="flex items-center gap-1.5">
                <CalendarDays className={`w-4 h-4 ${appointment.status === 'CANCELLED' ? '' : 'text-primary-500'}`}/> 
                {format(new Date(appointment.appointmentDate), "dd/MM/yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className={`w-4 h-4 ${appointment.status === 'CANCELLED' ? '' : 'text-warning'}`}/> 
                {appointment.timeStart} - {appointment.timeEnd}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-2">
            <p className="text-[16px] font-black text-brand-dark flex items-start gap-2.5 group-hover:text-primary-600 transition-colors">
              <Stethoscope className="w-5 h-5 text-primary-500 shrink-0 mt-0.5" /> 
              <span>Khám {appointment.specialty} - <span>{appointment.doctorName}</span></span>
            </p>
            <p className="text-[14.5px] text-slate-500 flex items-start gap-2.5 font-medium">
              <MapPin className="w-5 h-5 text-primary-500 shrink-0" /> {appointment.facility}
            </p>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto border-t border-slate-100 md:border-0 pt-5 md:pt-0">
          <Button 
            onClick={() => navigate('/appointments/detail')}
            variant="outline" 
            className="flex-1 md:w-auto rounded-xl border-slate-200 text-brand-dark hover:border-primary-500 hover:text-primary-500 hover:bg-primary-50 font-bold h-11 transition-all cursor-pointer"
          >
            Xem chi tiết <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
          
          {isUpcoming && (
            <CancelAppointmentDialog appointmentId={appointment.id} onSuccess={onCancelSuccess} />
          )}
        </div>

      </CardContent>
    </Card>
  );
};