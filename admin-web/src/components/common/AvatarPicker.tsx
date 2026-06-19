import React, { useRef, useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import EntityAvatar from './EntityAvatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

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
    <div className="col-span-2 flex flex-col sm:flex-row items-center gap-4 pb-4 mb-1 border-b border-slate-100">
      <button
        type="button"
        onClick={openPicker}
        className="relative group rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-100 shrink-0"
        title="Chọn / đổi ảnh đại diện"
      >
        <EntityAvatar name={name} imageUrl={displayUrl} size="lg" className="!w-16 !h-16 !text-xl" />
        <span className="absolute inset-0 rounded-full bg-black/45 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
          <Camera className="text-white w-5 h-5" />
        </span>
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      <div className="flex-1 w-full space-y-2">
        <p className="text-sm font-semibold text-slate-700">Ảnh đại diện</p>
        <Input
          value={imageUrl}
          onChange={(e) => onImageUrlChange(e.target.value)}
          placeholder="/images/doctors/ten-file.jpg"
          className="h-9 rounded-xl font-medium text-sm"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={openPicker}
          className="rounded-xl text-xs font-bold"
        >
          Chọn / đổi ảnh
        </Button>
        <p className="text-xs text-slate-500">
          Bấm vào ảnh hoặc nút trên để chọn file. Nhập URL nếu ảnh đã có trên server.
        </p>
      </div>
    </div>
  );
}
