/**
 * AI声调检测组件
 * 用户录音后模拟AI分析调值，给出纠音建议
 */
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Mic } from "lucide-react";

const DONG_TONES_DESC: Record<string, string> = {
  "55":  "高平调（音高不变）",
  "35":  "中升调（中到高）",
  "11":  "低平调（音低不变）",
  "323": "曲折调（中-低-中）",
  "13":  "低升调（低到中）",
  "31":  "中降调（中到低）",
  "53":  "高降调（高到中）",
  "453": "升降调（中高-降中）",
  "33":  "中平调（音中不变）",
};

export default function AiToneDetect() {
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<{ tone: string; desc: string; confidence: string; feedback: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRefTone, setSelectedRefTone] = useState<string>("55");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setError(null); setResult(null); setAudioBlob(null); setAudioUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        stream.getTracks().forEach(t => t.stop());
      };
      mr.start();
      mediaRecorderRef.current = mr;
      setRecording(true);
    } catch {
      setError("请允许浏览器访问麦克风权限");
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  const analyzeAudio = async () => {
    if (!audioBlob) return;
    setAnalyzing(true); setError(null); setResult(null);
    try {
      // 模拟AI分析（展示用，1.5秒延迟）
      await new Promise(r => setTimeout(r, 1500));
      const tones = Object.keys(DONG_TONES_DESC);
      // 模拟：70%概率检测正确
      const isCorrect = Math.random() < 0.7;
      const detectedTone = isCorrect
        ? selectedRefTone
        : tones.filter(t => t !== selectedRefTone)[Math.floor(Math.random() * (tones.length - 1))];
      const confidenceOptions = isCorrect ? ["高", "中"] : ["中", "低"];
      const confidence = confidenceOptions[Math.floor(Math.random() * confidenceOptions.length)];
      setResult({
        tone: detectedTone,
        desc: DONG_TONES_DESC[detectedTone],
        confidence,
        feedback: isCorrect
          ? `发音准确！${selectedRefTone}调（${DONG_TONES_DESC[selectedRefTone]}）的音高控制很好，继续保持。`
          : `检测到声调为${detectedTone}（${DONG_TONES_DESC[detectedTone]}），目标是${selectedRefTone}（${DONG_TONES_DESC[selectedRefTone]}）。建议多听真实录音，注意音高走向的差异。`
      });
    } catch {
      setError("分析失败，请重试");
    } finally {
      setAnalyzing(false);
    }
  };

  const toneOptions = Object.entries(DONG_TONES_DESC);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-2xl border p-6 bg-white shadow-sm" style={{ borderColor: "rgba(58,58,110,0.12)" }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(58,58,110,0.1)" }}>
            <Mic className="w-5 h-5" style={{ color: "#3a3a6e" }} />
          </div>
          <div>
            <h2 className="font-bold text-lg" style={{ color: "#3a3a6e" }}>AI声调检测</h2>
            <p className="text-xs" style={{ color: "rgba(58,58,110,0.6)" }}>录制你的发音，AI自动判断调值并给出建议</p>
          </div>
        </div>

        {/* 选择目标声调 */}
        <div className="mb-5">
          <p className="text-sm font-medium mb-2" style={{ color: "#3a3a6e" }}>1. 选择要练习的目标声调</p>
          <div className="flex flex-wrap gap-2">
            {toneOptions.map(([code, desc]) => (
              <button key={code} onClick={() => setSelectedRefTone(code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  selectedRefTone === code
                    ? "text-white border-transparent shadow-sm"
                    : "bg-white border-[#3a3a6e]/20 text-[#3a3a6e]/70 hover:border-[#3a3a6e]/40"
                }`}
                style={selectedRefTone === code ? { backgroundColor: "#3a3a6e" } : {}}>
                {code} <span className="opacity-70">{desc.split("（")[0]}</span>
              </button>
            ))}
          </div>
          <p className="text-xs mt-2" style={{ color: "rgba(58,58,110,0.5)" }}>
            当前目标：<strong style={{ color: "#3a3a6e" }}>{selectedRefTone} {DONG_TONES_DESC[selectedRefTone]}</strong>
          </p>
        </div>

        {/* 录音区域 */}
        <div className="mb-5">
          <p className="text-sm font-medium mb-3" style={{ color: "#3a3a6e" }}>2. 录制你的发音</p>
          <div className="flex items-center gap-3">
            {!recording ? (
              <button onClick={startRecording}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium text-sm transition-all hover:opacity-90"
                style={{ backgroundColor: "#e63946" }}>
                <Mic className="w-4 h-4" />开始录音
              </button>
            ) : (
              <button onClick={stopRecording}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-white font-medium text-sm animate-pulse"
                style={{ backgroundColor: "#e63946" }}>
                <span className="w-3 h-3 bg-white rounded-sm inline-block" />停止录音
              </button>
            )}
            {audioUrl && (
              <audio controls src={audioUrl} className="flex-1 h-9" style={{ maxWidth: 220 }} />
            )}
          </div>
          {recording && (
            <p className="text-xs mt-2 animate-pulse" style={{ color: "#e63946" }}>● 录音中，请发出一个单音节（约0.5-1秒）</p>
          )}
        </div>

        {/* 分析按钮 */}
        {audioBlob && !recording && (
          <div className="mb-5">
            <button onClick={analyzeAudio} disabled={analyzing}
              className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium text-sm transition-all disabled:opacity-60"
              style={{ backgroundColor: "#3a3a6e" }}>
              {analyzing ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />分析中…</>
              ) : (
                <>✨ AI分析声调</>
              )}
            </button>
          </div>
        )}

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* 分析结果 */}
        {result && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-5 border" style={{ backgroundColor: "rgba(58,58,110,0.04)", borderColor: "rgba(58,58,110,0.15)" }}>
            <h3 className="font-bold text-sm mb-3" style={{ color: "#3a3a6e" }}>分析结果</h3>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(58,58,110,0.5)" }}>目标声调</p>
                <p className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>{selectedRefTone}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(58,58,110,0.5)" }}>检测结果</p>
                <p className={`text-2xl font-bold ${result.tone === selectedRefTone ? "text-green-600" : "text-orange-500"}`}>{result.tone}</p>
              </div>
              <div className="bg-white rounded-lg p-3 text-center border" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                <p className="text-xs mb-1" style={{ color: "rgba(58,58,110,0.5)" }}>置信度</p>
                <p className={`text-lg font-bold ${
                  result.confidence === "高" ? "text-green-600" : result.confidence === "中" ? "text-yellow-600" : "text-red-500"
                }`}>{result.confidence}</p>
              </div>
            </div>
            <div className={`rounded-lg p-3 ${
              result.tone === selectedRefTone ? "bg-green-50 border border-green-200" : "bg-amber-50 border border-amber-200"
            }`}>
              <p className={`text-sm ${
                result.tone === selectedRefTone ? "text-green-700" : "text-amber-700"
              }`}>
                {result.feedback}
              </p>
            </div>
            <p className="text-xs mt-3" style={{ color: "rgba(58,58,110,0.4)" }}>
              检测声调：{result.tone} {result.desc}
            </p>
          </motion.div>
        )}

        {/* 说明 */}
        <div className="mt-5 pt-4 border-t" style={{ borderColor: "rgba(58,58,110,0.08)" }}>
          <p className="text-xs" style={{ color: "rgba(58,58,110,0.45)" }}>
            使用方法：选择目标声调 → 录制一个单音节 → AI分析。建议先在「听辨测验」中熟悉各声调的音高特征，再用AI检测验证自己的发音。
          </p>
        </div>
      </div>
    </div>
  );
}
