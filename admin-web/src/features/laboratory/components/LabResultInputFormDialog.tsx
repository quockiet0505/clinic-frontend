import React, { useState } from 'react';
import { Microscope, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import FileUpload, { UploadedPreview } from '@/components/common/FileUpload';
import { uploadApi } from '@/api/uploadApi';
import { getImageUrl } from '@/utils/image';

interface Props {
  order: any;
  onClose: () => void;
  onSubmit: (orderId: number, data: { resultData: string; conclusion: string; attachmentUrls?: string }) => void;
}

export default function LabResultInputForm({ order, onClose, onSubmit }: Props) {
  const isOpen = !!order;
  const [resultData, setResultData] = useState('');
  const [conclusion, setConclusion] = useState('');
  const [attachmentUrls, setAttachmentUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadApi.uploadImage(file);
      setAttachmentUrls(prev => [...prev, url]);
    } catch {
      /* toast: axios interceptor */
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    setResultData('');
    setConclusion('');
    setAttachmentUrls([]);
    onClose();
  };

  const handleSubmit = () => {
    if (!resultData.trim() || !conclusion.trim()) return;
    onSubmit(order.orderId, {
      resultData: resultData.trim(),
      conclusion: conclusion.trim(),
      attachmentUrls: attachmentUrls.length > 0 ? JSON.stringify(attachmentUrls) : undefined,
    });
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[560px] p-0 border-0 rounded-[24px] shadow-2xl">
        <div className="p-5 bg-primary-50 border-b border-primary-100 rounded-t-[24px]">
          <div className="flex items-center gap-2 mb-2 text-primary-600 text-sm">
            <Microscope size={16} />
          </div>
          <DialogTitle className="text-2xl font-semibold">Nhập kết quả xét nghiệm</DialogTitle>
          <DialogDescription className="text-sm text-primary-600/80 font-medium mt-1">
            Ghi nhận kết quả cho {order.patientName} ({order.serviceName}).
          </DialogDescription>
        </div>

        <div className="p-5 space-y-4 bg-white">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Chỉ số xét nghiệm <span className="text-red-500">*</span></label>
            <textarea
              value={resultData}
              onChange={(e) => setResultData(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm"
              placeholder="VD: WBC: 6.5, RBC: 4.8, HGB: 14.2..."
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700">Kết luận lâm sàng <span className="text-red-500">*</span></label>
            <textarea
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm"
              placeholder="VD: Các chỉ số trong giới hạn bình thường."
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">Ảnh / file đính kèm</p>
            {uploading ? (
              <div className="flex items-center gap-2 text-sm text-slate-500 py-4">
                <Loader2 className="animate-spin" size={16} /> Đang tải ảnh...
              </div>
            ) : (
              <FileUpload onFileSelect={handleUpload} label="Tải ảnh kết quả" multiple />
            )}
            <UploadedPreview
              urls={attachmentUrls}
              onRemove={(index) => setAttachmentUrls(prev => prev.filter((_, i) => i !== index))}
              resolveUrl={getImageUrl}
            />
          </div>
        </div>

        <DialogFooter className="p-5 pb-7 bg-slate-50 border-t border-slate-100 flex gap-4 justify-end rounded-b-[24px]">
          <Button variant="outline" onClick={handleClose} className="h-9 px-6 rounded-xl text-sm font-bold">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!resultData.trim() || !conclusion.trim()}
            className="h-9 px-6 rounded-xl text-sm font-bold bg-primary hover:bg-primary-600 text-white"
          >
            Lưu kết quả
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
