/**
 * 声调对比练习页面
 * 设计风格：青蓝雅致 - 靛蓝紫导航 + 米白宣纸质感内容区
 * 功能：最小对立词对比学习、声调曲线对比、发音对比播放、听辨测验
 */
import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ArrowLeftRight, Trophy, BookOpen, Headphones, ChevronRight, RotateCcw, CheckCircle, XCircle, Lightbulb, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToneCurve from "@/components/ToneCurve";
import { speakDong, speakChinese } from "@/lib/dongData";
import { DONG_TONE_GROUPS, playToneWord, stopCurrentAudio } from "@/lib/dongToneData";

/// ========== 声调系统说明 ==========
// 声调卡片与真实录音的映射（使用dongToneData中第一个词的音频）
// 注：ToneCompare使用旧声调值，需映射到实际音频文件名
const toneAudioMap: Record<string, string> = {
  "55": "/audio/55s_1_bal.wav",    // 高平调 55
  "35": "/audio/35s_1_taemk.wav",  // 中升调 35
  "33": "/audio/33s_1_jah.wav",    // 中平调 33
  "21": "/audio/11s_1_tang.wav",   // 低平调 11（旧标记21）
  "51": "/audio/53s_1_baenv.wav",  // 高降调 53（旧标记51）
  "13": "/audio/13s_1_thenl.wav",  // 低升调 13
  "55p": "/audio/55c_1_badl.wav",  // 高入声 55促
  "33p": "/audio/323c_1_beds.wav", // 中入声（用323促调代替）
  "11p": "/audio/11c_1_jogc.wav",  // 低入声 11促
};

const toneSystem = [
  { id: "t1", name: "高平调", value: "55", symbol: "˦", pitch: [5, 5], color: "#ef4444", desc: "声调高而平稳，从头到尾保持在最高音区", example: "bux (父亲)" },
  { id: "t2", name: "中升调", value: "35", symbol: "˧˥", pitch: [3, 5], color: "#4ade80", desc: "从中音区起，逐渐升高到高音区", example: "yangh (家)" },
  { id: "t3", name: "中平调", value: "33", symbol: "˧", pitch: [3, 3], color: "#f59e0b", desc: "声调在中间音区保持平稳", example: "hac (五)" },
  { id: "t4", name: "低调", value: "21", symbol: "˩", pitch: [2, 1], color: "#3b82f6", desc: "声调低沉，略有下降趋势", example: "bya (山)" },
  { id: "t5", name: "高降调", value: "51", symbol: "˦˩", pitch: [5, 1], color: "#f87171", desc: "从高音区急速降到低音区", example: "（较少见）" },
  { id: "t6", name: "低升调", value: "13", symbol: "˩˧", pitch: [1, 3], color: "#60a5fa", desc: "从低音区缓慢升到中音区", example: "（较少见）" },
  { id: "t7", name: "高入声", value: "55p", symbol: "˦", pitch: [5, 5], color: "#dc2626", desc: "高平调但音节短促，以p/t/k结尾", example: "logc (六)" },
  { id: "t8", name: "中入声", value: "33p", symbol: "˧", pitch: [3, 3], color: "#d97706", desc: "中平调但音节短促，以p/t/k结尾", example: "betc (八)" },
  { id: "t9", name: "低入声", value: "11p", symbol: "˩", pitch: [1, 1], color: "#2563eb", desc: "低调但音节短促，以p/t/k结尾", example: "idl (一)" },
];

// ========== 最小对立词组数据 ==========
// 同一基础音节，不同声调产生不同词义
interface MinimalPair {
  id: string;
  baseSyllable: string; // 基础音节（不含声调）
  group: string; // 分组名
  pairs: {
    dong: string;
    dongPinyin: string;
    chinese: string;
    toneLabel: string;
    toneColor: string;
  }[];
  explanation: string;
}

