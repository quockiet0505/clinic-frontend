import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { appointmentApi } from '../api/appointmentApi';

interface Props {
  appointmentId: string;
  onSuccess: () => void;
}

export const CancelAppointmentDialog: React.FC<Props> = ({ appointmentId, onSuccess }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn dialog đóng ngay lập tức
    setIsCancelling(true);
    try {
      await appointmentApi.cancelAppointment(appointmentId);
      setIsOpen(false);
      onSuccess();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" className="flex-1 md:w-auto rounded-xl border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 font-bold h-11 transition-all">
          Hủy lịch
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl bg-white border-border-default shadow-xl max-w-md p-6">
        <AlertDialogHeader className="mb-2">
          <AlertDialogTitle className="text-xl font-black text-brand-dark">
            Xác nhận hủy lịch khám
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[15px] text-slate-600">
            Bạn có chắc chắn muốn hủy lịch khám này không? Thao tác này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="flex flex-row gap-3 w-full sm:justify-end mt-4">
          <AlertDialogCancel disabled={isCancelling} className="rounded-xl h-12 font-bold flex-1 sm:flex-none sm:px-6 m-0 border-border-default text-slate-600">
            Quay lại
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isCancelling}
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl h-12 font-bold flex-1 sm:flex-none sm:px-6 m-0"
          >
            {isCancelling ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Xác nhận hủy'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};