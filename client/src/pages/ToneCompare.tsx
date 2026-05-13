/*
 * 声调对比练习页面
 * 设计风格：青蓝雅致 - 靛蓝紫导航 + 米白宣纸质感内容区
 * 功能：声调分组词汇对比学习、声调曲线对比、真实录音播放、听辨测验
 * 所有词汇均来自终版调查字表（发音人：杨艳杰，榕江二中）
 */
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Trophy, Headphones, ChevronRight, RotateCcw, CheckCircle, XCircle, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiToneDetect from "@/components/AiToneDetect";
import {
  DONG_TONE_GROUPS,
  TONE_COLORS,
  playToneWord,
  stopCurrentAudio,
  getAudioPathForSpeaker,
  SPEAKERS,
  type ToneWord,
} from "@/lib/dongToneData";

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

// ========== 页面组件 ==========
type TabType = "quiz" | "ai-detect";

interface ToneCompareProps {
  embedded?: boolean;
}

export default function ToneCompare({ embedded = false }: ToneCompareProps = {}) {
  const [activeTab, setActiveTab] = useState<TabType>("quiz");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("yyj");
  const selectedSpeaker = SPEAKERS.find(s => s.id === selectedSpeakerId) || SPEAKERS[0];

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
    const audioPath = getAudioPathForSpeaker(word.audioPath, selectedSpeakerId);
    playToneWord(audioPath, () => setPlayingId(null));
  }, [playingId, selectedSpeakerId]);

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
    { id: "quiz", label: "听辨测验", icon: <Headphones className="w-4 h-4" /> },
    { id: "ai-detect", label: "AI检测", icon: <Mic className="w-4 h-4" /> },
  ];

  return (
    <div className={embedded ? "" : "min-h-screen flex flex-col"} style={{ backgroundColor: "#f8f6f2" }}>
      {!embedded && <Navbar />}

      {/* Hero区域 */}
      {!embedded && <section className="relative pt-24 pb-12 overflow-hidden" style={{ background: "linear-gradient(135deg, #3a3a6e 0%, #4a4a8e 50%, #5a5aae 100%)" }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 text-6xl text-white/20 font-serif">声</div>
          <div className="absolute top-12 right-12 text-5xl text-white/15 font-serif">调</div>
          <div className="absolute bottom-8 left-1/4 text-4xl text-white/10 font-serif">韵</div>
          <div className="absolute bottom-4 right-1/3 text-7xl text-white/8 font-serif">律</div>
        </div>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              侗语声调训练
            </h1>
            <p className="text-white/80 text-base md:text-lg max-w-2xl mx-auto mb-3">
              通过听辨测验和 AI 检测集中训练侗语声调识别与发音
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-white/50 mb-3">
              <span className="flex items-center gap-1"><Mic size={11} />当前发音人：{selectedSpeaker.name}</span>
              <span>·</span>
              <span>{selectedSpeaker.age}岁 · {selectedSpeaker.gender} · {selectedSpeaker.village} · {selectedSpeaker.school}</span>
              <span>·</span>
              <span>75个独立词汇录音</span>
            </div>
            {/* 发音人切换按鈕 */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {SPEAKERS.map(sp => (
                <button key={sp.id}
                  onClick={() => setSelectedSpeakerId(sp.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    sp.id === selectedSpeakerId
                      ? "bg-white/25 border-white/60 text-white"
                      : "bg-white/5 border-white/20 text-white/60 hover:bg-white/15"
                  }`}
                  title={`${sp.age}岁 · ${sp.gender} · ${sp.village} · ${sp.school}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${sp.id === selectedSpeakerId ? "bg-green-400" : "bg-white/30"}`} />
                  {sp.name}
                  {sp.id === selectedSpeakerId && <span className="text-green-300">✓</span>}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>}

      {/* 标签切换 */}
      <div className={embedded ? "border-b rounded-t-2xl" : "sticky top-[68px] z-30 border-b"} style={{ backgroundColor: "#f8f6f2", borderColor: "rgba(58,58,110,0.1)" }}>
        <div className="container">
          <div className="flex gap-1 py-2 overflow-x-auto">
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

      <main className={embedded ? "py-6" : "flex-1 container py-8"}>
        <AnimatePresence mode="wait">

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
                      <Button variant="outline" onClick={() => setActiveTab("ai-detect")} style={{ borderColor: "#3a3a6e40", color: "#3a3a6e" }}>
                        <Mic className="w-4 h-4 mr-2" />AI检测
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

      {!embedded && <Footer />}
    </div>
  );
}
