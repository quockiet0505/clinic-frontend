/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { appointmentApi } from '../api/appointmentApi';
import { useToast } from '@/hooks/useToast';

interface CancelAppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
  onSuccess: () => void;
}

export const CancelAppointmentDialog: React.FC<CancelAppointmentDialogProps> = ({
  open,
  onOpenChange,
  appointmentId,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCancel = async () => {
    if (!reason.trim()) {
      toast({ title: 'Error', description: 'Please provide a cancellation reason', variant: 'destructive' });
      return;
    }
    setLoading(true);
    try {
      const result = await appointmentApi.cancelAppointment(appointmentId, reason);
      if (result.success) {
        toast({ title: 'Success', description: result.message });
        onSuccess();
        onOpenChange(false);
        setReason('');
      } else {
        toast({ title: 'Error', description: result.message, variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to cancel appointment', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl">
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogDescription>Please tell us why you are cancelling this appointment.</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="Reason for cancellation"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-2"
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Back</Button>
          <Button variant="destructive" onClick={handleCancel} disabled={loading}>
            {loading ? 'Processing...' : 'Cancel Appointment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};