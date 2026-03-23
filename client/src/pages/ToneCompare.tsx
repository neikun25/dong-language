/*
 * 声调对比练习页面
 * 设计风格：青蓝雅致 - 靛蓝紫导航 + 米白宣纸质感内容区
 * 功能：声调分组词汇对比学习、声调曲线对比、真实录音播放、听辨测验
 * 所有词汇均来自终版调查字表（发音人：杨艳杰，榕江二中）
 */
import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Trophy, BookOpen, Headphones, ChevronRight, RotateCcw, CheckCircle, XCircle, Lightbulb, Music, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiToneDetect from "@/components/AiToneDetect";
import {
  DONG_TONE_GROUPS,
  TONE_COLORS,
  TONE_NAMES,
  playToneWord,
  stopCurrentAudio,
  type ToneWord,
  type ToneGroup,
} from "@/lib/dongToneData";

// ========== 声调总览卡片数据（9个声调，使用字表第一个词的录音）==========
const toneOverview = [
  { toneCode: "55", syllableType: "舒" as const, color: "#e63946", pitch: [5, 5], desc: "音高保持在最高位置不变，发音高而平稳", audioPath: "/audio/55s_1_bal.wav",   example: "bal（鱼）" },
  { toneCode: "35", syllableType: "舒" as const, color: "#f4a261", pitch: [3, 5], desc: "从中音位置上升到高音，音调呈上升趋势", audioPath: "/audio/35s_1_taemk.wav", example: "taemk（矮）" },
  { toneCode: "11", syllableType: "舒" as const, color: "#457b9d", pitch: [1, 1], desc: "音高保持在最低位置，发音低沉平稳", audioPath: "/audio/11s_1_tang.wav",   example: "tang（糖）" },
  { toneCode: "323",syllableType: "舒" as const, color: "#a8dadc", pitch: [3, 2, 3], desc: "从中音降到低音再升回中音，音调呈曲折形", audioPath: "/audio/323s_1_gaos.wav",  example: "gaos（头；端）" },
  { toneCode: "13", syllableType: "舒" as const, color: "#2a9d8f", pitch: [1, 3], desc: "从低音位置上升到中音，音调由低渐升", audioPath: "/audio/13s_1_thenl.wav",  example: "thenl（短）" },
  { toneCode: "31", syllableType: "舒" as const, color: "#6d6875", pitch: [3, 1], desc: "从中音位置下降到低音，音调由中渐降", audioPath: "/audio/31s_1_jaix.wav",   example: "jaix（哥、姐）" },
  { toneCode: "53", syllableType: "舒" as const, color: "#e9c46a", pitch: [5, 3], desc: "从高音位置快速下降到中音，音调高而下降", audioPath: "/audio/53s_1_baenv.wav",  example: "baenv（扔掉）" },
  { toneCode: "453",syllableType: "舒" as const, color: "#264653", pitch: [4, 5, 3], desc: "从中高音升到最高再降到中音，先升后降", audioPath: "/audio/453s_1_phu.wav",   example: "phu（商店）" },
  { toneCode: "33", syllableType: "舒" as const, color: "#8ecae6", pitch: [3, 3], desc: "音高保持在中间位置，发音平稳不高不低", audioPath: "/audio/33s_1_jah.wav",   example: "jah（那儿）" },
];

// ========== 声调分组对比数据（每组5个词，均有真实录音）==========
// 每个"对比组"展示同一声调下的5个词汇，帮助学习者感受该声调的特征
interface ToneLearnGroup {
  id: string;
  toneCode: string;
  syllableType: "舒" | "促";
  label: string;
  color: string;
  words: ToneWord[];
  tip: string;
}

function buildLearnGroups(): ToneLearnGroup[] {
  return DONG_TONE_GROUPS.map(g => ({
    id: `${g.toneCode}-${g.syllableType}`,
    toneCode: g.toneCode,
    syllableType: g.syllableType,
    label: `${g.toneCode} ${g.name}（${g.syllableType}声）`,
    color: TONE_COLORS[g.toneCode] || "#3a3a6e",
    words: g.words,
    tip: g.description,
  }));
}

const learnGroups = buildLearnGroups();

// ========== 听辨测验题目（从字表词汇生成）==========
interface QuizQuestion {
  id: string;
  groupId: string;
  targetWord: ToneWord;
  options: ToneWord[];  // 4个选项（含正确答案）
}

