/**
 * 侗族语言学习平台 - 田野调查真实发音页面
 * 设计风格：青蓝雅致，宣纸质感，侗族纹样装饰
 * 展示来自贵州榕江三宝侗寨的真实田野调查录音数据
 */
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { fieldWordList, toneInfo, REAL_AUDIO_CDN, FieldWord } from "@/lib/dongData";
import { Play, Pause, Volume2, Info, BookOpen, Mic, ChevronDown, ChevronUp } from "lucide-react";

// 按声调分组
const groupByTone = (words: FieldWord[]) => {
  const groups: Record<string, { open: FieldWord[]; checked: FieldWord[] }> = {};
  for (const w of words) {
    if (!groups[w.tone]) groups[w.tone] = { open: [], checked: [] };
    if (w.syllableType === "open") groups[w.tone].open.push(w);
    else groups[w.tone].checked.push(w);
  }
  return groups;
};

// 声调曲线SVG（简版，用于列表展示）
function MiniToneCurve({ tone }: { tone: string }) {
  const curves: Record<string, string> = {
    "55": "M 10,30 L 90,30",
    "35": "M 10,60 L 90,20",
    "11": "M 10,70 L 90,70",
    "323": "M 10,40 L 40,70 L 70,40 L 90,40",
    "13": "M 10,70 L 90,40",
    "31": "M 10,30 L 90,60",
    "53": "M 10,20 L 90,50",
    "453": "M 10,50 L 40,20 L 90,50",
    "33": "M 10,50 L 90,50",
  };
  const colors: Record<string, string> = {
    "55": "#e74c3c", "35": "#e67e22", "11": "#27ae60",
    "323": "#2980b9", "13": "#8e44ad", "31": "#16a085",
    "53": "#c0392b", "453": "#d35400", "33": "#7f8c8d",
  };
  return (
    <svg width="50" height="28" viewBox="0 0 100 90" className="inline-block">
      <path d={curves[tone] || "M 10,50 L 90,50"} stroke={colors[tone] || "#666"} strokeWidth="5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

// 音频播放器组件
function AudioPlayer({ audioKey, label }: { audioKey: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const url = REAL_AUDIO_CDN[audioKey];

  const handlePlay = () => {
    if (!url) return;
    if (playing && audioRef.current) {
      audioRef.current.pause();
      setPlaying(false);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    audio.play();
    setPlaying(true);
    audio.ontimeupdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100 || 0);
    };
    audio.onended = () => {
      setPlaying(false);
      setProgress(0);
    };
  };

  return (
    <div className="flex items-center gap-3 bg-white/80 rounded-xl px-4 py-3 border border-[#3a3a6e]/10 shadow-sm">
      <button
        onClick={handlePlay}
        className="w-10 h-10 rounded-full bg-[#3a3a6e] text-white flex items-center justify-center hover:bg-[#5a5a9e] transition-colors flex-shrink-0"
      >
        {playing ? <Pause size={16} /> : <Play size={16} />}
      </button>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[#3a3a6e] mb-1">{label}</div>
        <div className="h-1.5 bg-[#3a3a6e]/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#3a3a6e] rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <Volume2 size={16} className="text-[#3a3a6e]/40 flex-shrink-0" />
    </div>
  );
}

// 词汇卡片
function WordCard({ word }: { word: FieldWord }) {
  const color = toneInfo[word.tone]?.color || "#3a3a6e";
  return (
    <div className="bg-white/90 rounded-xl border border-[#3a3a6e]/10 px-4 py-3 flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
        style={{ backgroundColor: color }}>
        {word.tone}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#3a3a6e] text-base">{word.dongSpelling}</span>
          <span className="text-xs text-gray-400 font-mono">[{word.ipa}]</span>
          <span className="text-xs px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: color + "cc" }}>
            {word.syllableType === "open" ? "舒声" : "促声"}
          </span>
        </div>
        <div className="text-sm text-gray-600 mt-0.5">{word.chinese}</div>
      </div>
      <MiniToneCurve tone={word.tone} />
    </div>
  );
}

// 声调卡片（展开/折叠）
function ToneSection({ tone, words }: { tone: string; words: { open: FieldWord[]; checked: FieldWord[] } }) {
  const [expanded, setExpanded] = useState(false);
  const info = toneInfo[tone];
  if (!info) return null;
  const allWords = [...words.open, ...words.checked];
  const hasChecked = words.checked.length > 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#3a3a6e]/10 shadow-sm bg-white/60 backdrop-blur-sm">
      {/* 声调标题栏 */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-white/80 transition-colors text-left"
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0"
          style={{ backgroundColor: info.color }}>
          {tone}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-bold text-[#3a3a6e] text-lg">{info.name}</span>
            <span className="text-sm text-gray-500">五度标记法：{tone}</span>
            <span className="text-xs bg-[#3a3a6e]/10 text-[#3a3a6e] px-2 py-0.5 rounded-full">
              {allWords.length} 个词汇
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{info.description}</p>
        </div>
        <MiniToneCurve tone={tone} />
        {expanded ? <ChevronUp size={20} className="text-[#3a3a6e]/40 flex-shrink-0" /> : <ChevronDown size={20} className="text-[#3a3a6e]/40 flex-shrink-0" />}
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="px-6 pb-6 border-t border-[#3a3a6e]/10">
          {/* 真实音频播放器 */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {words.open.length > 0 && (
              <AudioPlayer
                audioKey={`tone_${tone}_open`}
                label={`${tone}调 · 舒声示例（${words.open.length}词）`}
              />
            )}
            {hasChecked && (
              <AudioPlayer
                audioKey={`tone_${tone}_checked`}
                label={`${tone}调 · 促声示例（${words.checked.length}词）`}
              />
            )}
          </div>

          {/* 词汇列表 */}
          {words.open.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-[#3a3a6e] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#3a3a6e] inline-block" />
                舒声词汇（开音节）
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {words.open.map((w, i) => <WordCard key={i} word={w} />)}
              </div>
            </div>
          )}
          {hasChecked && (
            <div className="mt-4">
              <h4 className="text-sm font-semibold text-[#3a3a6e] mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
                促声词汇（闭音节）
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {words.checked.map((w, i) => <WordCard key={i} word={w} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FieldData() {
  const toneOrder = ["55", "35", "11", "323", "13", "31", "53", "453", "33"];
  const grouped = groupByTone(fieldWordList);

  return (
    <div className="min-h-screen bg-[#f8f6f2]">
      <Navbar />

      {/* 页面标题 */}
      <div className="bg-gradient-to-br from-[#3a3a6e] to-[#5a5a9e] text-white py-14 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mic size={28} className="text-pink-300" />
            <h1 className="text-3xl font-bold tracking-wide" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              田野调查 · 真实发音
            </h1>
          </div>
          <p className="text-blue-200 text-lg mb-6">
            来自贵州榕江三宝侗寨的真实录音数据
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <BookOpen size={16} className="text-pink-300" />
              <span>发音人：陆慧丹（29岁，女，5村）</span>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Volume2 size={16} className="text-pink-300" />
              <span>9个声调 · 16个音频文件</span>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <Info size={16} className="text-pink-300" />
              <span>{fieldWordList.length} 个调查词汇</span>
            </div>
          </div>
        </div>
      </div>

      {/* 说明卡片 */}
      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Info size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-1">关于这些录音</h3>
              <p className="text-amber-700 text-sm leading-relaxed">
                每个音频文件包含该声调下<strong>多个词汇的连续发音示例</strong>，
                并非单个词汇的独立录音。点击展开各声调卡片，可播放对应声调的真实录音，
                并查看该声调下所有调查词汇的侗语拼写、IPA音标和汉语释义。
                舒声（开音节）和促声（闭音节）分别有独立的音频文件。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 声调列表 */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-xl font-bold text-[#3a3a6e]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            九声调发音示例
          </h2>
          <span className="text-sm text-gray-400">点击声调卡片展开播放</span>
        </div>
        <div className="space-y-3">
          {toneOrder.map(tone => (
            grouped[tone] ? (
              <ToneSection key={tone} tone={tone} words={grouped[tone]} />
            ) : null
          ))}
        </div>
      </div>

      {/* 声调系统说明 */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white/80 rounded-2xl border border-[#3a3a6e]/10 p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#3a3a6e] mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            侗语声调系统说明
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="bg-[#f8f6f2] rounded-xl p-4">
              <h4 className="font-semibold text-[#3a3a6e] mb-2">五度标记法</h4>
              <p className="text-gray-600 leading-relaxed">
                用1-5的数字表示音高，1最低，5最高。
                如"55"表示高平调（从5到5保持不变），
                "35"表示中升调（从3升到5）。
              </p>
            </div>
            <div className="bg-[#f8f6f2] rounded-xl p-4">
              <h4 className="font-semibold text-[#3a3a6e] mb-2">舒声与促声</h4>
              <p className="text-gray-600 leading-relaxed">
                <strong>舒声</strong>（开音节）：以元音或鼻音结尾，发音较长。<br />
                <strong>促声</strong>（闭音节）：以塞音p/t/k结尾，发音短促有力。
              </p>
            </div>
            <div className="bg-[#f8f6f2] rounded-xl p-4">
              <h4 className="font-semibold text-[#3a3a6e] mb-2">IPA音标</h4>
              <p className="text-gray-600 leading-relaxed">
                国际音标（IPA）精确记录每个词汇的发音，
                上标数字表示声调（如⁵⁵=高平调），
                特殊符号表示侗语特有的辅音和元音。
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
