import React, { useRef, useState, useEffect } from 'react';
import { Camera, UploadCloud, X } from 'lucide-react';
import EntityAvatar from './EntityAvatar';

interface AvatarPickerProps {
  name: string;
  imageUrl?: string;
  onImageUrlChange: (url: string) => void;
}

export default function AvatarPicker({ name, imageUrl = '', onImageUrlChange }: AvatarPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  useEffect(() => {
    setLocalPreview(null);
  }, [imageUrl]);

  const displayUrl = localPreview || imageUrl;

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (localPreview) URL.revokeObjectURL(localPreview);
    const blob = URL.createObjectURL(file);
    setLocalPreview(blob);
    onImageUrlChange(`/images/doctors/${file.name}`);
    e.target.value = '';
  };

  const openPicker = () => inputRef.current?.click();

  return (
    <div className="col-span-2 flex items-center gap-5 pb-4 mb-1 border-b border-slate-100">
      {/* Avatar preview — click to change */}
      <button
        type="button"
        onClick={openPicker}
        className="relative group rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 shrink-0"
        title="Chọn / đổi ảnh đại diện"
      >
        <EntityAvatar name={name} imageUrl={displayUrl} size="lg" className="!w-16 !h-16 !text-xl" />
        <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white w-5 h-5" />
        </span>
      </button>

      {/* Upload area — giống ServiceFormDialog */}
      <div className="flex-1">
        <p className="text-sm font-semibold text-slate-700 mb-2">Ảnh đại diện</p>
        {displayUrl ? (
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 truncate max-w-[200px]">{imageUrl}</span>
            <button
              type="button"
              onClick={() => { setLocalPreview(null); onImageUrlChange(''); }}
              className="flex items-center gap-1 text-xs text-red-500 font-semibold hover:text-red-700 transition-colors cursor-pointer"
            >
              <X size={12} /> Xóa ảnh
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            onClick={openPicker}
            onKeyDown={(e) => e.key === 'Enter' && openPicker()}
            className="border-2 border-dashed border-slate-200 rounded-xl px-4 py-3 flex items-center gap-3 bg-slate-50 hover:bg-primary-50/40 hover:border-primary-300 transition-all cursor-pointer"
          >
            <UploadCloud size={20} className="text-slate-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-slate-600">Chọn ảnh</p>
              <p className="text-xs text-slate-400">Nhấn để tải ảnh lên</p>
            </div>
          </div>
        )}
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
    </div>
  );
}
