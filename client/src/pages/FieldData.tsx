/**
 * 田野录音页面 - 按声调分类展示真实侗语单词发音
 * 发音人：杨艳杰，40岁，女，9村，榕江二中
 * 每个词汇对应独立音频片段（从田野调查录音中精确切割）
 */
import { useState, useRef } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  FIELD_TONE_GROUPS,
  DONG_TONE_INTRO,
  TONE_COLORS,
  type ToneGroup,
  type FieldWord,
} from "@/lib/fieldData";
import { Volume2, Play, Pause, ChevronDown, ChevronUp, BookOpen, Music, Info, Mic } from "lucide-react";

// 声调曲线SVG（小型，用于卡片）
function MiniToneCurve({ contour, color }: { contour: number[]; color: string }) {
  const W = 80, H = 40, PAD = 8;
  const points = contour.map((v, i) => {
    const x = PAD + (i / Math.max(contour.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[1, 2, 3, 4, 5].map(level => {
        const y = H - PAD - ((level - 1) / 4) * (H - PAD * 2);
        return <line key={level} x1={PAD} y1={y} x2={W - PAD} y2={y}
          stroke="#e0d9ce" strokeWidth="0.5" strokeDasharray="2,2" />;
      })}
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {contour.map((v, i) => {
        const x = PAD + (i / Math.max(contour.length - 1, 1)) * (W - PAD * 2);
        const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// 单词发音卡片
function WordCard({ word, isPlaying, onPlay }: {
  word: FieldWord;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const color = TONE_COLORS[word.toneCode] || "#3a3a6e";
  return (
    <div className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer
      ${isPlaying ? "border-[#3a3a6e] shadow-lg scale-[1.02]" : "border-[#e8e0d5] hover:border-[#3a3a6e]/50 hover:shadow-md"}`}
      onClick={onPlay}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-lg font-bold text-[#3a3a6e] font-mono truncate">
              {word.dong || <span className="text-[#9d9d9d] text-sm">（无拼写）</span>}
            </div>
            <div className="text-xs text-[#6d6875] font-mono mt-0.5">{word.ipa}</div>
          </div>
          <div className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all
            ${isPlaying ? "bg-[#3a3a6e] text-white" : "bg-[#f0eee8] text-[#3a3a6e]"}`}>
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </div>
        </div>
        <div className="text-sm text-[#4a4a4a] bg-[#f8f6f2] rounded-lg px-3 py-1.5 leading-snug">
          {word.chinese}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: color + "22", color }}>
            {word.toneCode}调
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
            ${word.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
            {word.syllableType}声
          </span>
        </div>
      </div>
      {isPlaying && <div className="h-1 bg-gradient-to-r from-[#3a3a6e] to-[#b5838d] animate-pulse" />}
    </div>
  );
}

// 声调组展示卡片
function ToneGroupCard({ group }: { group: ToneGroup }) {
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const color = TONE_COLORS[group.toneCode] || "#3a3a6e";

  function playWord(word: FieldWord) {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playingId === word.id) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(word.audioUrl);
    audioRef.current = audio;
    setPlayingId(word.id);
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
  }

  // 声调名称映射
  const toneNames: Record<string, string> = {
    "55": "高平调", "35": "中升调", "11": "低平调", "323": "曲折调",
    "13": "低升调", "31": "中降调", "53": "高降调", "453": "升降调", "33": "中平调",
  };

  return (
    <div className="bg-white rounded-2xl border border-[#e8e0d5] shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center gap-4 hover:bg-[#faf8f5] transition-colors text-left"
      >
        <div className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-md font-mono"
          style={{ backgroundColor: color }}>
          {group.toneCode}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-lg font-bold text-[#3a3a6e]">
              {toneNames[group.toneCode] || group.toneCode + "调"}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium
              ${group.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
              {group.syllableType}声 · {group.syllableType === "舒" ? "开音节" : "闭音节"}
            </span>
          </div>
          <p className="text-sm text-[#6d6875] line-clamp-1">{group.description}</p>
          <span className="text-xs text-[#9d9d9d] mt-0.5 block">{group.words.length} 个例词 · 点击播放真实录音</span>
        </div>
        <div className="flex-shrink-0 hidden sm:block">
          <MiniToneCurve contour={group.contour} color={color} />
        </div>
        <div className="flex-shrink-0 text-[#9d9d9d]">
          {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>

      {expanded && (
        <div className="border-t border-[#e8e0d5] p-5">
          {/* 声调说明 */}
          <div className="mb-5 bg-[#f8f6f2] rounded-xl p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-[#3a3a6e]">声调走势</span>
                <span className="text-xs text-[#9d9d9d]">五度标记法</span>
              </div>
              <p className="text-xs text-[#6d6875]">{group.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-[#9d9d9d]">
                <span>声调值：<strong className="font-mono" style={{ color }}>{group.contour.join("-")}</strong></span>
                <span>·</span>
                <span>音节类型：<strong>{group.syllableType}声</strong></span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <MiniToneCurve contour={group.contour} color={color} />
            </div>
          </div>

          {/* 词汇网格 */}
          <h4 className="text-sm font-semibold text-[#3a3a6e] mb-3 flex items-center gap-2">
            <Music size={14} />
            真实发音例词
            <span className="text-xs font-normal text-[#9d9d9d]">点击卡片播放</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {group.words.map(word => (
              <WordCard
                key={word.id}
                word={word}
                isPlaying={playingId === word.id}
                onPlay={() => playWord(word)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FieldData() {
  const [activeTab, setActiveTab] = useState<"intro" | "open" | "closed">("intro");
  const openGroups = FIELD_TONE_GROUPS.filter(g => g.syllableType === "舒");
  const closedGroups = FIELD_TONE_GROUPS.filter(g => g.syllableType === "促");
  const totalWords = FIELD_TONE_GROUPS.reduce((s, g) => s + g.words.length, 0);

  return (
    <div className="min-h-screen bg-[#f8f6f2] flex flex-col">
      <Navbar />

      {/* 页面标题 */}
      <div className="bg-gradient-to-br from-[#3a3a6e] to-[#5a4a7e] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-3">
            <Mic size={28} className="text-[#e8c4c0]" />
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              田野录音
            </h1>
          </div>
          <p className="text-[#c8bfd8] text-lg max-w-2xl">
            贵州榕江三宝侗寨真实田野调查录音 · 每个词汇独立音频
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-[#b0a8c0]">
            <span className="flex items-center gap-1"><Mic size={13} />发音人：杨艳杰</span>
            <span>·</span>
            <span>40岁 · 女 · 9村 · 榕江二中</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Volume2 size={13} />{totalWords} 个独立词汇录音</span>
          </div>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-[#e8e0d5] sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-0">
          {[
            { key: "intro", label: "声调介绍", icon: <BookOpen size={15} /> },
            { key: "open", label: `舒声调（${openGroups.length}组）`, icon: <Music size={15} /> },
            { key: "closed", label: `促声调（${closedGroups.length}组）`, icon: <Music size={15} /> },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? "border-[#3a3a6e] text-[#3a3a6e]"
                  : "border-transparent text-[#6d6875] hover:text-[#3a3a6e]"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">

        {/* 声调介绍 */}
        {activeTab === "intro" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#3a3a6e] mb-1"
                style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {DONG_TONE_INTRO.title}
              </h2>
              <p className="text-sm text-[#9d9d9d] mb-4">{DONG_TONE_INTRO.subtitle}</p>
              <p className="text-[#4a4a4a] leading-relaxed">{DONG_TONE_INTRO.overview}</p>
              <div className="mt-4 p-4 bg-[#f8f6f2] rounded-xl">
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{DONG_TONE_INTRO.toneSystem}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-5">
                <h3 className="font-bold text-blue-700 mb-2">舒声调（开音节）</h3>
                <p className="text-sm text-blue-600 leading-relaxed mb-3">
                  音节以元音或鼻音结尾，发音可延长，共9个声调。
                </p>
                <div className="flex flex-wrap gap-2">
                  {openGroups.map(g => (
                    <span key={g.toneCode} className="text-xs px-2 py-1 bg-white rounded-lg border border-blue-200 text-blue-700 font-mono font-bold">
                      {g.toneCode}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-orange-50 rounded-2xl border border-orange-100 p-5">
                <h3 className="font-bold text-orange-700 mb-2">促声调（闭音节）</h3>
                <p className="text-sm text-orange-600 leading-relaxed mb-3">
                  音节以塞音（-p/-t/-k）结尾，发音短促有力，共6个声调。
                </p>
                <div className="flex flex-wrap gap-2">
                  {closedGroups.map(g => (
                    <span key={g.toneCode} className="text-xs px-2 py-1 bg-white rounded-lg border border-orange-200 text-orange-700 font-mono font-bold">
                      {g.toneCode}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 声调总览 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-4"
                style={{ fontFamily: "'Noto Serif SC', serif" }}>
                全部声调一览
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {FIELD_TONE_GROUPS.map(group => {
                  const color = TONE_COLORS[group.toneCode] || "#3a3a6e";
                  const toneNames: Record<string, string> = {
                    "55": "高平", "35": "中升", "11": "低平", "323": "曲折",
                    "13": "低升", "31": "中降", "53": "高降", "453": "升降", "33": "中平",
                  };
                  return (
                    <div key={`${group.toneCode}-${group.syllableType}`}
                      className="bg-[#f8f6f2] rounded-xl p-3 text-center border border-[#e8e0d5]">
                      <div className="text-lg font-bold font-mono mb-0.5" style={{ color }}>
                        {group.toneCode}
                      </div>
                      <div className="text-xs text-[#6d6875] mb-2">{toneNames[group.toneCode]}</div>
                      <div className="flex justify-center mb-2">
                        <MiniToneCurve contour={group.contour} color={color} />
                      </div>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full
                        ${group.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                        {group.syllableType}声
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 录音说明 */}
            <div className="bg-[#3a3a6e]/5 rounded-2xl border border-[#3a3a6e]/20 p-5">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[#3a3a6e] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#3a3a6e] mb-2">录音说明</h3>
                  <p className="text-sm text-[#4a4a4a] leading-relaxed">{DONG_TONE_INTRO.speakerInfo}</p>
                  <p className="text-sm text-[#6d6875] mt-2">
                    每个词汇均为独立音频片段，从田野调查原始录音中通过静音检测精确切割。
                    点击"舒声调"或"促声调"标签，展开声调卡片，点击词汇卡片即可收听真实发音。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 舒声调 */}
        {activeTab === "open" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#3a3a6e]">舒声调词汇</h2>
              <span className="text-sm text-[#9d9d9d]">共 {openGroups.reduce((s, g) => s + g.words.length, 0)} 个例词</span>
            </div>
            {openGroups.map(group => (
              <ToneGroupCard key={`${group.toneCode}-${group.syllableType}`} group={group} />
            ))}
          </div>
        )}

        {/* 促声调 */}
        {activeTab === "closed" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-[#3a3a6e]">促声调词汇</h2>
              <span className="text-sm text-[#9d9d9d]">共 {closedGroups.reduce((s, g) => s + g.words.length, 0)} 个例词</span>
            </div>
            {closedGroups.map(group => (
              <ToneGroupCard key={`${group.toneCode}-${group.syllableType}`} group={group} />
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