function generateQuiz(): QuizQuestion[] {
  const allWords = DONG_TONE_GROUPS.flatMap(g => g.words);
  const questions: QuizQuestion[] = [];

  // 从每个声调组随机取1个词作为题目，选项从全部词汇中随机抽取（确保包含正确答案）
  DONG_TONE_GROUPS.forEach(g => {
    const target = g.words[Math.floor(Math.random() * g.words.length)];
    // 从其他词汇中随机取3个干扰项
    const distractors = allWords
      .filter(w => w.id !== target.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [...distractors, target].sort(() => Math.random() - 0.5);
    questions.push({
      id: `q_${g.toneCode}_${g.syllableType}`,
      groupId: `${g.toneCode}-${g.syllableType}`,
      targetWord: target,
      options,
    });
  });

  return questions.sort(() => Math.random() - 0.5).slice(0, 10);
}

// ========== 迷你声调曲线 ==========
function MiniToneCurve({ pitch, color }: { pitch: number[]; color: string }) {
  const W = 80, H = 40, PAD = 6;
  const points = pitch.map((v, i) => {
    const x = PAD + (i / Math.max(pitch.length - 1, 1)) * (W - PAD * 2);
    const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
    return `${x},${y}`;
  });
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
      {[1, 2, 3, 4, 5].map(l => {
        const y = H - PAD - ((l - 1) / 4) * (H - PAD * 2);
        return <line key={l} x1={PAD} y1={y} x2={W - PAD} y2={y} stroke="rgba(58,58,110,0.06)" strokeWidth="0.5" />;
      })}
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pitch.map((v, i) => {
        const x = PAD + (i / Math.max(pitch.length - 1, 1)) * (W - PAD * 2);
        const y = H - PAD - ((v - 1) / 4) * (H - PAD * 2);
        return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
      })}
    </svg>
  );
}