const minimalPairs: MinimalPair[] = [
  {
    id: "mp01",
    baseSyllable: "ma",
    group: "ma 组",
    pairs: [
      { dong: "max", dongPinyin: "ma˦", chinese: "母亲", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "mac", dongPinyin: "ma˧", chinese: "马", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "mal", dongPinyin: "ma˩", chinese: "麻", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "\"ma\" 这个音节在不同声调下表示完全不同的意思。高平调 ma˦ 表示\"母亲\"，中平调 ma˧ 表示\"马\"，低调 ma˩ 表示\"麻\"。声调的高低直接决定了词义，这是侗语声调系统最核心的特征。",
  },
  {
    id: "mp02",
    baseSyllable: "ba/pa",
    group: "ba/pa 组",
    pairs: [
      { dong: "bax", dongPinyin: "pa˦", chinese: "花 / 鱼", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "bac", dongPinyin: "pa˧", chinese: "叶子", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "bal", dongPinyin: "pa˩", chinese: "背（动词）", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "侗语中 \"ba/pa\" 音节的声调变化展示了声调区分词义的重要性。高平调表示\"花\"或\"鱼\"，中平调表示\"叶子\"，低调表示\"背\"这个动作。学习者需要特别注意高平调和中平调的区别。",
  },
  {
    id: "mp03",
    baseSyllable: "na",
    group: "na 组",
    pairs: [
      { dong: "nax", dongPinyin: "na˦", chinese: "厚", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "nac", dongPinyin: "na˧", chinese: "田（水田）", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "nal", dongPinyin: "na˩", chinese: "脸", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "\"na\" 组展示了侗语三个主要平调的对比。高平调 na˦ 表示\"厚\"，中平调 na˧ 表示\"水田\"，低调 na˩ 表示\"脸\"。这三个声调的音高差异是侗语学习的基础。",
  },
  {
    id: "mp04",
    baseSyllable: "mu",
    group: "mu 组",
    pairs: [
      { dong: "mux", dongPinyin: "mu˦", chinese: "手", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "muc", dongPinyin: "mu˧", chinese: "猪", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "mul", dongPinyin: "mu˩", chinese: "毛（头发）", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "\"mu\" 组是日常用词中声调对比的典型例子。\"手\"(mu˦)、\"猪\"(mu˧)、\"毛/头发\"(mu˩) 三个词仅靠声调区分。初学者常将高平调和中平调混淆，需要反复练习。",
  },
  {
    id: "mp05",
    baseSyllable: "lai/lau",
    group: "lau 组",
    pairs: [
      { dong: "laox", dongPinyin: "lau˦", chinese: "好 / 老", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "laoc", dongPinyin: "lau˧", chinese: "来", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "laol", dongPinyin: "lau˩", chinese: "六（古语）", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "\"lau\" 是侗语中使用频率极高的音节。lau˦ 表示\"好\"或\"老\"（如 mii laox = 你好），lau˧ 表示\"来\"，lau˩ 在古语中表示\"六\"。掌握这组对比对日常交流至关重要。",
  },
  {
    id: "mp06",
    baseSyllable: "入声对比",
    group: "入声 vs 舒声",
    pairs: [
      { dong: "sibc", dongPinyin: "sip˧", chinese: "十", toneLabel: "中入声（短促）", toneColor: "#d97706" },
      { dong: "siml", dongPinyin: "sim˩", chinese: "心", toneLabel: "低调（舒声）", toneColor: "#3b82f6" },
      { dong: "siik", dongPinyin: "si:k˧", chinese: "谢（感谢）", toneLabel: "中入声（长元音）", toneColor: "#d97706" },
    ],
    explanation: "入声是侗语声调系统的重要特征。入声字以塞音 p/t/k 结尾，发音短促有力。\"十\"(sip˧) 以 -p 结尾，是典型的中入声；\"心\"(sim˩) 以 -m 结尾，是低调舒声。入声和舒声的区分是侗语学习的难点之一。",
  },
  {
    id: "mp07",
    baseSyllable: "ga/ka",
    group: "ga 组",
    pairs: [
      { dong: "gal", dongPinyin: "ka˩", chinese: "歌", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
      { dong: "gax", dongPinyin: "ka˦", chinese: "咬", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "gac", dongPinyin: "ka˧", chinese: "价（价格）", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
    ],
    explanation: "\"ga/ka\" 组中，低调 ka˩ 表示\"歌\"（如 al gal = 唱歌），高平调 ka˦ 表示\"咬\"，中平调 ka˧ 表示\"价格\"。注意侗语中 g 和 k 的区分与声调密切相关。",
  },
  {
    id: "mp08",
    baseSyllable: "bu/pu",
    group: "bu/pu 组",
    pairs: [
      { dong: "bux", dongPinyin: "pu˦", chinese: "父亲 / 布", toneLabel: "高平调 ˦", toneColor: "#ef4444" },
      { dong: "buc", dongPinyin: "pu˧", chinese: "不", toneLabel: "中平调 ˧", toneColor: "#f59e0b" },
      { dong: "bul", dongPinyin: "pu˩", chinese: "飞", toneLabel: "低调 ˩", toneColor: "#3b82f6" },
    ],
    explanation: "\"bu/pu\" 组展示了声调在日常高频词中的区分作用。pu˦ 可以表示\"父亲\"或\"布\"（需根据上下文判断），pu˧ 表示否定词\"不\"，pu˩ 表示\"飞\"。这组词在日常对话中使用频率极高。",
  },
];

// ========== 听辨测验题目 ==========
interface QuizQuestion {
  id: string;
  pairId: string; // 对应的最小对立词组
  targetIndex: number; // 正确答案在pairs中的索引
  questionText: string;
}

function generateQuiz(pairs: MinimalPair[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  pairs.forEach(pair => {
    pair.pairs.forEach((p, idx) => {
      questions.push({
        id: `q_${pair.id}_${idx}`,
        pairId: pair.id,
        targetIndex: idx,
        questionText: `听发音，选择正确的含义：「${p.dong}」(${p.dongPinyin})`,
      });
    });
  });
  // 随机排序
  return questions.sort(() => Math.random() - 0.5);
}

// ========== 页面组件 ==========
type TabType = "learn" | "tones" | "quiz";

export default function ToneCompare() {
  const [activeTab, setActiveTab] = useState<TabType>("learn");
  const [selectedPair, setSelectedPair] = useState<MinimalPair>(minimalPairs[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 测验状态
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handlePlayDong = useCallback((dong: string, pinyin: string, id: string) => {
    setPlayingId(id);
    speakDong(dong, pinyin);
    setTimeout(() => setPlayingId(null), 1500);
  }, []);

  // 播放声调卡片真实录音
  const handlePlayToneCard = useCallback((toneValue: string, id: string) => {
    if (playingId === id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }
    const audioPath = toneAudioMap[toneValue];
    if (audioPath) {
      setPlayingId(id);
      playToneWord(audioPath, () => setPlayingId(null));
    }
  }, [playingId]);

  const handlePlayChinese = useCallback((text: string, id: string) => {
    setPlayingId(id);
    speakChinese(text);
    setTimeout(() => setPlayingId(null), 1200);
  }, []);

  const startQuiz = useCallback(() => {
    const questions = generateQuiz(minimalPairs).slice(0, 10);
    setQuizQuestions(questions);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectCount(0);
    setQuizFinished(false);
    setQuizStarted(true);
  }, []);

  const handleQuizAnswer = useCallback((answerIdx: number) => {
    if (showResult) return;
    setSelectedAnswer(answerIdx);
    setShowResult(true);
    if (answerIdx === quizQuestions[currentQ].targetIndex) {
      setCorrectCount(prev => prev + 1);
    }
  }, [showResult, quizQuestions, currentQ]);

  const nextQuestion = useCallback(() => {
    if (currentQ + 1 >= quizQuestions.length) {
      setQuizFinished(true);
    } else {
      setCurrentQ(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentQ, quizQuestions.length]);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "learn", label: "对比学习", icon: <BookOpen className="w-4 h-4" /> },
    { id: "tones", label: "声调总览", icon: <Music className="w-4 h-4" /> },
    { id: "quiz", label: "听辨测验", icon: <Headphones className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f2" }}>
      <Navbar />

      {/* Hero区域 */}
      <section className="relative pt-24 pb-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #3a3a6e 0%, #4a4a8e 50%, #5a5aae 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl text-white/20 font-serif">声</div>
          <div className="absolute top-12 right-12 text-5xl text-white/15 font-serif">调</div>
          <div className="absolute bottom-8 left-1/4 text-4xl text-white/10 font-serif">韵</div>
          <div className="absolute bottom-4 right-1/3 text-7xl text-white/8 font-serif">律</div>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              声调对比练习
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto">
              侗语有9个声调，同一音节不同声调表示完全不同的词义。通过最小对立词对比，掌握声调的精妙差异。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 标签切换 */}
      <div className="sticky top-[68px] z-30 border-b" style={{ backgroundColor: "#f8f6f2", borderColor: "rgba(58,58,110,0.1)" }}>
        <div className="container">
          <div className="flex gap-1 py-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? "text-white shadow-md"
                    : "text-[#3a3a6e]/70 hover:bg-[#3a3a6e]/5"
                }`}
                style={activeTab === tab.id ? { backgroundColor: "#3a3a6e" } : {}}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="flex-1 container py-8">
        <AnimatePresence mode="wait">
          {/* ========== 对比学习 ========== */}
          {activeTab === "learn" && (
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* 左侧：词组列表 */}
                <div className="lg:col-span-1">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "#3a3a6e" }}>最小对立词组</h3>
                  <div className="space-y-2">
                    {minimalPairs.map(pair => (
                      <button
                        key={pair.id}
                        onClick={() => setSelectedPair(pair)}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                          selectedPair.id === pair.id
                            ? "border-[#3a3a6e]/30 shadow-md"
                            : "border-transparent hover:border-[#3a3a6e]/10 hover:shadow-sm"
                        }`}
                        style={{
                          backgroundColor: selectedPair.id === pair.id ? "white" : "rgba(255,255,255,0.5)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm" style={{ color: "#3a3a6e" }}>{pair.group}</span>
                          <ChevronRight className={`w-4 h-4 transition-transform ${selectedPair.id === pair.id ? "rotate-90" : ""}`} style={{ color: "#3a3a6e" }} />
                        </div>
                        <div className="flex gap-1.5 mt-1.5 flex-wrap">
                          {pair.pairs.map((p, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: `${p.toneColor}15`, color: p.toneColor }}>
                              {p.chinese}
                            </span>
                          ))}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右侧：详细对比 */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedPair.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* 标题 */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#3a3a6e" }}>
                          <ArrowLeftRight className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                            {selectedPair.group} — 声调对比
                          </h2>
                          <p className="text-sm text-[#3a3a6e]/60">基础音节: {selectedPair.baseSyllable}</p>
                        </div>
                      </div>

                      {/* 对比卡片 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {selectedPair.pairs.map((pair, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-lg transition-all group"
                            style={{ borderColor: `${pair.toneColor}30` }}
                          >
                            {/* 声调标签 */}
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-xs font-medium px-3 py-1 rounded-full" style={{ backgroundColor: `${pair.toneColor}15`, color: pair.toneColor }}>
                                {pair.toneLabel}
                              </span>
                              <span className="text-lg font-mono font-bold" style={{ color: pair.toneColor }}>
                                {idx + 1}
                              </span>
                            </div>

                            {/* 中文含义 */}
                            <div className="text-center mb-4">
                              <div className="text-3xl font-bold mb-1" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                                {pair.chinese}
                              </div>
                              <div className="text-sm text-[#3a3a6e]/60 font-mono">{pair.dong}</div>
                              <div className="text-xs text-[#3a3a6e]/40 mt-1">{pair.dongPinyin}</div>
                            </div>

                            {/* 声调曲线 */}
                            <div className="flex justify-center mb-4 py-2 rounded-lg" style={{ backgroundColor: `${pair.toneColor}08` }}>
                              <ToneCurve dongPinyin={pair.dongPinyin} size="lg" animated />
                            </div>

                            {/* 发音按钮 */}
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="flex-1 text-xs"
                                style={{ backgroundColor: pair.toneColor, color: "white" }}
                                onClick={() => handlePlayDong(pair.dong, pair.dongPinyin, `dong-${selectedPair.id}-${idx}`)}
                              >
                                <Volume2 className={`w-3.5 h-3.5 mr-1 ${playingId === `dong-${selectedPair.id}-${idx}` ? "animate-pulse" : ""}`} />
                                侗语
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="flex-1 text-xs"
                                style={{ borderColor: `${pair.toneColor}40`, color: pair.toneColor }}
                                onClick={() => handlePlayChinese(pair.chinese, `cn-${selectedPair.id}-${idx}`)}
                              >
                                <Volume2 className={`w-3.5 h-3.5 mr-1 ${playingId === `cn-${selectedPair.id}-${idx}` ? "animate-pulse" : ""}`} />
                                普通话
                              </Button>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* 连续播放对比 */}
                      <div className="bg-white rounded-2xl p-5 border mb-6" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Headphones className="w-4 h-4" style={{ color: "#3a3a6e" }} />
                          <h3 className="font-semibold text-sm" style={{ color: "#3a3a6e" }}>连续对比播放</h3>
                        </div>
                        <p className="text-xs text-[#3a3a6e]/60 mb-3">依次播放所有声调变体，感受声调差异</p>
                        <Button
                          onClick={() => {
                            let delay = 0;
                            selectedPair.pairs.forEach((p, i) => {
                              setTimeout(() => {
                                setPlayingId(`seq-${i}`);
                                speakDong(p.dong, p.dongPinyin);
                              }, delay);
                              setTimeout(() => setPlayingId(null), delay + 1200);
                              delay += 1500;
                            });
                          }}
                          className="text-white"
                          style={{ backgroundColor: "#3a3a6e" }}
                        >
                          <Volume2 className="w-4 h-4 mr-2" />
                          依次播放全部 ({selectedPair.pairs.length}个声调)
                        </Button>

                        {/* 播放进度指示 */}
                        <div className="flex gap-3 mt-4">
                          {selectedPair.pairs.map((p, i) => (
                            <div
                              key={i}
                              className={`flex-1 text-center py-2 rounded-lg text-xs font-medium transition-all ${
                                playingId === `seq-${i}` ? "scale-105 shadow-md" : ""
                              }`}
                              style={{
                                backgroundColor: playingId === `seq-${i}` ? `${p.toneColor}20` : `${p.toneColor}08`,
                                color: p.toneColor,
                                borderWidth: 1,
                                borderColor: playingId === `seq-${i}` ? p.toneColor : "transparent",
                              }}
                            >
                              <div className="font-bold">{p.chinese}</div>
                              <div className="text-[10px] opacity-70">{p.dongPinyin}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 解释说明 */}
                      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#f59e0b20" }}>
                            <Lightbulb className="w-4 h-4" style={{ color: "#f59e0b" }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm mb-2" style={{ color: "#3a3a6e" }}>学习提示</h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                              {selectedPair.explanation}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== 声调总览 ========== */}
          {activeTab === "tones" && (
            <motion.div key="tones" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-2 text-center" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                  侗语九声调系统
                </h2>
                <p className="text-center text-sm mb-8" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                  侗语属于侗台语族，拥有丰富的声调系统。包含6个舒声调和3个入声调，共9个声调。
                </p>

                {/* 声调五度标记法图示 */}
                <div className="bg-white rounded-2xl p-6 border mb-8" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                  <h3 className="font-semibold mb-4 text-center" style={{ color: "#3a3a6e" }}>五度标记法声调图</h3>
                  <div className="flex justify-center">
                    <svg width="680" height="220" viewBox="0 0 680 220" className="max-w-full">
                      {/* 背景网格 */}
                      {[1, 2, 3, 4, 5].map(level => (
                        <g key={level}>
                          <line x1="40" y1={190 - (level - 1) * 40} x2="660" y2={190 - (level - 1) * 40} stroke="rgba(58,58,110,0.08)" strokeWidth="1" />
                          <text x="25" y={194 - (level - 1) * 40} fontSize="12" fill="rgba(58,58,110,0.4)" textAnchor="middle" fontFamily="monospace">{level}</text>
                        </g>
                      ))}

                      {/* 舒声调 */}
                      {/* 高平调 55 */}
                      <line x1="60" y1="30" x2="120" y2="30" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="60" cy="30" r="3" fill="#ef4444" />
                      <circle cx="120" cy="30" r="3" fill="#ef4444" />
                      <text x="90" y="20" fontSize="11" fill="#ef4444" textAnchor="middle" fontWeight="600">高平 ˦</text>

                      {/* 中升调 35 */}
                      <line x1="160" y1="110" x2="220" y2="30" stroke="#4ade80" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="160" cy="110" r="3" fill="#4ade80" />
                      <circle cx="220" cy="30" r="3" fill="#4ade80" />
                      <text x="190" y="20" fontSize="11" fill="#4ade80" textAnchor="middle" fontWeight="600">中升 ˧˥</text>

                      {/* 中平调 33 */}
                      <line x1="260" y1="110" x2="320" y2="110" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="260" cy="110" r="3" fill="#f59e0b" />
                      <circle cx="320" cy="110" r="3" fill="#f59e0b" />
                      <text x="290" y="100" fontSize="11" fill="#f59e0b" textAnchor="middle" fontWeight="600">中平 ˧</text>

                      {/* 低调 21 */}
                      <line x1="360" y1="150" x2="420" y2="190" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="360" cy="150" r="3" fill="#3b82f6" />
                      <circle cx="420" cy="190" r="3" fill="#3b82f6" />
                      <text x="390" y="140" fontSize="11" fill="#3b82f6" textAnchor="middle" fontWeight="600">低调 ˩</text>

                      {/* 高降调 51 */}
                      <line x1="460" y1="30" x2="520" y2="190" stroke="#f87171" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="460" cy="30" r="3" fill="#f87171" />
                      <circle cx="520" cy="190" r="3" fill="#f87171" />
                      <text x="490" y="20" fontSize="11" fill="#f87171" textAnchor="middle" fontWeight="600">高降 ˦˩</text>

                      {/* 低升调 13 */}
                      <line x1="560" y1="190" x2="620" y2="110" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="560" cy="190" r="3" fill="#60a5fa" />
                      <circle cx="620" cy="110" r="3" fill="#60a5fa" />
                      <text x="590" y="100" fontSize="11" fill="#60a5fa" textAnchor="middle" fontWeight="600">低升 ˩˧</text>
                    </svg>
                  </div>
                  <p className="text-center text-xs mt-3" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                    纵轴为音高（1-5），横轴为时间。舒声调发音较长，入声调以塞音p/t/k结尾，发音短促。
                  </p>
                </div>

                {/* 九声调详细卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {toneSystem.map((tone, idx) => (
                    <motion.div
                      key={tone.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer select-none
                        ${playingId === `tone-card-${tone.id}` ? "shadow-lg scale-[1.02]" : ""}`}
                      style={{ borderColor: playingId === `tone-card-${tone.id}` ? tone.color : `${tone.color}25` }}
                      onClick={() => handlePlayToneCard(tone.value, `tone-card-${tone.id}`)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${tone.color}15`, color: tone.color }}>
                          {tone.name}
                        </span>
                        <span className="text-xs font-mono" style={{ color: "#3a3a6e", opacity: 0.4 }}>{tone.value}</span>
                      </div>

                      {/* 迷你声调曲线 */}
                      <div className="flex justify-center my-3">
                        <svg width="80" height="40" viewBox="0 0 80 40">
                          {[1, 2, 3, 4, 5].map(l => (
                            <line key={l} x1="5" y1={38 - (l - 1) * 8} x2="75" y2={38 - (l - 1) * 8} stroke="rgba(58,58,110,0.05)" strokeWidth="0.5" />
                          ))}
                          <line
                            x1="15"
                            y1={38 - (tone.pitch[0] - 1) * 8}
                            x2={tone.value.includes("p") ? "50" : "65"}
                            y2={38 - (tone.pitch[1] - 1) * 8}
                            stroke={tone.color}
                            strokeWidth="3"
                            strokeLinecap="round"
                          />
                          <circle cx="15" cy={38 - (tone.pitch[0] - 1) * 8} r="3" fill={tone.color} />
                          <circle cx={tone.value.includes("p") ? 50 : 65} cy={38 - (tone.pitch[1] - 1) * 8} r="3" fill={tone.color} />
                          {tone.value.includes("p") && (
                            <line x1={50} y1={38 - (tone.pitch[1] - 1) * 8 - 5} x2={50} y2={38 - (tone.pitch[1] - 1) * 8 + 5} stroke={tone.color} strokeWidth="2" />
                          )}
                        </svg>
                      </div>

                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        {tone.desc}
                      </p>
                      <div className="text-xs font-mono" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                        例: {tone.example}
                      </div>
                      {/* 点击播放提示 */}
                      <div className="flex items-center justify-center gap-1 mt-2 pt-2 border-t" style={{ borderColor: `${tone.color}20` }}>
                        <Volume2
                          className={`w-3.5 h-3.5 ${playingId === `tone-card-${tone.id}` ? "animate-pulse" : ""}`}
                          style={{ color: tone.color }}
                        />
                        <span className="text-[10px] font-medium" style={{ color: tone.color }}>
                          {playingId === `tone-card-${tone.id}` ? "播放中…" : "点击试听"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 声调对比要点 */}
                <div className="bg-white rounded-2xl p-6 border mt-8" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                  <h3 className="font-semibold mb-4" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>声调学习要点</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#ef444410" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#ef4444" }}>高平调 vs 中平调</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        这是最容易混淆的一对声调。高平调(˦)保持在5度音高，中平调(˧)保持在3度音高。练习时可以先发一个高音"啊——"，再发一个中等音高的"啊——"，感受音高差异。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#3b82f610" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#3b82f6" }}>舒声 vs 入声</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        入声字以塞音p/t/k结尾，发音短促有力，像被突然截断。舒声则可以自由延长。练习时对比"si:"（长元音）和"sip"（短促截断），感受入声的特点。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#4ade8010" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#16a34a" }}>升调的方向感</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        中升调(˧˥)从3度升到5度，低升调(˩˧)从1度升到3度。两者都是升调，但起点和终点不同。中升调更像普通话的第二声，低升调起点更低。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#f59e0b10" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#d97706" }}>声调与语境</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        在实际对话中，声调可能因语速和语境而略有变化。但基本的声调走向不会改变。建议先在单字层面掌握声调，再过渡到词组和句子的声调练习。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== 听辨测验 ========== */}
          {activeTab === "quiz" && (
            <motion.div key="quiz" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="max-w-2xl mx-auto">
                {!quizStarted ? (
                  /* 测验开始页 */
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "#3a3a6e" }}>
                      <Headphones className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                      声调听辨测验
                    </h2>
                    <p className="text-sm mb-2" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                      听侗语发音，选择正确的词义。测试你对声调差异的辨别能力。
                    </p>
                    <div className="flex justify-center gap-6 my-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>10</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>题目数量</div>
                      </div>
                      <div className="w-px bg-[#3a3a6e]/10" />
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>{minimalPairs.length}</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>对立词组</div>
                      </div>
                      <div className="w-px bg-[#3a3a6e]/10" />
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>9</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>声调类型</div>
                      </div>
                    </div>
                    <Button onClick={startQuiz} size="lg" className="text-white px-8" style={{ backgroundColor: "#3a3a6e" }}>
                      开始测验
                    </Button>
                  </motion.div>
                ) : quizFinished ? (
                  /* 测验结果 */
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: correctCount >= 7 ? "#4ade8020" : correctCount >= 4 ? "#f59e0b20" : "#ef444420" }}>
                      <Trophy className="w-10 h-10" style={{ color: correctCount >= 7 ? "#16a34a" : correctCount >= 4 ? "#d97706" : "#ef4444" }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                      测验完成！
                    </h2>
                    <div className="text-5xl font-bold my-4" style={{ color: correctCount >= 7 ? "#16a34a" : correctCount >= 4 ? "#d97706" : "#ef4444" }}>
                      {correctCount}/{quizQuestions.length}
                    </div>
                    <p className="text-sm mb-6" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                      {correctCount >= 9 ? "太棒了！你对侗语声调有极强的辨别能力！" :
                       correctCount >= 7 ? "很好！你已经掌握了大部分声调的区别。" :
                       correctCount >= 4 ? "还不错，继续练习可以提高声调辨别能力。" :
                       "需要多加练习，建议先回到对比学习模块复习。"}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={startQuiz} className="text-white" style={{ backgroundColor: "#3a3a6e" }}>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        再来一次
                      </Button>
                      <Button variant="outline" onClick={() => { setActiveTab("learn"); setQuizStarted(false); }} style={{ borderColor: "#3a3a6e40", color: "#3a3a6e" }}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        回到学习
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  /* 答题中 */
                  <div>
                    {/* 进度条 */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm font-medium" style={{ color: "#3a3a6e" }}>
                        {currentQ + 1}/{quizQuestions.length}
                      </span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a6e10" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: "#3a3a6e" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-sm" style={{ color: "#16a34a" }}>
                        {correctCount} 正确
                      </span>
                    </div>

                    {(() => {
                      const q = quizQuestions[currentQ];
                      const pair = minimalPairs.find(p => p.id === q.pairId)!;
                      const target = pair.pairs[q.targetIndex];

                      return (
                        <motion.div
                          key={q.id}
                          initial={{ opacity: 0, x: 30 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* 题目卡片 */}
                          <div className="bg-white rounded-2xl p-6 border mb-6 text-center" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                            <p className="text-sm mb-4" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                              听发音，选择正确的含义
                            </p>
                            <div className="text-3xl font-bold mb-2" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                              {target.dong}
                            </div>
                            <div className="text-sm font-mono mb-4" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                              {target.dongPinyin}
                            </div>

                            {/* 声调曲线 */}
                            <div className="flex justify-center mb-4">
                              <ToneCurve dongPinyin={target.dongPinyin} size="lg" animated />
                            </div>

                            <Button
                              onClick={() => handlePlayDong(target.dong, target.dongPinyin, `quiz-play`)}
                              className="text-white"
                              style={{ backgroundColor: "#3a3a6e" }}
                            >
                              <Volume2 className={`w-4 h-4 mr-2 ${playingId === "quiz-play" ? "animate-pulse" : ""}`} />
                              播放发音
                            </Button>
                          </div>

                          {/* 选项 */}
                          <div className="space-y-3">
                            {pair.pairs.map((option, idx) => {
                              const isCorrect = idx === q.targetIndex;
                              const isSelected = selectedAnswer === idx;
                              let borderColor = "rgba(58,58,110,0.1)";
                              let bgColor = "white";
                              let icon = null;

                              if (showResult) {
                                if (isCorrect) {
                                  borderColor = "#16a34a";
                                  bgColor = "#f0fdf4";
                                  icon = <CheckCircle className="w-5 h-5 text-green-600" />;
                                } else if (isSelected && !isCorrect) {
                                  borderColor = "#ef4444";
                                  bgColor = "#fef2f2";
                                  icon = <XCircle className="w-5 h-5 text-red-500" />;
                                }
                              } else if (isSelected) {
                                borderColor = "#3a3a6e";
                                bgColor = "#3a3a6e08";
                              }

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleQuizAnswer(idx)}
                                  disabled={showResult}
                                  className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between"
                                  style={{ borderColor, backgroundColor: bgColor }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${option.toneColor}15`, color: option.toneColor }}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <div>
                                      <span className="font-semibold" style={{ color: "#3a3a6e" }}>{option.chinese}</span>
                                      <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${option.toneColor}10`, color: option.toneColor }}>
                                        {option.toneLabel}
                                      </span>
                                    </div>
                                  </div>
                                  {icon}
                                </button>
                              );
                            })}
                          </div>

                          {/* 结果反馈和下一题 */}
                          {showResult && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
                              <div className={`p-4 rounded-xl mb-4 ${selectedAnswer === q.targetIndex ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                                <p className={`text-sm font-medium ${selectedAnswer === q.targetIndex ? "text-green-700" : "text-red-700"}`}>
                                  {selectedAnswer === q.targetIndex ? "回答正确！" : `回答错误。正确答案是「${target.chinese}」(${target.toneLabel})`}
                                </p>
                                {selectedAnswer !== q.targetIndex && (
                                  <p className="text-xs mt-1 text-red-600/70">
                                    注意听声调的高低变化，{target.toneLabel}的特点是：{toneSystem.find(t => target.toneLabel.includes(t.name))?.desc || ""}
                                  </p>
                                )}
                              </div>
                              <div className="flex justify-end">
                                <Button onClick={nextQuestion} className="text-white" style={{ backgroundColor: "#3a3a6e" }}>
                                  {currentQ + 1 >= quizQuestions.length ? "查看结果" : "下一题"}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </div>
                            </motion.div>
                          )}
                        </motion.div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
