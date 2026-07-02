import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { settingsApi } from '../api/settingsApi';
import toast from 'react-hot-toast';

export default function BannerSettingsSection() {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file hình ảnh');
      return;
    }

    // Just Preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      await settingsApi.uploadBanner('main', selectedFile);
      toast.success('Đổi banner thành công!');
      setSelectedFile(null);
    } catch (error) {
      // toast is handled by interceptor
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cài đặt Banner Trang chủ</h2>
          <p className="text-sm text-slate-500 mt-1">Thay đổi ảnh nền chính của ứng dụng bệnh nhân (patient-web)</p>
        </div>
        
        <div className="flex gap-3">
          {selectedFile ? (
            <>
              <Button 
                variant="outline" 
                onClick={handleCancel}
                disabled={uploading}
              >
                Hủy
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={uploading}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm"
              >
                {uploading && <Loader2 size={16} className="mr-2 animate-spin" />}
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <Button 
              onClick={() => fileInputRef.current?.click()} 
              disabled={uploading}
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
            >
              <Upload size={16} className="mr-2" />
              Chọn ảnh
            </Button>
          )}
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>
      
      <div className="p-6 bg-slate-50">
        <div className="w-full max-w-4xl mx-auto">
          <p className="text-xs font-medium text-slate-500 mb-3 uppercase tracking-wider">Bản xem trước (Preview)</p>
          <div className="relative aspect-[21/9] bg-slate-200 rounded-xl overflow-hidden border border-slate-300 border-dashed flex items-center justify-center">
            {previewUrl ? (
              <img src={previewUrl} alt="Banner Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <ImageIcon size={48} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Chưa có ảnh xem trước</p>
                <p className="text-xs mt-1">Vui lòng tải ảnh lên để xem thử</p>
              </div>
            )}
          </div>
          <div className="mt-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm flex gap-3 items-start border border-blue-100">
            <ImageIcon size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Khuyến nghị hình ảnh</p>
              <ul className="list-disc pl-4 space-y-1 text-blue-600/80">
                <li>Kích thước tối ưu: <strong>1920x600 px</strong> hoặc tỷ lệ tương đương.</li>
                <li>Định dạng: <strong>JPG, PNG, WEBP</strong>.</li>
                <li>Hệ thống sẽ tự động phủ một lớp màu xanh nhẹ lên ảnh để đảm bảo chữ trên banner luôn đọc được.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
