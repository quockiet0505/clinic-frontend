import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Loader2 } from 'lucide-react';
import { SectionContainer } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';

export const RecordDetail: React.FC = () => {
  const { id } = useParams(); // Lấy ID từ URL ví dụ: /records/detail/REC-2026-001
  const [isLoading, setIsLoading] = useState(true);

  // Giả lập load data chi tiết
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <main className="w-full min-h-screen bg-background-light py-10">
      <SectionContainer className="max-w-4xl">
        <Link to="/records" className="flex items-center gap-2 text-slate-500 font-semibold hover:text-primary-500 transition-colors mb-6 w-fit">
          <ArrowLeft className="w-5 h-5" /> Quay lại Hồ sơ y tế
        </Link>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary-500" />
            <p className="font-medium text-[15px]">Đang tải chi tiết bệnh án {id}...</p>
          </div>
        ) : (
          <Card className="rounded-3xl border-border-default shadow-sm bg-white overflow-hidden">
            <div className="bg-primary-50 px-8 py-6 border-b border-border-default">
              <h1 className="text-2xl font-black text-brand-dark flex items-center gap-3">
                <FileText className="w-6 h-6 text-primary-500" /> Bệnh án chi tiết
              </h1>
              <p className="text-slate-600 font-medium mt-2">Mã BA: {id}</p>
            </div>
            <CardContent className="p-8 min-h-[400px]">
              {/* Đây là nơi sau này sếp đổ chi tiết Full các bảng của Database vào */}
              <p className="text-slate-500 text-center mt-20">Nội dung chi tiết của bệnh án sẽ được mở rộng trong giai đoạn phát triển tính năng In ấn/Xuất PDF.</p>
            </CardContent>
          </Card>
        )}
      </SectionContainer>
    </main>
  );
};