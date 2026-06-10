import React, { useState } from 'react';
import { Activity, Download, Eye, FileText, FlaskConical } from 'lucide-react';
import { SearchInput } from '@/components/common/SearchInput';
import { SectionContainer } from '@/components/common';
import { Card } from '@/components/ui/card';

export const LabResults: React.FC = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState('');

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await import('../api/recordApi').then(m => m.recordApi.getLabResults());
        setResults(data);
      } catch (error) {
        console.error('Failed to fetch lab results:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter((r: any) => 
    r.resultData?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.conclusion?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <main className="min-h-screen bg-slate-50 py-10">
      <SectionContainer className="max-w-5xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-2">Kết Quả Xét Nghiệm & CLS</h1>
            <p className="text-[14.5px] text-slate-500 font-medium">
              Xem chi tiết các chỉ số sinh hóa và kết quả chẩn đoán hình ảnh.
            </p>
          </div>
          <div className="w-full md:w-80">
            <SearchInput
              value={searchQuery}
              onSearch={setSearchQuery}
              placeholder="Tìm theo kết quả, kết luận..."
              className="h-11"
            />
          </div>
        </div>

        {filteredResults.length > 0 ? (
          <div className="grid gap-6">
            {filteredResults.map((result: any) => (
              <Card key={result.resultId} className="overflow-hidden border-0 shadow-sm rounded-3xl bg-white">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                        <FlaskConical className="w-7 h-7" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">Kết quả xét nghiệm #{result.resultId}</h2>
                        <p className="text-sm text-slate-500 font-medium">Thực hiện: {new Date(result.enteredAt).toLocaleString('vi-VN')} • KTV: {result.enteredBy}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col gap-4">
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Kết quả:</h3>
                      <p className="text-slate-600 text-[14.5px] whitespace-pre-wrap">{result.resultData}</p>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-700 text-sm mb-1">Kết luận:</h3>
                      <p className="text-slate-600 text-[14.5px] font-medium whitespace-pre-wrap">{result.conclusion}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 shadow-sm p-12 text-center flex flex-col items-center justify-center bg-white mt-8">
            <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
              <FlaskConical className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800 mb-2">Chưa có kết quả xét nghiệm nào</h2>
            <p className="text-slate-500 text-[15px] font-medium max-w-md">
              Bạn chưa có kết quả xét nghiệm cận lâm sàng nào được trả về hoặc không có kết quả nào khớp với bộ lọc.
            </p>
          </div>
        )}
      </SectionContainer>
    </main>
  );
};
