export const finetuneEvalData = [
  { model: "Qwen 2.5 (7B)", bertscore: 0.7068, bleurt: 0.3401, tokens_per_sec: 32.57 },
  { model: "SeaLLM v2.5 (7B)", bertscore: 0.6509, bleurt: 0.3311, tokens_per_sec: 34.68 },
  { model: "VinaLlama (7B)", bertscore: 0.5984, bleurt: 0.3895, tokens_per_sec: 32.6 }
];

export const llmJudgeData = [
  { model: "Qwen 2.5 (7B)", gpt: 3.47, gemini: 3.20, avg: 3.34 },
  { model: "SeaLLM v2.5 (7B)", gpt: 2.99, gemini: 2.54, avg: 2.76 },
  { model: "VinaLlama (7B)", gpt: 2.73, gemini: 2.25, avg: 2.49 }
];

export const moderationData = [
  { model: "Qwen 2.5 Base", approval_accuracy: 98.0, violation_accuracy: 89.0 },
  { model: "Qwen 2.5 Finetuned (Chat)", approval_accuracy: 95.0, violation_accuracy: 86.0 }
];
