import React from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export const CancelAppointmentDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  onConfirm,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>

      <AlertDialogContent className="rounded-3xl">

        <AlertDialogHeader>
          <AlertDialogTitle>
            Hủy lịch khám
          </AlertDialogTitle>

          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy lịch khám này không?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>

          <AlertDialogCancel className="rounded-xl">
            Quay lại
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={onConfirm}
            className="bg-red-500 hover:bg-red-600 rounded-xl"
          >
            Xác nhận hủy
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>

    </AlertDialog>
  );
};