// ========== 词汇发音卡片 ==========
function WordCard({ word, isPlaying, onPlay, color }: { word: ToneWord; isPlaying: boolean; onPlay: () => void; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl p-4 border-2 cursor-pointer transition-all hover:shadow-md select-none
        ${isPlaying ? "shadow-lg scale-[1.03]" : ""}`}
      style={{ borderColor: isPlaying ? color : `${color}30` }}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPlay(); }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          <div className="text-lg font-bold font-mono truncate" style={{ color: "#3a3a6e" }}>{word.dong}</div>
          <div className="text-xs font-mono text-[#3a3a6e]/50 mt-0.5 truncate">{word.ipa}</div>
        </div>
        <div
          className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{ backgroundColor: isPlaying ? color : `${color}15`, color: isPlaying ? "white" : color }}
        >
          <Volume2 size={14} className={isPlaying ? "animate-pulse" : ""} />
        </div>
      </div>
      <div className="text-sm text-[#3a3a6e] bg-[#3a3a6e]/5 rounded-lg px-3 py-1.5 leading-snug">
        {word.chinese}
      </div>
      {isPlaying && <div className="h-0.5 mt-2 rounded-full animate-pulse" style={{ backgroundColor: color }} />}
    </motion.div>
  );
}

// ========== 页面组件 ==========
type TabType = "learn" | "tones" | "quiz" | "ai-detect";

export default function ToneCompare() {
  const [activeTab, setActiveTab] = useState<TabType>("learn");
  const [selectedGroup, setSelectedGroup] = useState<ToneLearnGroup>(learnGroups[0]);
  const [playingId, setPlayingId] = useState<string | null>(null);

  // 测验状态
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const handlePlayWord = useCallback((word: ToneWord, id: string) => {
    if (playingId === id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    playToneWord(word.audioPath, () => setPlayingId(null));
  }, [playingId]);

  const handlePlayToneCard = useCallback((audioPath: string, id: string) => {
    if (playingId === id) {
      stopCurrentAudio();
      setPlayingId(null);
      return;
    }
    setPlayingId(id);
    playToneWord(audioPath, () => setPlayingId(null));
  }, [playingId]);

  const startQuiz = useCallback(() => {
    const questions = generateQuiz();
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
    const q = quizQuestions[currentQ];
    if (q.options[answerIdx].id === q.targetWord.id) {
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
    { id: "learn", label: "声调学习", icon: <BookOpen className="w-4 h-4" /> },
    { id: "tones", label: "声调总览", icon: <Music className="w-4 h-4" /> },
    { id: "quiz", label: "听辨测验", icon: <Headphones className="w-4 h-4" /> },
    { id: "ai-detect", label: "AI检测", icon: <Mic className="w-4 h-4" /> },
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
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-3">
              侗语有15个声调（9舒声+6促声），通过真实录音感受每个声调的特征
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-white/50">
              <span className="flex items-center gap-1"><Mic size={11} />发音人：杨艳杰</span>
              <span>·</span>
              <span>40岁 · 女 · 9村 · 榕江二中</span>
              <span>·</span>
              <span>75个独立词汇录音</span>
            </div>
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

          {/* ========== 声调学习 ========== */}
          {activeTab === "learn" && (
            <motion.div key="learn" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* 左侧：声调组列表 */}
                <div className="lg:col-span-1">
                  <h3 className="text-sm font-semibold mb-3" style={{ color: "#3a3a6e" }}>声调分组（{learnGroups.length}组）</h3>
                  <div className="space-y-1.5">
                    {learnGroups.map(group => (
                      <button
                        key={group.id}
                        onClick={() => { setSelectedGroup(group); stopCurrentAudio(); setPlayingId(null); }}
                        className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                          selectedGroup.id === group.id
                            ? "border-[#3a3a6e]/30 shadow-md"
                            : "border-transparent hover:border-[#3a3a6e]/10 hover:shadow-sm"
                        }`}
                        style={{ backgroundColor: selectedGroup.id === group.id ? "white" : "rgba(255,255,255,0.5)" }}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono text-white"
                            style={{ backgroundColor: group.color }}
                          >
                            {group.toneCode}
                          </span>
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold truncate" style={{ color: "#3a3a6e" }}>
                              {TONE_NAMES[group.toneCode]}
                            </div>
                            <div className="text-[10px] text-[#3a3a6e]/50">{group.syllableType}声 · {group.words.length}词</div>
                          </div>
                          {selectedGroup.id === group.id && (
                            <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: "#3a3a6e" }} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 右侧：词汇详情 */}
                <div className="lg:col-span-3">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedGroup.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* 声调标题 */}
                      <div
                        className="rounded-2xl p-5 mb-5 text-white"
                        style={{ background: `linear-gradient(135deg, ${selectedGroup.color}ee, ${selectedGroup.color}99)` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-2xl font-bold font-mono">
                            {selectedGroup.toneCode}
                          </div>
                          <div className="flex-1">
                            <div className="text-xl font-bold mb-1">
                              {TONE_NAMES[selectedGroup.toneCode]}
                              <span className="ml-2 text-sm font-normal opacity-80">（{selectedGroup.syllableType}声）</span>
                            </div>
                            <p className="text-sm opacity-80">{selectedGroup.tip}</p>
                          </div>
                          <div className="hidden sm:block">
                            <MiniToneCurve
                              pitch={toneOverview.find(t => t.toneCode === selectedGroup.toneCode)?.pitch || [3, 3]}
                              color="white"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 连续播放 */}
                      <div className="bg-white rounded-2xl p-4 border mb-5" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                        <div className="flex items-center justify-between flex-wrap gap-3">
                          <div>
                            <h3 className="font-semibold text-sm" style={{ color: "#3a3a6e" }}>依次播放全部 {selectedGroup.words.length} 个例词</h3>
                            <p className="text-xs text-[#3a3a6e]/50 mt-0.5">感受 {selectedGroup.toneCode} 声调的音高走势</p>
                          </div>
                          <Button
                            size="sm"
                            className="text-white"
                            style={{ backgroundColor: selectedGroup.color }}
                            onClick={() => {
                              let delay = 0;
                              selectedGroup.words.forEach((w, i) => {
                                setTimeout(() => {
                                  setPlayingId(`seq-${i}`);
                                  playToneWord(w.audioPath, () => {});
                                }, delay);
                                setTimeout(() => setPlayingId(null), delay + 900);
                                delay += 1100;
                              });
                            }}
                          >
                            <Volume2 className="w-4 h-4 mr-2" />
                            依次播放
                          </Button>
                        </div>
                        {/* 播放进度指示 */}
                        <div className="flex gap-2 mt-3 flex-wrap">
                          {selectedGroup.words.map((w, i) => (
                            <div
                              key={w.id}
                              className={`flex-1 min-w-[60px] text-center py-1.5 rounded-lg text-xs font-medium transition-all ${
                                playingId === `seq-${i}` ? "scale-105 shadow-sm" : ""
                              }`}
                              style={{
                                backgroundColor: playingId === `seq-${i}` ? `${selectedGroup.color}25` : `${selectedGroup.color}08`,
                                color: selectedGroup.color,
                                border: `1px solid ${playingId === `seq-${i}` ? selectedGroup.color : "transparent"}`,
                              }}
                            >
                              <div className="font-bold font-mono">{w.dong}</div>
                              <div className="text-[10px] opacity-70">{w.chinese}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 词汇卡片网格 */}
                      <h4 className="text-sm font-semibold mb-3" style={{ color: "#3a3a6e" }}>
                        点击卡片播放真实录音
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
                        {selectedGroup.words.map(word => (
                          <WordCard
                            key={word.id}
                            word={word}
                            isPlaying={playingId === `word-${word.id}`}
                            onPlay={() => handlePlayWord(word, `word-${word.id}`)}
                            color={selectedGroup.color}
                          />
                        ))}
                      </div>

                      {/* 学习提示 */}
                      <div className="bg-white rounded-2xl p-5 border" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: "#f59e0b20" }}>
                            <Lightbulb className="w-4 h-4" style={{ color: "#f59e0b" }} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm mb-1" style={{ color: "#3a3a6e" }}>
                              {selectedGroup.toneCode} {TONE_NAMES[selectedGroup.toneCode]} 学习要点
                            </h3>
                            <p className="text-sm leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                              {selectedGroup.tip}。
                              {selectedGroup.syllableType === "促"
                                ? "促声调以塞音（-p/-t/-k）结尾，发音短促有力，注意与同调值的舒声调区分。"
                                : "舒声调音节以元音或鼻音结尾，发音可以适当延长，有助于感受声调走势。"}
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
                  侗语声调系统总览
                </h2>
                <p className="text-center text-sm mb-8" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                  南部侗语共9个声调（舒声），促声调另有6个。点击卡片播放真实录音示例。
                </p>

                {/* 声调五度标记法图示 */}
                <div className="bg-white rounded-2xl p-6 border mb-8" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                  <h3 className="font-semibold mb-4 text-center" style={{ color: "#3a3a6e" }}>九声调走势图（五度标记法）</h3>
                  <div className="flex justify-center overflow-x-auto">
                    <svg width="720" height="220" viewBox="0 0 720 220" className="max-w-full">
                      {[1, 2, 3, 4, 5].map(level => (
                        <g key={level}>
                          <line x1="40" y1={190 - (level - 1) * 40} x2="700" y2={190 - (level - 1) * 40} stroke="rgba(58,58,110,0.07)" strokeWidth="1" />
                          <text x="25" y={194 - (level - 1) * 40} fontSize="11" fill="rgba(58,58,110,0.4)" textAnchor="middle" fontFamily="monospace">{level}</text>
                        </g>
                      ))}
                      {/* 55高平调 */}
                      <line x1="55" y1="30" x2="105" y2="30" stroke="#e63946" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="55" cy="30" r="3" fill="#e63946" /><circle cx="105" cy="30" r="3" fill="#e63946" />
                      <text x="80" y="20" fontSize="10" fill="#e63946" textAnchor="middle" fontWeight="600">55高平</text>
                      {/* 35中升调 */}
                      <line x1="125" y1="110" x2="175" y2="30" stroke="#f4a261" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="125" cy="110" r="3" fill="#f4a261" /><circle cx="175" cy="30" r="3" fill="#f4a261" />
                      <text x="150" y="20" fontSize="10" fill="#f4a261" textAnchor="middle" fontWeight="600">35中升</text>
                      {/* 11低平调 */}
                      <line x1="195" y1="190" x2="245" y2="190" stroke="#457b9d" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="195" cy="190" r="3" fill="#457b9d" /><circle cx="245" cy="190" r="3" fill="#457b9d" />
                      <text x="220" y="180" fontSize="10" fill="#457b9d" textAnchor="middle" fontWeight="600">11低平</text>
                      {/* 323曲折调 */}
                      <polyline points="265,110 290,150 315,110" fill="none" stroke="#a8dadc" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="265" cy="110" r="3" fill="#a8dadc" /><circle cx="290" cy="150" r="3" fill="#a8dadc" /><circle cx="315" cy="110" r="3" fill="#a8dadc" />
                      <text x="290" y="100" fontSize="10" fill="#a8dadc" textAnchor="middle" fontWeight="600">323曲折</text>
                      {/* 13低升调 */}
                      <line x1="335" y1="190" x2="385" y2="110" stroke="#2a9d8f" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="335" cy="190" r="3" fill="#2a9d8f" /><circle cx="385" cy="110" r="3" fill="#2a9d8f" />
                      <text x="360" y="100" fontSize="10" fill="#2a9d8f" textAnchor="middle" fontWeight="600">13低升</text>
                      {/* 31中降调 */}
                      <line x1="405" y1="110" x2="455" y2="190" stroke="#6d6875" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="405" cy="110" r="3" fill="#6d6875" /><circle cx="455" cy="190" r="3" fill="#6d6875" />
                      <text x="430" y="100" fontSize="10" fill="#6d6875" textAnchor="middle" fontWeight="600">31中降</text>
                      {/* 53高降调 */}
                      <line x1="475" y1="30" x2="525" y2="110" stroke="#e9c46a" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="475" cy="30" r="3" fill="#e9c46a" /><circle cx="525" cy="110" r="3" fill="#e9c46a" />
                      <text x="500" y="20" fontSize="10" fill="#e9c46a" textAnchor="middle" fontWeight="600">53高降</text>
                      {/* 453升降调 */}
                      <polyline points="545,70 570,30 595,110" fill="none" stroke="#264653" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="545" cy="70" r="3" fill="#264653" /><circle cx="570" cy="30" r="3" fill="#264653" /><circle cx="595" cy="110" r="3" fill="#264653" />
                      <text x="570" y="20" fontSize="10" fill="#264653" textAnchor="middle" fontWeight="600">453升降</text>
                      {/* 33中平调 */}
                      <line x1="615" y1="110" x2="665" y2="110" stroke="#8ecae6" strokeWidth="3" strokeLinecap="round" />
                      <circle cx="615" cy="110" r="3" fill="#8ecae6" /><circle cx="665" cy="110" r="3" fill="#8ecae6" />
                      <text x="640" y="100" fontSize="10" fill="#8ecae6" textAnchor="middle" fontWeight="600">33中平</text>
                    </svg>
                  </div>
                  <p className="text-center text-xs mt-3" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                    纵轴为音高（1=最低，5=最高），横轴为时间。以上为9个舒声调，促声调另有6个（55、35、11、323、13、31）。
                  </p>
                </div>

                {/* 九声调详细卡片（点击试听真实录音）*/}
                <h3 className="font-semibold mb-4 text-center" style={{ color: "#3a3a6e" }}>
                  点击卡片试听真实录音
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {toneOverview.map((tone, idx) => (
                    <motion.div
                      key={tone.toneCode}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-xl p-4 border hover:shadow-md transition-all cursor-pointer select-none
                        ${playingId === `tone-card-${tone.toneCode}` ? "shadow-lg scale-[1.02]" : ""}`}
                      style={{ borderColor: playingId === `tone-card-${tone.toneCode}` ? tone.color : `${tone.color}25` }}
                      onClick={(e) => { e.stopPropagation(); e.preventDefault(); handlePlayToneCard(tone.audioPath, `tone-card-${tone.toneCode}`); }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ backgroundColor: `${tone.color}15`, color: tone.color }}>
                          {TONE_NAMES[tone.toneCode]}
                        </span>
                        <span className="text-sm font-bold font-mono" style={{ color: tone.color }}>{tone.toneCode}</span>
                      </div>
                      <div className="flex justify-center my-3">
                        <MiniToneCurve pitch={tone.pitch} color={tone.color} />
                      </div>
                      <p className="text-xs leading-relaxed mb-2" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        {tone.desc}
                      </p>
                      <div className="text-xs font-mono mb-2" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                        例: {tone.example}
                      </div>
                      <div className="flex items-center justify-center gap-1 pt-2 border-t" style={{ borderColor: `${tone.color}20` }}>
                        <Volume2
                          className={`w-3.5 h-3.5 ${playingId === `tone-card-${tone.toneCode}` ? "animate-pulse" : ""}`}
                          style={{ color: tone.color }}
                        />
                        <span className="text-[10px] font-medium" style={{ color: tone.color }}>
                          {playingId === `tone-card-${tone.toneCode}` ? "播放中…" : "点击试听"}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* 声调对比要点 */}
                <div className="bg-white rounded-2xl p-6 border mt-8" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
                  <h3 className="font-semibold mb-4" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>声调学习要点</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#e6394610" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#e63946" }}>高平调 vs 中平调（55 vs 33）</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        高平调(55)保持在5度音高，中平调(33)保持在3度音高。两者都是平调，但音高差异明显。练习时先发高音"啊——"，再发中等音高的"啊——"，感受音高差异。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#457b9d10" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#457b9d" }}>舒声 vs 促声</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        促声调以塞音(-p/-t/-k)结尾，发音短促有力，像被突然截断。舒声则可以自由延长。侗语有6个促声调（55、35、11、323、13、31），与对应舒声调形成对比。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#f4a26110" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#f4a261" }}>升调的方向感（35 vs 13）</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        中升调(35)从3度升到5度，低升调(13)从1度升到3度。两者都是升调，但起点和终点不同。中升调更像普通话的第二声，低升调起点更低。
                      </p>
                    </div>
                    <div className="p-4 rounded-xl" style={{ backgroundColor: "#a8dadc10" }}>
                      <h4 className="font-medium text-sm mb-2" style={{ color: "#2a9d8f" }}>曲折调与升降调（323 vs 453）</h4>
                      <p className="text-xs leading-relaxed" style={{ color: "#3a3a6e", opacity: 0.7 }}>
                        曲折调(323)先降后升，形成U形曲线；升降调(453)先升后降，形成倒V形。这两个调是侗语中较为复杂的声调，需要多听真实录音来感受。
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
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: "#3a3a6e" }}>
                      <Headphones className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>
                      声调听辨测验
                    </h2>
                    <p className="text-sm mb-2" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                      听真实录音，选择正确的词义。测试你对侗语声调的辨别能力。
                    </p>
                    <p className="text-xs mb-8" style={{ color: "#3a3a6e", opacity: 0.4 }}>
                      所有题目均来自字表词汇，使用杨艳杰（榕江二中）的真实录音
                    </p>
                    <div className="flex justify-center gap-6 my-8">
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>10</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>题目数量</div>
                      </div>
                      <div className="w-px bg-[#3a3a6e]/10" />
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>4</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>选项数量</div>
                      </div>
                      <div className="w-px bg-[#3a3a6e]/10" />
                      <div className="text-center">
                        <div className="text-2xl font-bold" style={{ color: "#3a3a6e" }}>15</div>
                        <div className="text-xs" style={{ color: "#3a3a6e", opacity: 0.5 }}>声调类型</div>
                      </div>
                    </div>
                    <Button onClick={startQuiz} size="lg" className="text-white px-8" style={{ backgroundColor: "#3a3a6e" }}>
                      开始测验
                    </Button>
                  </motion.div>
                ) : quizFinished ? (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                    <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center" style={{ backgroundColor: correctCount >= 7 ? "#4ade8020" : correctCount >= 4 ? "#f59e0b20" : "#ef444420" }}>
                      <Trophy className="w-10 h-10" style={{ color: correctCount >= 7 ? "#16a34a" : correctCount >= 4 ? "#d97706" : "#ef4444" }} />
                    </div>
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#3a3a6e", fontFamily: "'Noto Serif SC', serif" }}>测验完成！</h2>
                    <div className="text-5xl font-bold my-4" style={{ color: correctCount >= 7 ? "#16a34a" : correctCount >= 4 ? "#d97706" : "#ef4444" }}>
                      {correctCount}/{quizQuestions.length}
                    </div>
                    <p className="text-sm mb-6" style={{ color: "#3a3a6e", opacity: 0.6 }}>
                      {correctCount >= 9 ? "太棒了！你对侗语声调有极强的辨别能力！" :
                       correctCount >= 7 ? "很好！你已经掌握了大部分声调的区别。" :
                       correctCount >= 4 ? "还不错，继续练习可以提高声调辨别能力。" :
                       "需要多加练习，建议先回到声调学习模块复习。"}
                    </p>
                    <div className="flex gap-3 justify-center">
                      <Button onClick={startQuiz} className="text-white" style={{ backgroundColor: "#3a3a6e" }}>
                        <RotateCcw className="w-4 h-4 mr-2" />再来一次
                      </Button>
                      <Button variant="outline" onClick={() => { setActiveTab("learn"); setQuizStarted(false); }} style={{ borderColor: "#3a3a6e40", color: "#3a3a6e" }}>
                        <BookOpen className="w-4 h-4 mr-2" />回到学习
                      </Button>
                    </div>
                  </motion.div>
                ) : (
                  <div>
                    {/* 进度条 */}
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-sm font-medium" style={{ color: "#3a3a6e" }}>{currentQ + 1}/{quizQuestions.length}</span>
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#3a3a6e10" }}>
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: "#3a3a6e" }}
                          initial={{ width: 0 }}
                          animate={{ width: `${((currentQ + 1) / quizQuestions.length) * 100}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span className="text-sm" style={{ color: "#16a34a" }}>{correctCount} 正确</span>
                    </div>

                    {(() => {
                      const q = quizQuestions[currentQ];
                      const target = q.targetWord;
                      const color = TONE_COLORS[target.toneCode] || "#3a3a6e";

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
                            <div className="text-3xl font-bold font-mono mb-1" style={{ color: "#3a3a6e" }}>
                              {target.dong}
                            </div>
                            <div className="text-sm font-mono mb-1" style={{ color: "#3a3a6e", opacity: 0.5 }}>
                              {target.ipa}
                            </div>
                            <div className="flex justify-center gap-2 mb-4">
                              <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${color}15`, color }}>
                                {target.toneCode}调
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${target.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                                {target.syllableType}声
                              </span>
                            </div>
                            <Button
                              onClick={() => handlePlayWord(target, `quiz-play`)}
                              className="text-white"
                              style={{ backgroundColor: color }}
                            >
                              <Volume2 className={`w-4 h-4 mr-2 ${playingId === "quiz-play" ? "animate-pulse" : ""}`} />
                              播放发音
                            </Button>
                          </div>

                          {/* 选项 */}
                          <div className="space-y-3">
                            {q.options.map((option, idx) => {
                              const isCorrect = option.id === q.targetWord.id;
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

                              const optColor = TONE_COLORS[option.toneCode] || "#3a3a6e";

                              return (
                                <button
                                  key={idx}
                                  onClick={() => handleQuizAnswer(idx)}
                                  disabled={showResult}
                                  className="w-full text-left px-5 py-4 rounded-xl border-2 transition-all flex items-center justify-between"
                                  style={{ borderColor, backgroundColor: bgColor }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ backgroundColor: `${optColor}15`, color: optColor }}>
                                      {String.fromCharCode(65 + idx)}
                                    </span>
                                    <div>
                                      <span className="font-semibold" style={{ color: "#3a3a6e" }}>{option.chinese}</span>
                                      <span className="text-xs ml-2 font-mono" style={{ color: "#3a3a6e", opacity: 0.5 }}>{option.dong}</span>
                                      <span className="text-xs ml-2 px-2 py-0.5 rounded-full" style={{ backgroundColor: `${optColor}10`, color: optColor }}>
                                        {option.toneCode}{option.syllableType === "促" ? "促" : ""}调
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
                              <div className={`p-4 rounded-xl mb-4 ${selectedAnswer !== null && q.options[selectedAnswer]?.id === q.targetWord.id ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                                <p className={`text-sm font-medium ${selectedAnswer !== null && q.options[selectedAnswer]?.id === q.targetWord.id ? "text-green-700" : "text-red-700"}`}>
                                  {selectedAnswer !== null && q.options[selectedAnswer]?.id === q.targetWord.id
                                    ? "回答正确！"
                                    : `回答错误。正确答案是「${target.chinese}」(${target.dong}，${target.toneCode}${target.syllableType === "促" ? "促" : ""}调)`}
                                </p>
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
          {/* ========== AI检测 ========== */}
          {activeTab === "ai-detect" && (
            <motion.div key="ai-detect" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              <AiToneDetect />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
