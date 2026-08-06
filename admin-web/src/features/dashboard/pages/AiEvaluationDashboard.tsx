import React, { useState, useEffect } from 'react';
import { Brain, TrendingDown, CheckCircle2, Trophy, Zap, ShieldCheck, Scale } from 'lucide-react';
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
  ReferenceDot,
  BarChart,
  Bar,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';

import qwenLog from '@/assets/data/ai_logs/qwen_trainer_state_v2.json';
import seallmLog from '@/assets/data/ai_logs/seallm_trainer_state_v2.json';
import llamaLog from '@/assets/data/ai_logs/vinallama_trainer_state_v2.json';
import { finetuneEvalData, llmJudgeData, moderationData } from '@/assets/data/ai_logs/testData';

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

const CircularProgress = ({ percentage, strokeColor, label, subtext }: { percentage: number, strokeColor: string, label: string, subtext: string }) => {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  return (
    <div className="flex flex-col items-center justify-center group hover:scale-105 transition-transform duration-300">
      <div className="relative w-36 h-36 flex items-center justify-center mb-4">
        {/* Background track */}
        <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
          <circle cx="72" cy="72" r={radius} className="stroke-slate-100" strokeWidth="12" fill="none" />
          <circle 
            cx="72" 
            cy="72" 
            r={radius} 
            className={`${strokeColor} drop-shadow-md`}
            strokeWidth="12" 
            fill="none" 
            strokeDasharray={circumference} 
            strokeDashoffset={strokeDashoffset} 
            strokeLinecap="round" 
            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }} 
          />
        </svg>
        <div className="flex flex-col items-center justify-center z-10">
          <span className="text-3xl font-black text-slate-800">{percentage}%</span>
        </div>
      </div>
      <span className="text-base font-bold text-slate-700">{label}</span>
      <span className="text-xs font-medium text-slate-400 text-center px-4 mt-1">{subtext}</span>
    </div>
  );
};

