/*
 * 侗语学习页面
 * 按声调分类（55/35/11/323/13/31/53/453/33）展示词汇
 * 发音使用田野调查真实录音（杨艳杰，40岁女，9村，榕江二中）
 */
import { useState, useRef, useEffect } from "react";
import { Volume2, Play, Pause, ChevronDown, ChevronUp, Mic, Music, BookOpen, Info } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import {
  DONG_TONE_GROUPS,
  TONE_COLORS,
  TONE_NAMES,
  playToneWord,
  stopCurrentAudio,
  type ToneWord,
  type ToneGroup,
} from "@/lib/dongToneData";

// ===== 声调曲线SVG（小型，用于卡片标题） =====
function MiniToneCurve({ contour, color }: { contour: number[]; color: string }) {
  const W = 72, H = 36, PAD = 6;
  const points = contour.map((v, i) => {
    const x = PAD + (i / Math.max(contour.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} className="flex-shrink-0">
      {[1, 2, 3, 4, 5].map(level => {
        const y = H - PAD - ((level - 1) / 4) * (H - PAD * 2);
        return (
          <line key={level} x1={PAD} y1={y} x2={W - PAD} y2={y}
            stroke="rgba(255,255,255,0.2)" strokeWidth="0.5" strokeDasharray="2,2" />
        );
      })}
      <polyline points={points.join(" ")} fill="none" stroke="white" strokeWidth="2.5"
        strokeLinecap="round" strokeLinejoin="round" />
      {contour.map((v, i) => {
        const x = PAD + (i / Math.max(contour.length - 1, 1)) * (W - PAD * 2);
        const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill="white" />;
      })}
    </svg>
  );
}

// ===== 单词发音卡片 =====
function WordCard({
  word,
  isPlaying,
  onPlay,
}: {
  word: ToneWord;
  isPlaying: boolean;
  onPlay: () => void;
}) {
  const color = TONE_COLORS[word.toneCode] || "#3a3a6e";

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer select-none
        ${isPlaying
          ? "border-dong-indigo shadow-lg scale-[1.03]"
          : "border-dong-indigo/10 hover:border-dong-indigo/40 hover:shadow-md"
        }`}
      onClick={onPlay}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-dong-indigo font-mono truncate leading-tight">
              {word.dong}
            </div>
            <div className="text-xs text-dong-light font-mono mt-0.5 truncate">{word.ipa}</div>
          </div>
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all
              ${isPlaying ? "bg-dong-indigo text-white" : "bg-dong-cream text-dong-indigo"}`}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </div>
        </div>
        <div className="text-sm text-dong-dark bg-dong-cream/60 rounded-lg px-3 py-1.5 leading-snug">
          {word.chinese}
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: color + "22", color }}
          >
            {word.toneCode}调
          </span>
          <span
            className={`text-xs px-1.5 py-0.5 rounded-full font-medium
              ${word.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}
          >
            {word.syllableType}声
          </span>
        </div>
      </div>
      {isPlaying && (
        <div className="h-1 bg-gradient-to-r from-dong-indigo to-dong-rose animate-pulse" />
      )}
    </div>
  );
}

// ===== 声调组卡片 =====
function ToneGroupCard({ group }: { group: ToneGroup }) {
  const [expanded, setExpanded] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const color = group.color;

  function playWord(word: ToneWord) {
    if (playingId === word.id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }
    setPlayingId(word.id);
    playToneWord(word.audioPath, () => setPlayingId(null));
  }

  // 点击声调卡片标题时播放第一个词
  function handleHeaderClick() {
    if (!expanded) {
      setExpanded(true);
    } else {
      setExpanded(false);
      stopCurrentAudio();
      setPlayingId(null);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-dong-indigo/10 shadow-sm overflow-hidden">
      {/* 卡片标题 */}
      <button
        onClick={handleHeaderClick}
        className="w-full text-left"
      >
        <div
          className="p-5 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${color}ee, ${color}99)` }}
        >
          {/* 声调数字 */}
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold font-mono shadow-inner">
            {group.toneCode}
          </div>

          {/* 声调信息 */}
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg font-bold">{group.name}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium bg-white/20
                  ${group.syllableType === "舒" ? "text-blue-100" : "text-orange-100"}`}
              >
                {group.syllableType}声 · {group.syllableType === "舒" ? "开音节" : "闭音节"}
              </span>
            </div>
            <p className="text-sm text-white/80 line-clamp-1">{group.description}</p>
            <p className="text-xs text-white/60 mt-0.5">
              {group.words.length} 个例词 · 点击展开播放真实录音
            </p>
          </div>

          {/* 声调曲线 */}
          <div className="flex-shrink-0 hidden sm:block">
            <MiniToneCurve contour={group.contour} color={color} />
          </div>

          {/* 展开/收起图标 */}
          <div className="flex-shrink-0 text-white/80">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {/* 展开内容 */}
      {expanded && (
        <div className="border-t border-dong-indigo/10 p-5">
          {/* 声调说明 */}
          <div className="mb-5 rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: color + "11" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-dong-indigo">声调走势</span>
                <span className="text-xs text-dong-light">五度标记法</span>
              </div>
              <p className="text-xs text-dong-light">{group.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-dong-light">
                <span>
                  声调值：
                  <strong className="font-mono" style={{ color }}>{group.contour.join("-")}</strong>
                </span>
                <span>·</span>
                <span>音节类型：<strong>{group.syllableType}声</strong></span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg width={80} height={40} viewBox="0 0 80 40">
                {[1, 2, 3, 4, 5].map(level => {
                  const y = 34 - ((level - 1) / 4) * 28;
                  return (
                    <line key={level} x1={6} y1={y} x2={74} y2={y}
                      stroke={color + "33"} strokeWidth="0.5" strokeDasharray="2,2" />
                  );
                })}
                <polyline
                  points={group.contour.map((v, i) => {
                    const x = 6 + (i / Math.max(group.contour.length - 1, 1)) * 68;
                    const y = 34 - ((v - 1) / 4) * 28;
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none" stroke={color} strokeWidth="2.5"
                  strokeLinecap="round" strokeLinejoin="round"
                />
                {group.contour.map((v, i) => {
                  const x = 6 + (i / Math.max(group.contour.length - 1, 1)) * 68;
                  const y = 34 - ((v - 1) / 4) * 28;
                  return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
                })}
              </svg>
            </div>
          </div>

          {/* 词汇网格 */}
          <h4 className="text-sm font-semibold text-dong-indigo mb-3 flex items-center gap-2">
            <Music size={14} />
            真实发音例词
            <span className="text-xs font-normal text-dong-light">点击卡片播放</span>
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

// ===== 声调介绍卡片 =====
function ToneIntroCard() {
  return (
    <div className="bg-white rounded-2xl border border-dong-indigo/10 shadow-sm p-6 mb-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-dong-indigo/10 flex items-center justify-center flex-shrink-0">
          <Info size={20} className="text-dong-indigo" />
        </div>
        <div>
          <h3 className="font-bold text-dong-indigo text-lg">侗语声调系统</h3>
          <p className="text-xs text-dong-light mt-0.5">南部侗语 · 贵州榕江三宝侗寨方言</p>
        </div>
      </div>
      <p className="text-sm text-dong-dark leading-relaxed mb-3">
        侗语属于汉藏语系壮侗语族，南部侗语共有 <strong>9 个声调</strong>，分为<strong>舒声</strong>和<strong>促声</strong>两大类。
        声调是侗语的核心特征，同一音节不同声调可表达完全不同的意思。
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
        <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
          <h4 className="font-semibold text-blue-700 text-sm mb-1">舒声（开音节）</h4>
          <p className="text-xs text-blue-600 leading-relaxed">
            音节以元音或鼻音结尾，发音可以延长。共 9 个声调：55、35、11、323、13、31、53、453、33。
          </p>
        </div>
        <div className="bg-orange-50 rounded-xl p-3 border border-orange-100">
          <h4 className="font-semibold text-orange-700 text-sm mb-1">促声（闭音节）</h4>
          <p className="text-xs text-orange-600 leading-relaxed">
            音节以塞音（-p/-t/-k）结尾，发音短促有力。共 6 个声调：55、35、11、323、13、31。
          </p>
        </div>
      </div>
      <div className="bg-dong-cream/60 rounded-xl p-3">
        <p className="text-xs text-dong-light">
          <strong className="text-dong-indigo">五度标记法：</strong>
          用数字 1-5 表示音高，5 为最高音，1 为最低音。
          例如"55"表示高平调（音高从5到5），"35"表示中升调（从3升到5）。
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 text-xs text-dong-light">
        <Mic size={12} />
        <span>本页所有发音均来自田野调查真实录音 · 发音人：杨艳杰，40岁，女，9村，榕江二中</span>
      </div>
    </div>
  );
}

// ===== 主页面 =====
export default function DongLearn() {
  const [activeTab, setActiveTab] = useState<"intro" | "open" | "closed">("open");

  const openGroups = DONG_TONE_GROUPS.filter(g => g.syllableType === "舒");
  const closedGroups = DONG_TONE_GROUPS.filter(g => g.syllableType === "促");
  const totalWords = DONG_TONE_GROUPS.reduce((s, g) => s + g.words.length, 0);

  // 切换标签时停止播放
  useEffect(() => {
    stopCurrentAudio();
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* 页面标题 */}
      <div className="bg-gradient-to-br from-dong-indigo to-dong-deep text-white py-10">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={26} className="text-dong-rose/80" />
            <h1 className="text-2xl font-serif font-bold">侗语学习</h1>
          </div>
          <p className="text-white/70 text-sm max-w-xl">
            按声调分类系统学习侗语词汇，每个词汇均配有田野调查真实录音
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Mic size={11} />发音人：杨艳杰</span>
            <span>·</span>
            <span>40岁 · 女 · 9村 · 榕江二中</span>
            <span>·</span>
            <span className="flex items-center gap-1"><Volume2 size={11} />{totalWords} 个独立词汇录音</span>
          </div>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-dong-indigo/10 sticky top-16 z-10">
        <div className="max-w-[1100px] mx-auto px-4 flex gap-0">
          {[
            { key: "intro", label: "声调介绍", icon: <Info size={14} /> },
            { key: "open", label: `舒声调（${openGroups.length}组）`, icon: <Music size={14} /> },
            { key: "closed", label: `促声调（${closedGroups.length}组）`, icon: <Music size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab.key
                  ? "border-dong-indigo text-dong-indigo"
                  : "border-transparent text-dong-light hover:text-dong-indigo"
                }`}
            >
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容区 */}
      <main className="flex-1 max-w-[1100px] mx-auto px-4 py-8 w-full">

        {/* 声调介绍 */}
        {activeTab === "intro" && (
          <div className="space-y-4">
            <ToneIntroCard />
            {/* 声调总览网格 */}
            <div className="bg-white rounded-2xl border border-dong-indigo/10 shadow-sm p-6">
              <h3 className="font-bold text-dong-indigo mb-4">声调总览</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(TONE_NAMES).map(([code, name]) => {
                  const color = TONE_COLORS[code];
                  return (
                    <div
                      key={code}
                      className="rounded-xl p-3 text-center border-2 cursor-pointer transition-all hover:scale-105"
                      style={{ borderColor: color + "44", backgroundColor: color + "11" }}
                      onClick={() => setActiveTab(["55", "35", "11", "323", "13", "31", "53", "453", "33"].includes(code) ? "open" : "closed")}
                    >
                      <div className="text-2xl font-bold font-mono mb-1" style={{ color }}>{code}</div>
                      <div className="text-xs font-medium text-dong-indigo">{name}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* 舒声调 */}
        {activeTab === "open" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-dong-light">共 {openGroups.length} 个声调组 · {openGroups.reduce((s, g) => s + g.words.length, 0)} 个例词</span>
            </div>
            {openGroups.map(group => (
              <ToneGroupCard key={`${group.toneCode}-${group.syllableType}`} group={group} />
            ))}
          </div>
        )}

        {/* 促声调 */}
        {activeTab === "closed" && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-dong-light">共 {closedGroups.length} 个声调组 · {closedGroups.reduce((s, g) => s + g.words.length, 0)} 个例词</span>
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
