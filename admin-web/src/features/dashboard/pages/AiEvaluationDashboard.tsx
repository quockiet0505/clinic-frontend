import React, { useState, useEffect } from 'react';
import { Brain, TrendingDown, Clock, CheckCircle2, Trophy } from 'lucide-react';
import DetailPageHeader from '@/components/common/DetailPageHeader';
import { useNavigate } from 'react-router-dom';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

import qwenLog from '@/assets/data/ai_logs/qwen_trainer_state_v2.json';
import seallmLog from '@/assets/data/ai_logs/seallm_trainer_state_v2.json';
import llamaLog from '@/assets/data/ai_logs/vinallama_trainer_state_v2.json';

// Types
type LogEntry = {
  loss?: number;
  learning_rate?: number;
  epoch?: number;
  step: number;
};

type ProcessedData = {
  step: number;
  qwen_loss?: number;
  seallm_loss?: number;
  llama_loss?: number;
};

type MinStat = { loss: number; step: number };

export default function AiEvaluationDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'training' | 'testing'>('training');
  const [chartData, setChartData] = useState<ProcessedData[]>([]);
  const [minStats, setMinStats] = useState({
    qwen: { loss: Infinity, step: 0 } as MinStat,
    seallm: { loss: Infinity, step: 0 } as MinStat,
    llama: { loss: Infinity, step: 0 } as MinStat,
  });

  useEffect(() => {
    // Process logs from Hugging Face trainer_state.json format
    const qwenHistory = (qwenLog.log_history || []) as LogEntry[];
    const seallmHistory = (seallmLog.log_history || []) as LogEntry[];
    const llamaHistory = (llamaLog.log_history || []) as LogEntry[];

    const map = new Map<number, ProcessedData>();
    
    let qMin = { loss: Infinity, step: 0 };
    let sMin = { loss: Infinity, step: 0 };
    let lMin = { loss: Infinity, step: 0 };

    const addData = (history: LogEntry[], key: 'qwen_loss' | 'seallm_loss' | 'llama_loss', tracker: MinStat) => {
      history.forEach(log => {
        if (log.loss !== undefined && log.step !== undefined) {
          if (!map.has(log.step)) {
            map.set(log.step, { step: log.step });
          }
          map.get(log.step)![key] = log.loss;
          
          if (log.loss < tracker.loss) {
            tracker.loss = log.loss;
            tracker.step = log.step;
          }
        }
      });
    };

    addData(qwenHistory, 'qwen_loss', qMin);
    addData(seallmHistory, 'seallm_loss', sMin);
    addData(llamaHistory, 'llama_loss', lMin);

    // Sort by step
    const sorted = Array.from(map.values()).sort((a, b) => a.step - b.step);
    setChartData(sorted);
    setMinStats({ qwen: qMin, seallm: sMin, llama: lMin });
  }, []);

  return (
    <div className="space-y-6">
      <DetailPageHeader
        title="Đánh giá Mô hình AI"
        subtitle="Giám sát tiến trình huấn luyện và kết quả kiểm thử của các mô hình LLM."
        onBack={() => navigate('/dashboard')}
        backLabel="Quay lại Dashboard"
        actions={
          <div className="flex gap-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-sm">
            <button
              onClick={() => setActiveTab('training')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'training' 
                  ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <TrendingDown size={16} className={activeTab === 'training' ? 'text-blue-500' : 'text-slate-400'} />
              Tiến trình Huấn luyện
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'testing' 
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckCircle2 size={16} className={activeTab === 'testing' ? 'text-indigo-500' : 'text-slate-400'} />
              Kết quả Kiểm thử
            </button>
          </div>
        }
      />

      {activeTab === 'training' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          {/* Bảng so sánh Loss thấp nhất */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Qwen 2.5 (7B)</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-black text-slate-800">{minStats.qwen.loss !== Infinity ? minStats.qwen.loss.toFixed(4) : 'N/A'}</h4>
                  <span className="text-xs font-medium text-slate-400">tại step {minStats.qwen.step}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">SeaLLM v2.5 (7B)</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-black text-slate-800">{minStats.seallm.loss !== Infinity ? minStats.seallm.loss.toFixed(4) : 'N/A'}</h4>
                  <span className="text-xs font-medium text-slate-400">tại step {minStats.seallm.step}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                <Trophy size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">VinaLlama (7B)</p>
                <div className="flex items-baseline gap-2">
                  <h4 className="text-2xl font-black text-slate-800">{minStats.llama.loss !== Infinity ? minStats.llama.loss.toFixed(4) : 'N/A'}</h4>
                  <span className="text-xs font-medium text-slate-400">tại step {minStats.llama.step}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[24px] p-6 border border-slate-200/60 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <Brain className="text-blue-500" size={24} />
                  Biểu đồ Training Loss (QLoRA)
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Đường đồ thị mỏng giúp dễ nhìn khi các mô hình xếp chồng lên nhau. Các điểm tròn lớn đánh dấu vị trí Loss hội tụ thấp nhất.
                </p>
              </div>
            </div>

            <div className="h-[500px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="step" 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    label={{ value: 'Training Steps', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 13 }}
                  />
                  <YAxis 
                    stroke="#94a3b8"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    domain={['auto', 'auto']}
                    label={{ value: 'Training Loss', angle: -90, position: 'insideLeft', offset: 10, fill: '#64748b', fontSize: 13 }}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px' }} />
                  
                  {/* QWEN */}
                  <Line 
                    type="monotone" 
                    dataKey="qwen_loss" 
                    name="Qwen 2.5 (7B)" 
                    stroke="#3b82f6" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 6, fill: '#3b82f6' }}
                    strokeOpacity={0.8}
                  />
                  {minStats.qwen.loss !== Infinity && (
                    <ReferenceDot x={minStats.qwen.step} y={minStats.qwen.loss} r={6} fill="#3b82f6" stroke="white" strokeWidth={2} />
                  )}

                  {/* SEALLM */}
                  <Line 
                    type="monotone" 
                    dataKey="seallm_loss" 
                    name="SeaLLM v2.5 (7B)" 
                    stroke="#10b981" 
                    strokeWidth={1.5}
                    dot={false}
                    activeDot={{ r: 6, fill: '#10b981' }}
                    strokeOpacity={0.8}
                  />
                  {minStats.seallm.loss !== Infinity && (
                    <ReferenceDot x={minStats.seallm.step} y={minStats.seallm.loss} r={6} fill="#10b981" stroke="white" strokeWidth={2} />
                  )}

                  {/* LLAMA */}
                  <Line 
                    type="monotone" 
                    dataKey="llama_loss" 
                    name="VinaLlama (7B)" 
                    stroke="#8b5cf6" 
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="4 4"
                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                    strokeOpacity={0.8}
                  />
                  {minStats.llama.loss !== Infinity && (
                    <ReferenceDot x={minStats.llama.step} y={minStats.llama.loss} r={6} fill="#8b5cf6" stroke="white" strokeWidth={2} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'testing' && (
        <div className="flex flex-col items-center justify-center bg-white rounded-[24px] p-12 border border-slate-200/60 shadow-sm min-h-[400px] animate-in fade-in slide-in-from-bottom-2 duration-500">
           <div className="w-16 h-16 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mb-6">
              <Clock size={32} />
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">Đang chờ dữ liệu Kiểm thử (Testing)</h3>
           <p className="text-slate-500 text-center max-w-md">
             Phần này sẽ hiển thị bảng điểm so sánh tốc độ (Tokens/s), BLEU, BERTScore và điểm đánh giá bởi GPT-4.
             <br/><br/>
             Vui lòng hoàn tất huấn luyện mô hình thứ 3 và chạy kịch bản Test để cập nhật kết quả.
           </p>
        </div>
      )}
    </div>
  );
}
