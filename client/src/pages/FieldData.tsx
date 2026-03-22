/*
 * 侗语音系介绍页面
 * 系统介绍南部侗语的声调体系、声母韵母、音节结构
 * 配有田野调查真实录音示例
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
import { Volume2, Play, Pause, ChevronDown, ChevronUp, BookOpen, Music, Info, Mic, Waves, Globe } from "lucide-react";

// 声调曲线SVG
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
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    if (playingId === word.id) { setPlayingId(null); return; }
    const audio = new Audio(word.audioUrl);
    audioRef.current = audio;
    setPlayingId(word.id);
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
    audio.onerror = () => setPlayingId(null);
  }

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
            <span className="text-lg font-bold text-[#3a3a6e]">{toneNames[group.toneCode] || group.toneCode + "调"}</span>
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
          <h4 className="text-sm font-semibold text-[#3a3a6e] mb-3 flex items-center gap-2">
            <Music size={14} />真实发音例词
            <span className="text-xs font-normal text-[#9d9d9d]">点击卡片播放</span>
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {group.words.map(word => (
              <WordCard key={word.id} word={word} isPlaying={playingId === word.id} onPlay={() => playWord(word)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FieldData() {
  const [activeTab, setActiveTab] = useState<"overview" | "tones" | "phonology" | "open" | "closed">("overview");
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
            <Globe size={28} className="text-[#e8c4c0]" />
            <h1 className="text-3xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              侗语音系介绍
            </h1>
          </div>
          <p className="text-[#c8bfd8] text-lg max-w-2xl">
            南部侗语语音系统 · 声调、声母、韵母与音节结构全面解析
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-4 text-sm text-[#b0a8c0]">
            <span className="flex items-center gap-1"><Mic size={13} />田野录音：杨艳杰，40岁，女，9村，榕江二中</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Volume2 size={13} />{totalWords} 个独立词汇录音</span>
          </div>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-[#e8e0d5] sticky top-16 z-10">
        <div className="max-w-6xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {[
            { key: "overview", label: "语言概况", icon: <Globe size={14} /> },
            { key: "tones", label: "声调系统", icon: <Waves size={14} /> },
            { key: "phonology", label: "声韵母", icon: <BookOpen size={14} /> },
            { key: "open", label: `舒声调（${openGroups.length}组）`, icon: <Music size={14} /> },
            { key: "closed", label: `促声调（${closedGroups.length}组）`, icon: <Music size={14} /> },
          ].map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                ${activeTab === tab.key
                  ? "border-[#3a3a6e] text-[#3a3a6e]"
                  : "border-transparent text-[#6d6875] hover:text-[#3a3a6e]"}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 max-w-6xl mx-auto px-4 py-8 w-full">

        {/* 语言概况 */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#3a3a6e]/10 flex items-center justify-center flex-shrink-0">
                  <Info size={20} className="text-[#3a3a6e]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#3a3a6e]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    侗语基本概况
                  </h2>
                  <p className="text-sm text-[#9d9d9d] mt-0.5">南部侗语 · 贵州榕江三宝侗寨方言</p>
                </div>
              </div>
              <p className="text-[#4a4a4a] leading-relaxed mb-4">
                侗语（Gaeml）属于汉藏语系壮侗语族侗水语支，主要分布于贵州、湖南、广西三省区交界地带。
                侗语分南北两大方言区，本平台所呈现的语料以<strong>南部侗语贵州榕江三宝方言</strong>为基础，
                该方言保留了侗语最为完整的声调系统与音节结构特征。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "语系", value: "汉藏语系" },
                  { label: "语族", value: "壮侗语族" },
                  { label: "声调数量", value: "15个（舒9促6）" },
                  { label: "使用人口", value: "约150万" },
                ].map(item => (
                  <div key={item.label} className="bg-[#f8f6f2] rounded-xl p-3 text-center">
                    <p className="text-xs text-[#9d9d9d] mb-1">{item.label}</p>
                    <p className="font-bold text-[#3a3a6e] text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 音节结构 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                音节结构
              </h3>
              <p className="text-[#4a4a4a] leading-relaxed mb-4">
                侗语音节结构为 <strong className="font-mono text-[#3a3a6e]">（声母）+ 韵母 + 声调</strong>，
                韵母可以是单元音、复元音或带鼻音/塞音韵尾的音节。
                侗语允许音节以辅音开头（包括复辅音），也允许零声母音节。
              </p>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-700 text-sm mb-2">开音节（舒声）</h4>
                  <p className="text-xs text-blue-600 leading-relaxed">
                    音节以元音或鼻音（-m, -n, -ng）结尾，发音可以延长，共对应9个声调。
                  </p>
                  <div className="mt-2 font-mono text-xs text-blue-700 bg-white rounded-lg px-2 py-1">
                    例：laml（鱼）、sanl（三）
                  </div>
                </div>
                <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                  <h4 className="font-semibold text-orange-700 text-sm mb-2">闭音节（促声）</h4>
                  <p className="text-xs text-orange-600 leading-relaxed">
                    音节以塞音（-p, -t, -k）结尾，发音短促有力，共对应6个声调。
                  </p>
                  <div className="mt-2 font-mono text-xs text-orange-700 bg-white rounded-lg px-2 py-1">
                    例：jat（一）、nyak（咬）
                  </div>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h4 className="font-semibold text-purple-700 text-sm mb-2">复辅音声母</h4>
                  <p className="text-xs text-purple-600 leading-relaxed">
                    侗语保留了丰富的复辅音声母，如 bl-, gl-, kl-, pl- 等，是其重要特征之一。
                  </p>
                  <div className="mt-2 font-mono text-xs text-purple-700 bg-white rounded-lg px-2 py-1">
                    例：bleml（花）、glaengl（村寨）
                  </div>
                </div>
              </div>
            </div>

            {/* 与普通话对比 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                侗语与普通话音系对比
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#f8f6f2]">
                      <th className="text-left px-4 py-2 text-[#3a3a6e] font-semibold rounded-tl-lg">特征</th>
                      <th className="text-left px-4 py-2 text-[#3a3a6e] font-semibold">南部侗语</th>
                      <th className="text-left px-4 py-2 text-[#3a3a6e] font-semibold rounded-tr-lg">普通话</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8e0d5]">
                    {[
                      ["声调数量", "15个（舒声9 + 促声6）", "4个（+轻声）"],
                      ["复辅音声母", "有（bl-, gl-, kl-等）", "无"],
                      ["塞音韵尾", "有（-p, -t, -k）", "无"],
                      ["鼻音韵尾", "有（-m, -n, -ng）", "有（-n, -ng）"],
                      ["清浊对立", "有（b/p, d/t, g/k）", "无（仅送气/不送气）"],
                      ["翘舌音", "无", "有（zh, ch, sh, r）"],
                    ].map(([feat, dong, mandarin]) => (
                      <tr key={feat} className="hover:bg-[#faf8f5]">
                        <td className="px-4 py-2.5 font-medium text-[#4a4a4a]">{feat}</td>
                        <td className="px-4 py-2.5 text-[#3a3a6e]">{dong}</td>
                        <td className="px-4 py-2.5 text-[#6d6875]">{mandarin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 声调系统 */}
        {activeTab === "tones" && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[#3a3a6e] mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                {DONG_TONE_INTRO.title}
              </h2>
              <p className="text-sm text-[#9d9d9d] mb-4">{DONG_TONE_INTRO.subtitle}</p>
              <p className="text-[#4a4a4a] leading-relaxed">{DONG_TONE_INTRO.overview}</p>
              <div className="mt-4 p-4 bg-[#f8f6f2] rounded-xl">
                <p className="text-sm text-[#4a4a4a] leading-relaxed">{DONG_TONE_INTRO.toneSystem}</p>
              </div>
            </div>

            {/* 五度标记法说明 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                五度标记法
              </h3>
              <p className="text-[#4a4a4a] leading-relaxed mb-4">
                五度标记法用数字 1-5 表示音高，5 为最高音，1 为最低音。
                侗语声调用两到三位数字表示声调的起止高度及走势。
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { code: "55", name: "高平调", desc: "高而平稳，不升不降" },
                  { code: "35", name: "中升调", desc: "从中音升至高音" },
                  { code: "11", name: "低平调", desc: "低而平稳" },
                  { code: "323", name: "曲折调", desc: "先降后升的曲折调" },
                  { code: "13", name: "低升调", desc: "从低音升至中音" },
                  { code: "31", name: "中降调", desc: "从中音降至低音" },
                  { code: "53", name: "高降调", desc: "从高音降至中音" },
                  { code: "453", name: "升降调", desc: "先升后降的复合调" },
                  { code: "33", name: "中平调", desc: "中音平稳" },
                ].map(item => {
                  const color = TONE_COLORS[item.code] || "#3a3a6e";
                  const group = FIELD_TONE_GROUPS.find(g => g.toneCode === item.code && g.syllableType === "舒");
                  return (
                    <div key={item.code} className="bg-[#f8f6f2] rounded-xl p-4 border border-[#e8e0d5]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xl font-bold font-mono" style={{ color }}>{item.code}</span>
                        <span className="text-sm font-medium text-[#3a3a6e]">{item.name}</span>
                      </div>
                      <p className="text-xs text-[#6d6875] mb-2">{item.desc}</p>
                      {group && <MiniToneCurve contour={group.contour} color={color} />}
                    </div>
                  );
                })}
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

            {/* 录音说明 */}
            <div className="bg-[#3a3a6e]/5 rounded-2xl border border-[#3a3a6e]/20 p-5">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[#3a3a6e] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#3a3a6e] mb-2">田野录音说明</h3>
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

        {/* 声韵母 */}
        {activeTab === "phonology" && (
          <div className="space-y-6">
            {/* 声母 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                声母系统
              </h3>
              <p className="text-[#4a4a4a] leading-relaxed mb-4">
                南部侗语声母系统丰富，包含单辅音声母和复辅音声母两类。
                清浊对立是侗语声母的重要特征，即同一发音部位有清音和浊音的对立（如 b/p, d/t, g/k）。
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#3a3a6e] mb-3">单辅音声母</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["b", "p", "m", "v", "d", "t", "n", "l", "g", "k", "ng", "h", "j", "ny", "x", "y", "w", "ʔ"].map(c => (
                      <div key={c} className="bg-[#f8f6f2] rounded-lg p-2 text-center border border-[#e8e0d5]">
                        <span className="font-mono text-sm font-bold text-[#3a3a6e]">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3a3a6e] mb-3">复辅音声母</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {["bl", "pl", "ml", "gl", "kl", "ngl", "hl", "br", "pr", "gr", "kr", "hm", "hn", "hng"].map(c => (
                      <div key={c} className="bg-purple-50 rounded-lg p-2 text-center border border-purple-100">
                        <span className="font-mono text-sm font-bold text-purple-700">{c}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#6d6875] mt-2">复辅音是侗语区别于普通话的重要特征</p>
                </div>
              </div>
            </div>

            {/* 韵母 */}
            <div className="bg-white rounded-2xl border border-[#e8e0d5] p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[#3a3a6e] mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                韵母系统
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-[#3a3a6e] mb-2">单元音韵母</h4>
                  <div className="flex flex-wrap gap-2">
                    {["a", "e", "ε", "i", "o", "u", "ɯ", "ə"].map(v => (
                      <span key={v} className="font-mono text-sm bg-[#f8f6f2] border border-[#e8e0d5] rounded-lg px-2 py-1 text-[#3a3a6e]">{v}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3a3a6e] mb-2">鼻音韵尾</h4>
                  <div className="flex flex-wrap gap-2">
                    {["-m", "-n", "-ng"].map(v => (
                      <span key={v} className="font-mono text-sm bg-blue-50 border border-blue-100 rounded-lg px-2 py-1 text-blue-700">{v}</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#6d6875] mt-2">对应舒声（开音节）</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#3a3a6e] mb-2">塞音韵尾</h4>
                  <div className="flex flex-wrap gap-2">
                    {["-p", "-t", "-k"].map(v => (
                      <span key={v} className="font-mono text-sm bg-orange-50 border border-orange-100 rounded-lg px-2 py-1 text-orange-700">{v}</span>
                    ))}
                  </div>
                  <p className="text-xs text-[#6d6875] mt-2">对应促声（闭音节）</p>
                </div>
              </div>
            </div>

            {/* IPA对照 */}
            <div className="bg-[#3a3a6e]/5 rounded-2xl border border-[#3a3a6e]/20 p-5">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-[#3a3a6e] flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-[#3a3a6e] mb-2">国际音标（IPA）说明</h3>
                  <p className="text-sm text-[#4a4a4a] leading-relaxed">
                    本平台词汇卡片中的 IPA 标注采用国际音标体系，结合侗语拉丁字母转写方案（Gaeml 方案）。
                    IPA 标注可帮助学习者更精确地理解每个音节的发音特征，建议结合田野录音一起学习。
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
