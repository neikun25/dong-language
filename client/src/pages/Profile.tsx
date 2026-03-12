/*
 * Design: 个人中心页面
 * 学习数据概览 + 收藏词汇 + 学习历史 + 成就系统
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import { Heart, BookOpen, Star, TrendingUp, Volume2, Trash2, Award, Target, Flame } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  dongDictionary, dongLessons,
  getProgress, toggleFavorite, speakText, speakDong,
  type LearningProgress, type DongWord,
} from "@/lib/dongData";
import PronunciationDetail from "@/components/PronunciationDetail";
import { ToneBadge } from "@/components/ToneCurve";

type Tab = "overview" | "favorites" | "history" | "achievements";

// detailWord state is declared inside the component below

const achievements = [
  { id: "first_word", title: "初识侗语", desc: "学习第一个侗语词汇", icon: BookOpen, condition: (p: LearningProgress) => p.learnedWords.length >= 1 },
  { id: "ten_words", title: "小有所成", desc: "学习10个侗语词汇", icon: Star, condition: (p: LearningProgress) => p.learnedWords.length >= 10 },
  { id: "thirty_words", title: "词汇达人", desc: "学习30个侗语词汇", icon: Award, condition: (p: LearningProgress) => p.learnedWords.length >= 30 },
  { id: "first_lesson", title: "课程起步", desc: "完成第一节课程", icon: Target, condition: (p: LearningProgress) => p.completedLessons.length >= 1 },
  { id: "five_lessons", title: "学海无涯", desc: "完成5节课程", icon: TrendingUp, condition: (p: LearningProgress) => p.completedLessons.length >= 5 },
  { id: "first_fav", title: "收藏家", desc: "收藏第一个词汇", icon: Heart, condition: (p: LearningProgress) => p.favorites.length >= 1 },
  { id: "streak_3", title: "坚持不懈", desc: "连续学习3天", icon: Flame, condition: (p: LearningProgress) => p.streak >= 3 },
  { id: "streak_7", title: "一周达人", desc: "连续学习7天", icon: Flame, condition: (p: LearningProgress) => p.streak >= 7 },
];

export default function Profile() {
  const [tab, setTab] = useState<Tab>("overview");
  const [progress, setProgress] = useState<LearningProgress>(getProgress());
  const [detailWord, setDetailWord] = useState<DongWord | null>(null);

  useEffect(() => { setProgress(getProgress()); }, []);

  const favoriteWords = useMemo(() => {
    return dongDictionary.filter((w) => progress.favorites.includes(w.id));
  }, [progress.favorites]);

  const learnedWords = useMemo(() => {
    return dongDictionary.filter((w) => progress.learnedWords.includes(w.id));
  }, [progress.learnedWords]);

  const completedLessonsList = useMemo(() => {
    return dongLessons.filter((l) => progress.completedLessons.includes(l.id));
  }, [progress.completedLessons]);

  const unlockedAchievements = achievements.filter((a) => a.condition(progress));

  const handleRemoveFavorite = (wordId: string) => {
    const p = toggleFavorite(wordId);
    setProgress(p);
    toast.success("已取消收藏");
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: "overview", label: "学习概览", icon: TrendingUp },
    { key: "favorites", label: "我的收藏", icon: Heart },
    { key: "history", label: "学习记录", icon: BookOpen },
    { key: "achievements", label: "成就", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Profile Header */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-dong-indigo/10 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 rounded-full bg-dong-indigo/10 flex items-center justify-center border-2 border-dong-indigo/20">
                <span className="text-3xl font-serif text-dong-indigo font-bold">学</span>
              </div>
              <div className="text-center md:text-left flex-1">
                <h2 className="text-2xl font-serif text-dong-indigo font-bold">学习者</h2>
                <p className="text-sm text-dong-light mt-1">侗族语言文化学习之旅</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-3 text-xs text-dong-light">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> 连续学习 {progress.streak} 天</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-dong-indigo" /> 已学 {progress.learnedWords.length} 词汇</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-dong-gold" /> {progress.completedLessons.length} 节课程</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-dong-rose" /> {unlockedAchievements.length} 个成就</span>
                </div>
              </div>
              <Link href="/dong-learn">
                <Button className="bg-dong-indigo hover:bg-dong-deep text-white">
                  继续学习
                </Button>
              </Link>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-dong-indigo/10 shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all ${
                  tab === t.key ? "bg-dong-indigo text-white shadow-sm" : "text-dong-light hover:text-dong-indigo hover:bg-dong-cream/50"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {tab === "overview" && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                  <p className="text-xs text-dong-light mb-1">已学词汇</p>
                  <p className="text-3xl font-bold text-dong-indigo">{progress.learnedWords.length}</p>
                  <div className="w-full bg-dong-cream rounded-full h-1.5 mt-2">
                    <div className="bg-dong-indigo h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (progress.learnedWords.length / dongDictionary.length) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-dong-light mt-1">共 {dongDictionary.length} 个</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                  <p className="text-xs text-dong-light mb-1">已完成课程</p>
                  <p className="text-3xl font-bold text-dong-rose">{progress.completedLessons.length}</p>
                  <div className="w-full bg-dong-cream rounded-full h-1.5 mt-2">
                    <div className="bg-dong-rose h-1.5 rounded-full transition-all" style={{ width: `${Math.min(100, (progress.completedLessons.length / dongLessons.length) * 100)}%` }} />
                  </div>
                  <p className="text-[10px] text-dong-light mt-1">共 {dongLessons.length} 节</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                  <p className="text-xs text-dong-light mb-1">收藏词汇</p>
                  <p className="text-3xl font-bold text-dong-gold">{progress.favorites.length}</p>
                  <p className="text-[10px] text-dong-light mt-3">随时复习</p>
                </div>
                <div className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                  <p className="text-xs text-dong-light mb-1">测验最高分</p>
                  <p className="text-3xl font-bold text-green-600">
                    {Object.values(progress.quizScores).length > 0 ? Math.max(...Object.values(progress.quizScores)) : 0}
                  </p>
                  <p className="text-[10px] text-dong-light mt-3">继续努力</p>
                </div>
              </div>

              {/* Quiz Scores */}
              {Object.keys(progress.quizScores).length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                  <h3 className="font-serif text-dong-indigo font-bold mb-4">测验成绩</h3>
                  <div className="space-y-3">
                    {Object.entries(progress.quizScores).map(([lessonId, score]) => {
                      const lesson = dongLessons.find((l) => l.id === lessonId);
                      return (
                        <div key={lessonId} className="flex items-center justify-between bg-dong-cream/30 rounded-lg p-3">
                          <span className="text-sm text-dong-indigo font-medium">{lesson?.title || lessonId}</span>
                          <span className={`font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}>
                            {score}分
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/dong-learn" className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all block">
                  <BookOpen className="w-6 h-6 text-dong-indigo mb-2" />
                  <h3 className="font-bold text-dong-indigo text-sm">继续侗语学习</h3>
                  <p className="text-xs text-dong-light mt-1">系统学习侗语词汇和课程</p>
                </Link>
                <Link href="/pronunciation" className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all block">
                  <Star className="w-6 h-6 text-dong-rose mb-2" />
                  <h3 className="font-bold text-dong-indigo text-sm">侗语发音练习</h3>
                  <p className="text-xs text-dong-light mt-1">录音评分，纠正发音</p>
                </Link>
                <Link href="/mandarin-learn" className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all block">
                  <TrendingUp className="w-6 h-6 text-dong-gold mb-2" />
                  <h3 className="font-bold text-dong-indigo text-sm">普通话提升</h3>
                  <p className="text-xs text-dong-light mt-1">针对性训练普通话发音</p>
                </Link>
              </div>
            </div>
          )}

          {/* Favorites Tab */}
          {tab === "favorites" && (
            <div>
              {favoriteWords.length === 0 ? (
                <div className="bg-white rounded-xl p-10 border border-dong-indigo/10 text-center">
                  <Heart className="w-10 h-10 text-dong-light/30 mx-auto mb-3" />
                  <p className="text-dong-light">还没有收藏词汇</p>
                  <Link href="/dong-learn">
                    <Button className="mt-4 bg-dong-indigo hover:bg-dong-deep text-white text-sm">
                      去学习收藏
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {favoriteWords.map((word) => (
                    <div key={word.id} className="bg-white rounded-lg p-4 border border-dong-indigo/10 shadow-sm flex items-center justify-between">
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
                        <button onClick={() => handleRemoveFavorite(word.id)} className="p-1.5 text-dong-light hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* History Tab */}
          {tab === "history" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                <h3 className="font-serif text-dong-indigo font-bold mb-4">已学词汇 ({learnedWords.length})</h3>
                {learnedWords.length === 0 ? (
                  <p className="text-dong-light text-sm text-center py-4">还没有学习记录</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {learnedWords.map((w) => (
                      <span key={w.id} className="px-3 py-1.5 bg-dong-cream/50 rounded-full text-xs text-dong-indigo border border-dong-indigo/10">
                        {w.chinese} ({w.dong})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                <h3 className="font-serif text-dong-indigo font-bold mb-4">已完成课程 ({completedLessonsList.length})</h3>
                {completedLessonsList.length === 0 ? (
                  <p className="text-dong-light text-sm text-center py-4">还没有完成任何课程</p>
                ) : (
                  <div className="space-y-2">
                    {completedLessonsList.map((l) => (
                      <div key={l.id} className="flex items-center justify-between bg-dong-cream/30 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <span className="text-green-500"><BookOpen className="w-4 h-4" /></span>
                          <span className="text-sm text-dong-indigo font-medium">{l.title}</span>
                        </div>
                        {progress.quizScores[l.id] && (
                          <span className="text-xs text-dong-rose font-bold">{progress.quizScores[l.id]}分</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {tab === "achievements" && (
            <div className="grid md:grid-cols-2 gap-4">
              {achievements.map((ach) => {
                const unlocked = ach.condition(progress);
                return (
                  <div key={ach.id} className={`rounded-xl p-5 border shadow-sm transition-all ${
                    unlocked ? "bg-white border-dong-gold/30" : "bg-white/60 border-dong-indigo/5 opacity-60"
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        unlocked ? "bg-dong-gold/10 text-dong-gold" : "bg-gray-100 text-gray-400"
                      }`}>
                        <ach.icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${unlocked ? "text-dong-indigo" : "text-gray-400"}`}>{ach.title}</h4>
                        <p className="text-xs text-dong-light">{ach.desc}</p>
                      </div>
                      {unlocked && <span className="ml-auto text-dong-gold text-xs font-bold">已解锁</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
      {detailWord && <PronunciationDetail word={detailWord} onClose={() => setDetailWord(null)} />}
    </div>
  );
}
