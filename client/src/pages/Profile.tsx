/*
 * 个人中心页面
 * - 邮箱登录（展示用）
 * - 传授者 / 学习者 身份切换
 * - 学习数据概览 + 收藏词汇 + 学习历史 + 成就系统
 * - IP形象头像
 */
import { useState, useEffect, useMemo } from "react";
import { Link } from "wouter";
import {
  Heart, BookOpen, Star, TrendingUp, Volume2, Trash2, Award, Target, Flame,
  Mail, Lock, LogOut, Mic, CheckCircle, Edit3, Users, UserCircle2
} from "lucide-react";
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
type Role = "learner" | "teacher";

const BASE = import.meta.env.BASE_URL || "";

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

// 传授者贡献数据（展示用）
const TEACHER_CONTRIBUTIONS = [
  { title: "上传录音：bal（55调）", time: "今天 09:10", status: "已审核", ok: true },
  { title: "新增词汇：侗语日常用语 × 5", time: "昨天 16:30", status: "审核中", ok: false },
  { title: "上传录音：jaix（31调）", time: "3天前", status: "已审核", ok: true },
  { title: "补充释义：家庭称谓词组", time: "5天前", status: "已审核", ok: true },
];

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("dong-profile-loggedin") === "1";
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [userName, setUserName] = useState(() => localStorage.getItem("dong-profile-name") || "");
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem("dong-profile-email") || "");
  const [role, setRole] = useState<Role>(() => (localStorage.getItem("dong-profile-role") as Role) || "learner");
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [progress, setProgress] = useState<LearningProgress>(getProgress());
  const [detailWord, setDetailWord] = useState<DongWord | null>(null);

  useEffect(() => { setProgress(getProgress()); }, []);

  const favoriteWords = useMemo(() => dongDictionary.filter((w) => progress.favorites.includes(w.id)), [progress.favorites]);
  const learnedWords = useMemo(() => dongDictionary.filter((w) => progress.learnedWords.includes(w.id)), [progress.learnedWords]);
  const completedLessonsList = useMemo(() => dongLessons.filter((l) => progress.completedLessons.includes(l.id)), [progress.completedLessons]);
  const unlockedAchievements = achievements.filter((a) => a.condition(progress));

  const handleLogin = (e: React.FormEvent, asGuest = false) => {
    e.preventDefault();
    if (!asGuest) {
      if (!loginEmail.includes("@")) { setLoginError("请输入有效的邮箱地址"); return; }
      if (loginPassword.length < 6) { setLoginError("密码至少6位"); return; }
    }
    const name = asGuest ? "游客用户" : loginEmail.split("@")[0];
    const email = asGuest ? "guest@dongscape.com" : loginEmail;
    setUserName(name); setUserEmail(email);
    localStorage.setItem("dong-profile-loggedin", "1");
    localStorage.setItem("dong-profile-name", name);
    localStorage.setItem("dong-profile-email", email);
    setIsLoggedIn(true); setLoginError("");
    toast.success(asGuest ? "已以游客身份进入" : "登录成功，欢迎回来！");
  };

  const handleLogout = () => {
    localStorage.removeItem("dong-profile-loggedin");
    setIsLoggedIn(false);
    toast.success("已退出登录");
  };

  const handleRoleSwitch = (r: Role) => {
    setRole(r);
    localStorage.setItem("dong-profile-role", r);
    toast.success(r === "teacher" ? "已切换为传授者身份" : "已切换为学习者身份");
  };

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

  // ── 未登录：显示登录页 ──────────────────────────────────────────
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-dong-cream flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {/* IP形象 */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-dong-rose/30 shadow-lg bg-white flex items-center justify-center">
                <img
                  src={`${BASE}ip-happy.png`}
                  alt="IP形象"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
                <UserCircle2 className="w-14 h-14 text-dong-rose/40" style={{ display: "none" }} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-dong-indigo/10 p-8">
              <h2 className="text-2xl font-serif font-bold text-dong-indigo text-center mb-1">欢迎回来</h2>
              <p className="text-sm text-dong-light text-center mb-7">登录以保存您的学习进度</p>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dong-light" />
                  <input type="email" placeholder="邮箱地址" value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-dong-indigo/20 rounded-xl text-sm focus:outline-none focus:border-dong-rose/50 bg-dong-cream/30" />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dong-light" />
                  <input type="password" placeholder="密码（至少6位）" value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-dong-indigo/20 rounded-xl text-sm focus:outline-none focus:border-dong-rose/50 bg-dong-cream/30" />
                </div>
                {loginError && <p className="text-xs text-red-500 text-center">{loginError}</p>}
                <button type="submit"
                  className="w-full bg-dong-rose text-white py-3 rounded-xl font-medium text-sm hover:bg-dong-rose/90 transition-colors shadow-sm">
                  登录 / 注册
                </button>
              </form>

              <div className="mt-4 text-center text-xs text-dong-light">
                首次使用该邮箱即自动注册账号
              </div>

              <div className="mt-5 pt-4 border-t border-dong-indigo/10">
                <p className="text-xs text-dong-light text-center mb-3">或者先体验功能</p>
                <button
                  onClick={(e) => handleLogin(e as any, true)}
                  className="w-full border border-dong-indigo/20 text-dong-indigo py-2.5 rounded-xl text-sm hover:bg-dong-cream/50 transition-colors">
                  以游客身份继续
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── 已登录：个人中心 ────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />

      <section className="py-8 px-4">
        <div className="max-w-[1100px] mx-auto">

          {/* ── 头部：头像 + 信息 + 身份切换 ── */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-dong-indigo/10 shadow-sm mb-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* 头像 */}
              <div className="relative flex-shrink-0 mx-auto md:mx-0">
                <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-dong-rose/20 shadow-md bg-dong-cream flex items-center justify-center">
                  <img src={`${BASE}ip-happy.png`} alt="头像"
                    className="w-full h-full object-cover"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  <UserCircle2 className="w-12 h-12 text-dong-rose/30" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow ${role === "teacher" ? "bg-dong-indigo" : "bg-dong-rose"}`}>
                  {role === "teacher" ? "传" : "学"}
                </div>
              </div>

              {/* 信息 */}
              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  {editingName ? (
                    <input value={tempName} onChange={(e) => setTempName(e.target.value)}
                      onBlur={() => { setUserName(tempName); localStorage.setItem("dong-profile-name", tempName); setEditingName(false); }}
                      onKeyDown={(e) => { if (e.key === "Enter") { setUserName(tempName); localStorage.setItem("dong-profile-name", tempName); setEditingName(false); } }}
                      className="text-xl font-bold text-dong-indigo border-b border-dong-rose/50 focus:outline-none bg-transparent" autoFocus />
                  ) : (
                    <h2 className="text-xl font-bold text-dong-indigo">{userName}</h2>
                  )}
                  <button onClick={() => { setTempName(userName); setEditingName(true); }} className="text-dong-light hover:text-dong-rose transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-dong-light mb-1">{userEmail}</p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-2 text-xs text-dong-light">
                  <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> 连续学习 {progress.streak} 天</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5 text-dong-indigo" /> 已学 {progress.learnedWords.length} 词汇</span>
                  <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-dong-gold" /> {progress.completedLessons.length} 节课程</span>
                  <span className="flex items-center gap-1"><Award className="w-3.5 h-3.5 text-dong-rose" /> {unlockedAchievements.length} 个成就</span>
                </div>
              </div>

              {/* 退出 */}
              <button onClick={handleLogout} className="text-dong-light hover:text-dong-rose transition-colors flex items-center gap-1 text-xs mt-2 md:mt-0 mx-auto md:mx-0">
                <LogOut className="w-4 h-4" />退出
              </button>
            </div>

            {/* 身份切换 */}
            <div className="mt-6 pt-5 border-t border-dong-indigo/10">
              <p className="text-xs font-medium text-dong-light mb-3">我的身份</p>
              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => handleRoleSwitch("learner")}
                  className={`relative rounded-xl p-4 border-2 transition-all text-left ${role === "learner" ? "border-dong-rose bg-dong-rose/5 shadow-sm" : "border-dong-indigo/10 hover:border-dong-rose/30"}`}>
                  {role === "learner" && <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-dong-rose" />}
                  <BookOpen className={`w-5 h-5 mb-2 ${role === "learner" ? "text-dong-rose" : "text-dong-light"}`} />
                  <p className={`font-semibold text-sm ${role === "learner" ? "text-dong-rose" : "text-dong-indigo"}`}>学习者</p>
                  <p className="text-xs text-dong-light mt-0.5">学习侗语与普通话，提升发音能力</p>
                </button>
                <button onClick={() => handleRoleSwitch("teacher")}
                  className={`relative rounded-xl p-4 border-2 transition-all text-left ${role === "teacher" ? "border-dong-indigo bg-dong-indigo/5 shadow-sm" : "border-dong-indigo/10 hover:border-dong-indigo/30"}`}>
                  {role === "teacher" && <CheckCircle className="absolute top-3 right-3 w-4 h-4 text-dong-indigo" />}
                  <Mic className={`w-5 h-5 mb-2 ${role === "teacher" ? "text-dong-indigo" : "text-dong-light"}`} />
                  <p className={`font-semibold text-sm ${role === "teacher" ? "text-dong-indigo" : "text-dong-indigo"}`}>传授者</p>
                  <p className="text-xs text-dong-light mt-0.5">贡献录音与词汇，传承侗语文化</p>
                </button>
              </div>
              {role === "teacher" && (
                <div className="mt-3 bg-dong-indigo/5 rounded-xl p-3 border border-dong-indigo/10">
                  <p className="text-xs text-dong-indigo font-medium mb-1">传授者说明</p>
                  <p className="text-xs text-dong-light">作为传授者，您可以上传侗语录音、补充词汇释义，帮助更多人学习侗语。您的贡献将在审核后展示在平台上，让知识在传授中生长。</p>
                </div>
              )}
            </div>
          </div>

          {/* ── 传授者贡献记录 ── */}
          {role === "teacher" && (
            <div className="bg-white rounded-2xl p-6 border border-dong-indigo/10 shadow-sm mb-6">
              <h3 className="font-semibold text-dong-indigo mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 text-dong-rose" />贡献记录
              </h3>
              <div className="space-y-3">
                {TEACHER_CONTRIBUTIONS.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-2.5 border-b border-dong-indigo/5 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.ok ? "bg-green-400" : "bg-yellow-400"}`} />
                      <div>
                        <p className="text-sm text-dong-indigo font-medium">{item.title}</p>
                        <p className="text-xs text-dong-light">{item.time}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.ok ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-dong-indigo/10">
                <button className="w-full text-center text-sm text-dong-rose hover:text-dong-indigo transition-colors py-2 border border-dong-rose/30 rounded-xl hover:border-dong-indigo/30">
                  + 上传新录音
                </button>
              </div>
            </div>
          )}

          {/* ── Tabs（学习者专属） ── */}
          <div className="flex gap-1 mb-6 bg-white rounded-xl p-1 border border-dong-indigo/10 shadow-sm">
            {tabs.map((t) => (
              <button key={t.key} onClick={() => setTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all ${
                  tab === t.key ? "bg-dong-indigo text-white shadow-sm" : "text-dong-light hover:text-dong-indigo hover:bg-dong-cream/50"
                }`}>
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

              {Object.keys(progress.quizScores).length > 0 && (
                <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                  <h3 className="font-serif text-dong-indigo font-bold mb-4">测验成绩</h3>
                  <div className="space-y-3">
                    {Object.entries(progress.quizScores).map(([lessonId, score]) => {
                      const lesson = dongLessons.find((l) => l.id === lessonId);
                      return (
                        <div key={lessonId} className="flex items-center justify-between bg-dong-cream/30 rounded-lg p-3">
                          <span className="text-sm text-dong-indigo font-medium">{lesson?.title || lessonId}</span>
                          <span className={`font-bold ${score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600"}`}>{score}分</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid md:grid-cols-3 gap-4">
                <Link href="/dong-learn" className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all block">
                  <BookOpen className="w-6 h-6 text-dong-indigo mb-2" />
                  <h3 className="font-bold text-dong-indigo text-sm">继续侗语学习</h3>
                  <p className="text-xs text-dong-light mt-1">系统学习侗语词汇和课程</p>
                </Link>
                <Link href="/tone-compare" className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all block">
                  <Star className="w-6 h-6 text-dong-rose mb-2" />
                  <h3 className="font-bold text-dong-indigo text-sm">声调练习</h3>
                  <p className="text-xs text-dong-light mt-1">AI检测声调，精准纠音</p>
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
                    <Button className="mt-4 bg-dong-indigo hover:bg-dong-deep text-white text-sm">去学习收藏</Button>
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
                  <div key={ach.id} className={`rounded-xl p-5 border shadow-sm transition-all ${unlocked ? "bg-white border-dong-gold/30" : "bg-white/60 border-dong-indigo/5 opacity-60"}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${unlocked ? "bg-dong-gold/10 text-dong-gold" : "bg-gray-100 text-gray-400"}`}>
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
