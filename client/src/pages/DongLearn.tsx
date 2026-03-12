/*
 * Design: 侗语学习页面
 * 课程列表 + 词汇分类浏览 + 闪卡学习 + 测验模式
 */
import { useState, useEffect, useMemo } from "react";
import { BookOpen, Volume2, Heart, ChevronRight, RotateCcw, CheckCircle, XCircle, Star } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  dongDictionary, dongLessons, categories,
  getProgress, saveProgress, markWordLearned, markLessonComplete, toggleFavorite, saveQuizScore,
  speakText, speakDong, getWordsByCategory, getDifficultyLabel, getDifficultyColor,
  type DongWord, type LearningProgress,
} from "@/lib/dongData";
import PronunciationDetail from "@/components/PronunciationDetail";
import { ToneBadge } from "@/components/ToneCurve";
import { MouthTip } from "@/components/MouthShape";

type ViewMode = "courses" | "dictionary" | "flashcard" | "quiz";

export default function DongLearn() {
  const [mode, setMode] = useState<ViewMode>("courses");
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [progress, setProgress] = useState<LearningProgress>(getProgress());
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [detailWord, setDetailWord] = useState<DongWord | null>(null);
  const [quizWords, setQuizWords] = useState<DongWord[]>([]);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  useEffect(() => { setProgress(getProgress()); }, []);

  const filteredWords = useMemo(() => {
    if (selectedCategory === "全部") return dongDictionary;
    return getWordsByCategory(selectedCategory);
  }, [selectedCategory]);

  const lessonWords = useMemo(() => {
    if (!selectedLesson) return [];
    const lesson = dongLessons.find((l) => l.id === selectedLesson);
    if (!lesson) return [];
    return dongDictionary.filter((w) => lesson.wordIds.includes(w.id));
  }, [selectedLesson]);

  const startQuiz = (words: DongWord[]) => {
    const shuffled = [...words].sort(() => Math.random() - 0.5).slice(0, Math.min(10, words.length));
    setQuizWords(shuffled);
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizFinished(false);
    setMode("quiz");
  };

  const handleQuizAnswer = (answer: string) => {
    const correct = quizWords[quizIndex].dong;
    setQuizAnswer(answer);
    if (answer === correct) {
      setQuizScore((s) => s + 1);
    }
    setTimeout(() => {
      if (quizIndex + 1 < quizWords.length) {
        setQuizIndex((i) => i + 1);
        setQuizAnswer(null);
      } else {
        setQuizFinished(true);
        if (selectedLesson) {
          const finalScore = Math.round(((quizScore + (answer === correct ? 1 : 0)) / quizWords.length) * 100);
          const p = saveQuizScore(selectedLesson, finalScore);
          if (finalScore >= 60) {
            markLessonComplete(selectedLesson);
          }
          setProgress(p);
        }
      }
    }, 1200);
  };

  const handleToggleFavorite = (wordId: string) => {
    const p = toggleFavorite(wordId);
    setProgress(p);
  };

  const handleLearnWord = (wordId: string) => {
    const p = markWordLearned(wordId);
    setProgress(p);
  };

  const getQuizOptions = (word: DongWord): string[] => {
    const correct = word.dong;
    const others = dongDictionary.filter((w) => w.dong !== correct).sort(() => Math.random() - 0.5).slice(0, 3).map((w) => w.dong);
    const options = [correct, ...others].sort(() => Math.random() - 0.5);
    return options;
  };

  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  useEffect(() => {
    if (mode === "quiz" && quizWords.length > 0 && quizIndex < quizWords.length) {
      setQuizOptions(getQuizOptions(quizWords[quizIndex]));
    }
  }, [mode, quizIndex, quizWords]);

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-serif text-dong-indigo font-bold">侗语学习</h2>
              <p className="text-sm text-dong-light mt-1">系统学习侗语词汇，掌握侗族语言之美</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["courses", "dictionary", "flashcard"] as ViewMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setSelectedLesson(null); }}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    mode === m ? "bg-dong-indigo text-white" : "bg-white text-dong-indigo border border-dong-indigo/20 hover:bg-dong-indigo/5"
                  }`}
                >
                  {m === "courses" ? "课程学习" : m === "dictionary" ? "词汇词典" : "闪卡练习"}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Mode */}
          {mode === "courses" && !selectedLesson && (
            <div className="grid md:grid-cols-2 gap-4">
              {dongLessons.map((lesson) => {
                const isCompleted = progress.completedLessons.includes(lesson.id);
                const score = progress.quizScores[lesson.id];
                return (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all cursor-pointer"
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                          {getDifficultyLabel(lesson.difficulty)}
                        </span>
                        <span className="text-xs text-dong-light">{lesson.wordIds.length} 个词汇</span>
                      </div>
                      {isCompleted && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    <h3 className="font-bold text-dong-indigo mb-1">{lesson.title}</h3>
                    <p className="text-sm text-dong-light">{lesson.description}</p>
                    {score !== undefined && (
                      <p className="text-xs text-dong-light mt-2">最高分: <span className="text-dong-rose font-bold">{score}分</span></p>
                    )}
                    <div className="flex items-center justify-end mt-3">
                      <span className="text-xs text-dong-rose flex items-center gap-1">
                        {isCompleted ? "复习" : "开始学习"} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lesson Detail */}
          {mode === "courses" && selectedLesson && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setSelectedLesson(null)} className="text-sm text-dong-light hover:text-dong-indigo flex items-center gap-1">
                  ← 返回课程列表
                </button>
                <Button onClick={() => startQuiz(lessonWords)} className="bg-dong-rose hover:bg-dong-rose/80 text-white text-sm">
                  开始测验
                </Button>
              </div>
              <h3 className="text-lg font-serif text-dong-indigo font-bold mb-4">
                {dongLessons.find((l) => l.id === selectedLesson)?.title}
              </h3>
              <div className="space-y-3">
                {lessonWords.map((word) => {
                  const isFav = progress.favorites.includes(word.id);
                  const isLearned = progress.learnedWords.includes(word.id);
                  return (
                    <div key={word.id} className="bg-white rounded-xl p-4 border border-dong-indigo/10 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-dong-indigo">{word.chinese}</span>
                            <span className="text-dong-rose font-medium text-base">{word.dong}</span>
                            {isLearned && <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full">已学</span>}
                          </div>
                          <div className="flex flex-wrap gap-x-4 text-xs text-dong-light">
                            <span>侗语音标: <span className="text-dong-indigo">{word.dongPinyin}</span></span>
                            <span>普通话拼音: <span className="text-dong-indigo">{word.mandarinPinyin}</span></span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <ToneBadge dongPinyin={word.dongPinyin} />
                            <button onClick={() => setDetailWord(word)} className="text-[10px] text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.5 rounded transition-colors">口型/声调</button>
                          </div>
                          {word.example && (
                            <p className="text-xs text-foreground/60 mt-1.5 bg-dong-cream/40 px-3 py-1.5 rounded-md inline-block">
                              例: {word.example} {word.exampleDong && <span className="text-dong-rose">({word.exampleDong})</span>}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <button onClick={() => speakDong(word.dong, word.dongPinyin)} className="p-1 text-dong-rose hover:text-dong-indigo transition-colors flex items-center gap-0.5 text-[10px]" title="侗语发音">
                            <Volume2 className="w-3.5 h-3.5" />侗
                          </button>
                          <button onClick={() => speakText(word.chinese)} className="p-1 text-dong-light hover:text-dong-indigo transition-colors flex items-center gap-0.5 text-[10px]" title="普通话发音">
                            <Volume2 className="w-3.5 h-3.5" />普
                          </button>
                          <button onClick={() => handleToggleFavorite(word.id)} className={`p-1.5 transition-colors ${isFav ? "text-dong-rose" : "text-dong-light hover:text-dong-rose"}`} title="收藏">
                            <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                          </button>
                          {!isLearned && (
                            <button onClick={() => { handleLearnWord(word.id); toast.success("已标记为已学习"); }} className="p-1.5 text-dong-light hover:text-green-600 transition-colors" title="标记已学">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dictionary Mode */}
          {mode === "dictionary" && (
            <div>
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setSelectedCategory("全部")}
                  className={`px-3 py-1.5 rounded-full text-xs transition-all ${selectedCategory === "全部" ? "bg-dong-indigo text-white" : "bg-white text-dong-indigo border border-dong-indigo/20 hover:bg-dong-indigo/5"}`}
                >
                  全部 ({dongDictionary.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.name}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-full text-xs transition-all ${selectedCategory === cat.name ? "bg-dong-indigo text-white" : "bg-white text-dong-indigo border border-dong-indigo/20 hover:bg-dong-indigo/5"}`}
                  >
                    {cat.icon} {cat.name}
                  </button>
                ))}
              </div>
              <div className="grid md:grid-cols-2 gap-3">
                {filteredWords.map((word) => {
                  const isFav = progress.favorites.includes(word.id);
                  return (
                    <div key={word.id} className="bg-white rounded-lg p-3.5 border border-dong-indigo/10 shadow-sm flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dong-indigo">{word.chinese}</span>
                          <span className="text-dong-rose text-sm">{word.dong}</span>
                        </div>
                        <p className="text-xs text-dong-light mt-0.5">{word.dongPinyin} | {word.mandarinPinyin}</p>
                        <ToneBadge dongPinyin={word.dongPinyin} className="mt-0.5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => speakDong(word.dong, word.dongPinyin)} className="p-1 text-dong-rose hover:text-dong-indigo text-[10px] flex items-center gap-0.5" title="侗语"><Volume2 className="w-3.5 h-3.5" />侗</button>
                        <button onClick={() => speakText(word.chinese)} className="p-1 text-dong-light hover:text-dong-indigo text-[10px] flex items-center gap-0.5" title="普通话"><Volume2 className="w-3.5 h-3.5" />普</button>
                        <button onClick={() => setDetailWord(word)} className="p-1 text-amber-600 hover:text-amber-700 text-[10px] bg-amber-50 rounded" title="发音详情">口型</button>
                        <button onClick={() => handleToggleFavorite(word.id)} className={`p-1 ${isFav ? "text-dong-rose" : "text-dong-light hover:text-dong-rose"}`}>
                          <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Flashcard Mode */}
          {mode === "flashcard" && (
            <div className="max-w-[500px] mx-auto">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-dong-light">{flashcardIndex + 1} / {filteredWords.length}</p>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => { setSelectedCategory(e.target.value); setFlashcardIndex(0); setFlashcardFlipped(false); }}
                    className="text-xs border border-dong-indigo/20 rounded-md px-2 py-1 bg-white"
                  >
                    <option value="全部">全部分类</option>
                    {categories.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              {filteredWords.length > 0 && (
                <>
                  <div
                    className="bg-white rounded-2xl shadow-lg border border-dong-indigo/10 p-8 min-h-[280px] flex flex-col items-center justify-center cursor-pointer transition-all hover:shadow-xl"
                    onClick={() => {
                      setFlashcardFlipped(!flashcardFlipped);
                      if (!flashcardFlipped) handleLearnWord(filteredWords[flashcardIndex].id);
                    }}
                  >
                    {!flashcardFlipped ? (
                      <>
                        <p className="text-4xl font-bold text-dong-indigo mb-4">{filteredWords[flashcardIndex].chinese}</p>
                        <p className="text-sm text-dong-light">点击翻转查看侗语</p>
                      </>
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-dong-rose mb-2">{filteredWords[flashcardIndex].dong}</p>
                        <p className="text-lg text-dong-indigo mb-1">{filteredWords[flashcardIndex].chinese}</p>
                        <p className="text-sm text-dong-light">{filteredWords[flashcardIndex].dongPinyin}</p>
                        {filteredWords[flashcardIndex].example && (
                          <p className="text-xs text-foreground/60 mt-3 bg-dong-cream/40 px-3 py-1.5 rounded-md">
                            例: {filteredWords[flashcardIndex].example}
                          </p>
                        )}
                        <div className="flex items-center gap-3 mt-3">
                          <button onClick={(e) => { e.stopPropagation(); speakDong(filteredWords[flashcardIndex].dong, filteredWords[flashcardIndex].dongPinyin); }} className="text-dong-rose hover:text-dong-indigo flex items-center gap-1 text-xs">
                            <Volume2 className="w-4 h-4" /> 侗语发音
                          </button>
                          <button onClick={(e) => { e.stopPropagation(); speakText(filteredWords[flashcardIndex].chinese); }} className="text-dong-light hover:text-dong-indigo flex items-center gap-1 text-xs">
                            <Volume2 className="w-4 h-4" /> 普通话
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-center gap-4 mt-6">
                    <Button
                      onClick={() => { setFlashcardIndex(Math.max(0, flashcardIndex - 1)); setFlashcardFlipped(false); }}
                      disabled={flashcardIndex === 0}
                      variant="outline" className="border-dong-indigo/20"
                    >
                      上一个
                    </Button>
                    <Button
                      onClick={() => { setFlashcardIndex(Math.min(filteredWords.length - 1, flashcardIndex + 1)); setFlashcardFlipped(false); }}
                      disabled={flashcardIndex >= filteredWords.length - 1}
                      className="bg-dong-indigo hover:bg-dong-deep text-white"
                    >
                      下一个
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Quiz Mode */}
          {mode === "quiz" && (
            <div className="max-w-[600px] mx-auto">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-dong-light">第 {quizIndex + 1} / {quizWords.length} 题</p>
                    <p className="text-sm text-dong-rose font-bold">得分: {quizScore}</p>
                  </div>
                  <div className="w-full bg-dong-cream rounded-full h-2 mb-6">
                    <div className="bg-dong-indigo h-2 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / quizWords.length) * 100}%` }} />
                  </div>

                  <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center mb-6">
                    <p className="text-sm text-dong-light mb-2">请选择以下中文对应的侗语：</p>
                    <p className="text-3xl font-bold text-dong-indigo">{quizWords[quizIndex].chinese}</p>
                    <p className="text-sm text-dong-light mt-1">{quizWords[quizIndex].mandarinPinyin}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {quizOptions.map((opt) => {
                      const isCorrect = opt === quizWords[quizIndex].dong;
                      const isSelected = quizAnswer === opt;
                      let btnClass = "bg-white border border-dong-indigo/15 text-dong-indigo hover:bg-dong-indigo/5";
                      if (quizAnswer) {
                        if (isCorrect) btnClass = "bg-green-50 border-green-300 text-green-700";
                        else if (isSelected && !isCorrect) btnClass = "bg-red-50 border-red-300 text-red-700";
                      }
                      return (
                        <button
                          key={opt}
                          onClick={() => !quizAnswer && handleQuizAnswer(opt)}
                          disabled={!!quizAnswer}
                          className={`rounded-xl p-4 text-center transition-all ${btnClass} disabled:cursor-default`}
                        >
                          <span className="font-medium">{opt}</span>
                          {quizAnswer && isCorrect && <CheckCircle className="w-4 h-4 inline ml-2 text-green-600" />}
                          {quizAnswer && isSelected && !isCorrect && <XCircle className="w-4 h-4 inline ml-2 text-red-600" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center">
                  <Star className="w-12 h-12 text-dong-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-2">测验完成！</h3>
                  <p className="text-4xl font-bold text-dong-rose mb-2">
                    {Math.round((quizScore / quizWords.length) * 100)}分
                  </p>
                  <p className="text-sm text-dong-light mb-6">
                    答对 {quizScore} / {quizWords.length} 题
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Button onClick={() => startQuiz(quizWords)} variant="outline" className="border-dong-indigo/20">
                      <RotateCcw className="w-4 h-4 mr-1" /> 重新测验
                    </Button>
                    <Button onClick={() => { setMode("courses"); setSelectedLesson(null); }} className="bg-dong-indigo hover:bg-dong-deep text-white">
                      返回课程
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
      {detailWord && <PronunciationDetail word={detailWord} onClose={() => setDetailWord(null)} />}
    </div>
  );
}