export default function AiEvaluationDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'training' | 'finetune' | 'moderation'>('training');
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
              onClick={() => setActiveTab('finetune')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'finetune' 
                  ? 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Zap size={16} className={activeTab === 'finetune' ? 'text-amber-500' : 'text-slate-400'} />
              Test Tư vấn Y tế
            </button>
            <button
              onClick={() => setActiveTab('moderation')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === 'moderation' 
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200/60' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck size={16} className={activeTab === 'moderation' ? 'text-emerald-500' : 'text-slate-400'} />
              Test Bộ lọc Bình luận
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

      {activeTab === 'finetune' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          
          <div className="bg-gradient-to-b from-white to-slate-50/50 rounded-[32px] p-8 border border-slate-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center shadow-inner">
                    <Zap size={24} />
                  </div>
                  Đánh giá Cơ bản (Metrics)
                </h3>
                <p className="text-slate-500 font-medium mt-2">So sánh BERTScore, BLEURT và Tốc độ sinh chữ của 3 mô hình ngôn ngữ</p>
              </div>
            </div>
            
            <div className="h-[450px] w-full bg-white rounded-[24px] p-6 shadow-sm border border-slate-100">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={finetuneEvalData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorBert" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="colorBleurt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="colorToken" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="model" stroke="#64748b" fontSize={13} fontWeight={600} tickLine={false} axisLine={false} tickMargin={12} />
                  
                  <YAxis yAxisId="left" orientation="left" stroke="#10b981" fontSize={12} fontStyle="italic" tickLine={false} axisLine={false} domain={[0, 1]} />
                  <YAxis yAxisId="right" orientation="right" stroke="#3b82f6" fontSize={12} fontStyle="italic" tickLine={false} axisLine={false} />
                  
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', opacity: 0.5 }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', fontWeight: 600, padding: '12px 20px' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '14px' }} iconType="circle" />
                  
                  <Bar yAxisId="left" dataKey="bertscore" name="BERTScore" fill="url(#colorBert)" radius={[8, 8, 0, 0]} barSize={36} />
                  <Bar yAxisId="left" dataKey="bleurt" name="BLEURT" fill="url(#colorBleurt)" radius={[8, 8, 0, 0]} barSize={36} />
                  <Bar yAxisId="right" dataKey="tokens_per_sec" name="Tokens/s" fill="url(#colorToken)" radius={[8, 8, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Section 2: LLM-as-a-Judge */}
          <div className="bg-gradient-to-b from-indigo-50/40 to-white rounded-[32px] p-8 border border-indigo-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] mt-8">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black text-indigo-900 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-inner">
                    <Scale size={24} />
                  </div>
                  Đánh giá Chuyên sâu (LLM-as-a-Judge)
                </h3>
                <p className="text-indigo-600/70 font-medium mt-2">So sánh điểm được chấm bởi GPT-4 và Gemini (Thang điểm 0 - 5)</p>
              </div>
            </div>
            
            <div className="h-[450px] w-full bg-white rounded-[24px] p-6 shadow-sm border border-indigo-50">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={llmJudgeData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                  <defs>
                    <linearGradient id="colorGpt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="colorGemini" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0.3}/>
                    </linearGradient>
                    <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.9}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="model" stroke="#64748b" fontSize={14} fontWeight={600} tickLine={false} axisLine={false} tickMargin={12} />
                  <YAxis domain={[0, 5]} stroke="#94a3b8" fontSize={13} fontStyle="italic" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc', opacity: 0.5 }} 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 600, padding: '12px 20px' }} 
                  />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '14px' }} iconType="circle" />
                  <Bar dataKey="gpt" name="Chấm bởi GPT-4" fill="url(#colorGpt)" radius={[8, 8, 0, 0]} barSize={40} />
                  <Bar dataKey="gemini" name="Chấm bởi Gemini" fill="url(#colorGemini)" radius={[8, 8, 0, 0]} barSize={40} />
                  <Bar dataKey="avg" name="Trung bình" fill="url(#colorAvg)" radius={[8, 8, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'moderation' && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/30 rounded-[32px] p-8 border border-emerald-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <div className="mb-10 text-center">
              <h3 className="text-3xl font-black text-emerald-900 flex items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <ShieldCheck size={28} />
                </div>
                Đánh giá Bộ lọc Bình luận
              </h3>
              <p className="text-emerald-700/80 font-medium mt-3 max-w-2xl mx-auto">
                Kết quả kiểm thử trên tập dữ liệu 100 bình luận mẫu. So sánh khả năng nhận diện đúng bình luận "Hợp lệ" và bình luận "Vi phạm" giữa mô hình chưa huấn luyện (Base) và đã huấn luyện (Finetuned).
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {moderationData.map((data, index) => (
                <div key={index} className="bg-white rounded-[24px] p-8 shadow-sm border border-emerald-100 relative overflow-hidden">
                  {/* Decorative background element */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                  
                  <div className="text-center mb-8 relative z-10">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-sm font-bold tracking-wider mb-2">
                      MÔ HÌNH {index + 1}
                    </span>
                    <h4 className="text-2xl font-black text-slate-800">{data.model}</h4>
                  </div>

                  <div className="flex items-start justify-center gap-12 relative z-10">
                    <CircularProgress 
                      percentage={data.approval_accuracy} 
                      strokeColor="stroke-emerald-500" 
                      label="Nhận diện Hợp lệ" 
                      subtext="Khả năng duyệt đúng các bình luận an toàn"
                    />
                    <div className="w-px h-32 bg-slate-100 mt-4"></div>
                    <CircularProgress 
                      percentage={data.violation_accuracy} 
                      strokeColor="stroke-rose-500" 
                      label="Nhận diện Vi phạm" 
                      subtext="Khả năng chặn đứng các bình luận độc hại"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
