/*
 * 普通话学习页面（含发音练习）
 * 针对侗族母语者的普通话学习课程
 * 课程列表 + 发音练习 + 声调训练 + 互动纠音
 */
import { useState, useRef, useCallback } from "react";
import { Volume2, Play, CheckCircle, ChevronRight, BookOpen, Mic, Square, RotateCcw, AlertCircle, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { speakText } from "@/lib/dongData";

interface MandarinLesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  items: { chinese: string; pinyin: string; dongEquiv: string; tips: string }[];
}

const mandarinLessons: MandarinLesson[] = [
  {
    id: "m1", title: "声母发音", description: "学习普通话21个声母的正确发音", difficulty: 1,
    items: [
      { chinese: "波", pinyin: "bō", dongEquiv: "类似侗语b-", tips: "双唇不送气清塞音，嘴唇轻轻合拢后打开" },
      { chinese: "坡", pinyin: "pō", dongEquiv: "类似侗语p-", tips: "双唇送气清塞音，比'b'多一股气流" },
      { chinese: "摸", pinyin: "mō", dongEquiv: "类似侗语m-", tips: "双唇鼻音，气流从鼻腔出" },
      { chinese: "佛", pinyin: "fó", dongEquiv: "侗语无对应", tips: "上齿咬下唇，气流从缝隙出" },
      { chinese: "得", pinyin: "dé", dongEquiv: "类似侗语d-", tips: "舌尖抵住上齿龈，不送气" },
      { chinese: "特", pinyin: "tè", dongEquiv: "类似侗语t-", tips: "舌尖抵住上齿龈，送气" },
    ],
  },
  {
    id: "m2", title: "韵母发音", description: "学习普通话单韵母和复韵母", difficulty: 1,
    items: [
      { chinese: "啊", pinyin: "ā", dongEquiv: "类似侗语a", tips: "嘴巴张大，舌头放平" },
      { chinese: "哦", pinyin: "ō", dongEquiv: "类似侗语o", tips: "嘴唇圆拢，舌头后缩" },
      { chinese: "鹅", pinyin: "é", dongEquiv: "类似侗语e", tips: "嘴半开半合，舌头居中" },
      { chinese: "衣", pinyin: "yī", dongEquiv: "类似侗语i", tips: "嘴唇扁平，舌尖抵下齿" },
      { chinese: "乌", pinyin: "wū", dongEquiv: "类似侗语u", tips: "嘴唇圆拢突出" },
      { chinese: "鱼", pinyin: "yú", dongEquiv: "侗语无对应", tips: "嘴唇圆拢，舌尖抵下齿" },
    ],
  },
  {
    id: "m3", title: "四声练习", description: "掌握普通话四个声调的发音规律", difficulty: 2,
    items: [
      { chinese: "妈", pinyin: "mā (一声)", dongEquiv: "类似侗语高平调", tips: "高而平，保持不变，像唱歌的高音" },
      { chinese: "麻", pinyin: "má (二声)", dongEquiv: "类似侗语中升调", tips: "从中音升到高音，像疑问语气" },
      { chinese: "马", pinyin: "mǎ (三声)", dongEquiv: "侗语无完全对应", tips: "先降后升(214)，注意降到最低再升" },
      { chinese: "骂", pinyin: "mà (四声)", dongEquiv: "类似侗语高降调", tips: "从高音快速降到低音，干脆利落" },
      { chinese: "吗", pinyin: "ma (轻声)", dongEquiv: "侗语无对应", tips: "轻而短，不要用力，跟在前一个字后面" },
    ],
  },
  {
    id: "m4", title: "翘舌音训练", description: "区分平舌音和翘舌音（侗族母语者难点）", difficulty: 3,
    items: [
      { chinese: "知/资", pinyin: "zhī / zī", dongEquiv: "侗语无翘舌", tips: "zh: 舌尖翘起抵硬腭前部；z: 舌尖抵上齿背" },
      { chinese: "吃/次", pinyin: "chī / cì", dongEquiv: "侗语无翘舌", tips: "ch: 舌尖翘起送气；c: 舌尖抵齿背送气" },
      { chinese: "诗/思", pinyin: "shī / sī", dongEquiv: "侗语无翘舌", tips: "sh: 舌尖翘起，气流从舌面出；s: 舌尖抵齿背" },
      { chinese: "日", pinyin: "rì", dongEquiv: "侗语无对应", tips: "舌尖翘起接近硬腭，声带振动" },
    ],
  },
  {
    id: "m5", title: "前后鼻音", description: "区分前鼻音(-n)和后鼻音(-ng)", difficulty: 3,
    items: [
      { chinese: "烟/央", pinyin: "yān / yāng", dongEquiv: "侗语有-n和-ng", tips: "-n: 舌尖抵上齿龈；-ng: 舌根抵软腭" },
      { chinese: "民/明", pinyin: "mín / míng", dongEquiv: "侗语有类似区分", tips: "注意结尾舌位不同" },
      { chinese: "真/争", pinyin: "zhēn / zhēng", dongEquiv: "注意侗语对应", tips: "-n结尾嘴可以闭合；-ng结尾嘴保持张开" },
      { chinese: "因/英", pinyin: "yīn / yīng", dongEquiv: "侗语有类似", tips: "多听多练，注意韵尾的区别" },
    ],
  },
];

// ===== 普通话纠音数据 =====
const mandarinPronData: Record<string, { pinyin: string; commonErrors: string[]; tips: string[]; focusPoints: string[] }> = {
  "知道": { pinyin: "zhī dào", commonErrors: ["zh发成z", "声调不准"], tips: ["舌尖翘起抵住硬腭前部", "第一声保持高平，第四声快速下降"], focusPoints: ["翘舌音zh", "一声+四声组合"] },
  "吃饭": { pinyin: "chī fàn", commonErrors: ["ch发成c", "f发音不清"], tips: ["ch需要舌尖翘起并送气", "f上齿咬下唇"], focusPoints: ["翘舌音ch", "唇齿音f"] },
  "说话": { pinyin: "shuō huà", commonErrors: ["sh发成s", "uo韵母不圆"], tips: ["sh舌尖翘起，气流从舌面出", "uo先发u再滑向o"], focusPoints: ["翘舌音sh", "复韵母uo"] },
  "老师": { pinyin: "lǎo shī", commonErrors: ["l和n混淆", "sh发成s"], tips: ["l舌尖抵上齿龈，气流从舌两侧出", "注意第三声的降升"], focusPoints: ["边音l", "翘舌音sh"] },
  "学习": { pinyin: "xué xí", commonErrors: ["x发音位置不对", "ü韵母不准"], tips: ["x舌面前部抵硬腭前部", "ué先发ü再滑向e"], focusPoints: ["舌面音x", "韵母üe"] },
  "中国": { pinyin: "zhōng guó", commonErrors: ["zh发成z", "后鼻音-ng不到位"], tips: ["zh翘舌不送气", "-ng舌根抵软腭"], focusPoints: ["翘舌音zh", "后鼻音-ng"] },
  "人民": { pinyin: "rén mín", commonErrors: ["r发不出来", "前鼻音-n不清"], tips: ["r舌尖翘起接近硬腭，声带振动", "-n舌尖抵上齿龈"], focusPoints: ["卷舌音r", "前鼻音-n"] },
  "谢谢": { pinyin: "xiè xie", commonErrors: ["x发音不准", "轻声过重"], tips: ["x舌面前部接近硬腭", "第二个'谢'读轻声，轻而短"], focusPoints: ["舌面音x", "轻声"] },
  "你好": { pinyin: "nǐ hǎo", commonErrors: ["n和l混淆", "三声不到位"], tips: ["n舌尖抵上齿龈，气流从鼻腔出", "三声要先降到最低再升"], focusPoints: ["鼻音n", "第三声"] },
  "朋友": { pinyin: "péng yǒu", commonErrors: ["后鼻音-ng不到位", "三声不够低"], tips: ["-ng结尾嘴保持张开", "第三声在'友'前可读半三声"], focusPoints: ["后鼻音-ng", "三声变调"] },
};

const practiceTexts = [
  { text: "你好" }, { text: "谢谢" }, { text: "吃饭" }, { text: "说话" },
  { text: "老师" }, { text: "朋友" }, { text: "学习" }, { text: "知道" },
  { text: "中国" }, { text: "人民" },
];

// ===== 普通话发音练习组件 =====
function MandarinPronunciationPractice() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [scores, setScores] = useState<{ total: number; tone: number; clarity: number; rhythm: number } | null>(null);
  const [feedback, setFeedback] = useState<{ errors: string[]; tips: string[]; focusPoints: string[] } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStandardPronunciation = () => {
    const text = inputText.trim();
    if (!text) { toast.info("请先输入要朗读的文字"); return; }
    speakText(text);
    toast.success("正在播放标准发音");
  };

  const startRecording = useCallback(async () => {
    if (!inputText.trim()) { toast.info("请先输入要朗读的文字"); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => { audioChunksRef.current.push(e.data); };
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        audioRef.current = new Audio(URL.createObjectURL(audioBlob));
        setHasRecording(true);
        stream.getTracks().forEach((t) => t.stop());
        simulateScoring();
      };
      mediaRecorder.start();
      setIsRecording(true);
      toast.info("录音中...请朗读文字");
    } catch { toast.error("无法访问麦克风，请检查权限设置"); }
  }, [inputText]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioRef.current) { audioRef.current.play(); }
  }, []);

  const simulateScoring = () => {
    const text = inputText.trim();
    const data = mandarinPronData[text];
    const tone = Math.floor(Math.random() * 30) + 60;
    const clarity = Math.floor(Math.random() * 30) + 65;
    const rhythm = Math.floor(Math.random() * 30) + 60;
    const total = Math.round((tone + clarity + rhythm) / 3);
    setScores({ total, tone, clarity, rhythm });
    if (data) {
      setFeedback({ errors: data.commonErrors, tips: data.tips, focusPoints: data.focusPoints });
    } else {
      setFeedback({
        errors: ["部分声调不够准确", "个别音节发音偏差"],
        tips: ["注意声调的起止高度", "多听标准发音进行模仿", "注意翘舌音和平舌音的区分"],
        focusPoints: ["声调准确度", "发音清晰度"],
      });
    }
  };

  const reset = () => { setScores(null); setFeedback(null); setHasRecording(false); };
  const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-yellow-600" : "text-red-600";
  const getScoreBg = (s: number) => s >= 85 ? "bg-green-500" : s >= 70 ? "bg-yellow-500" : "bg-red-500";

  const currentPinyin = inputText.trim() ? mandarinPronData[inputText.trim()]?.pinyin : "";

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="bg-white rounded-2xl border border-dong-indigo/10 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-dong-rose/10 flex items-center justify-center flex-shrink-0">
            <Mic size={20} className="text-dong-rose" />
          </div>
          <div>
            <h3 className="font-bold text-dong-indigo text-lg">普通话发音练习</h3>
            <p className="text-xs text-dong-light mt-0.5">专为侗族母语者设计，针对性纠正普通话发音问题</p>
          </div>
        </div>

        {/* 快速选词 */}
        <div className="mb-5">
          <p className="text-sm text-dong-light mb-2">快速选择练习词汇：</p>
          <div className="flex flex-wrap gap-2">
            {practiceTexts.map((p) => (
              <button
                key={p.text}
                onClick={() => { setInputText(p.text); reset(); }}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  inputText === p.text ? "bg-dong-indigo text-white border-dong-indigo" : "bg-white text-dong-indigo border-dong-indigo/20 hover:bg-dong-indigo/5"
                }`}
              >
                {p.text}
              </button>
            ))}
          </div>
        </div>

        {/* 输入框 */}
        <div className="mb-4">
          <input
            type="text"
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); reset(); }}
            placeholder="输入要练习的普通话词汇或句子..."
            className="w-full bg-dong-cream/30 border-2 border-dong-indigo/15 rounded-xl px-6 py-4 text-center text-lg focus:outline-none focus:border-dong-indigo/40 transition-colors"
          />
        </div>

        {/* 拼音显示 */}
        {currentPinyin && (
          <div className="text-center mb-5">
            <span className="text-dong-rose font-medium text-lg">{currentPinyin}</span>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Button onClick={handleStandardPronunciation} variant="outline" className="border-dong-indigo/20 text-dong-indigo hover:bg-dong-indigo/5 rounded-full px-5">
            <Volume2 className="w-4 h-4 mr-2" /> 标准发音
          </Button>
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`rounded-full px-5 ${isRecording ? "bg-red-500 hover:bg-red-600 text-white" : "bg-dong-indigo hover:bg-dong-deep text-white"}`}
          >
            {isRecording ? <><Square className="w-4 h-4 mr-2" />停止录音</> : <><Mic className="w-4 h-4 mr-2" />开始录音</>}
          </Button>
          <Button onClick={playRecording} disabled={!hasRecording} variant="outline" className="border-dong-indigo/20 text-dong-indigo hover:bg-dong-indigo/5 rounded-full px-5 disabled:opacity-40">
            <Play className="w-4 h-4 mr-2" /> 播放录音
          </Button>
        </div>

        {isRecording && (
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-500 text-sm font-medium">录音中...</span>
          </div>
        )}

        {/* 评分结果 */}
        {scores !== null && (
          <div className="bg-white rounded-2xl p-6 border border-dong-indigo/10 shadow-sm mb-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-dong-indigo" />
                <h3 className="font-serif text-dong-indigo font-bold">评分结果</h3>
              </div>
              <Button onClick={reset} variant="ghost" size="sm" className="text-dong-light hover:text-dong-indigo">
                <RotateCcw className="w-4 h-4 mr-1" /> 重试
              </Button>
            </div>
            <div className="text-center mb-6">
              <span className={`text-5xl font-bold ${getScoreColor(scores.total)}`}>{scores.total}</span>
              <span className="text-dong-light text-sm ml-1">分</span>
              <p className={`text-sm font-medium mt-1 ${getScoreColor(scores.total)}`}>
                {scores.total >= 85 ? "优秀" : scores.total >= 70 ? "良好" : "需要改进"}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "声调准确度", score: scores.tone },
                { label: "发音清晰度", score: scores.clarity },
                { label: "节奏韵律", score: scores.rhythm },
              ].map((dim) => (
                <div key={dim.label} className="text-center">
                  <p className="text-xs text-dong-light mb-1">{dim.label}</p>
                  <div className="w-full bg-dong-cream rounded-full h-2 mb-1">
                    <div className={`h-2 rounded-full transition-all ${getScoreBg(dim.score)}`} style={{ width: `${dim.score}%` }} />
                  </div>
                  <span className={`text-sm font-bold ${getScoreColor(dim.score)}`}>{dim.score}</span>
                </div>
              ))}
            </div>
            {feedback && (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 justify-center mb-2">
                  {feedback.focusPoints.map((fp, i) => (
                    <span key={i} className="px-3 py-1 bg-dong-cream/60 rounded-full text-xs text-dong-indigo border border-dong-indigo/10">{fp}</span>
                  ))}
                </div>
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
                  <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> 常见错误
                  </h4>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {feedback.errors.map((err, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>{err}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                  <h4 className="text-sm font-bold text-green-600 mb-2">纠音建议</h4>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {feedback.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 发音要点 */}
      <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
        <h3 className="text-dong-indigo font-serif font-bold mb-3">侗族母语者普通话发音要点</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-bold text-dong-rose mb-2">翘舌音训练</h4>
            <ol className="text-sm text-foreground/75 space-y-1 list-decimal list-inside">
              <li>zh/ch/sh/r 需要舌尖翘起</li>
              <li>与z/c/s区分：舌尖位置不同</li>
              <li>可用"知/资"、"吃/次"对比练习</li>
            </ol>
          </div>
          <div>
            <h4 className="text-sm font-bold text-dong-rose mb-2">声调训练</h4>
            <ol className="text-sm text-foreground/75 space-y-1 list-decimal list-inside">
              <li>一声(55)：高而平，不要降</li>
              <li>二声(35)：从中升到高</li>
              <li>三声(214)：先降后升，降到最低</li>
              <li>四声(51)：从高快速降到低</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 主页面 =====
export default function MandarinLearn() {
  const [activeTab, setActiveTab] = useState<"courses" | "practice">("courses");
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const currentLesson = mandarinLessons.find((l) => l.id === selectedLesson);

  const handlePractice = () => {
    setPracticeMode(true);
    setCurrentItemIndex(0);
  };

  const markComplete = (itemChinese: string) => {
    setCompletedItems((prev) => { const next = new Set(Array.from(prev)); next.add(itemChinese); return next; });
    toast.success("已掌握！");
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* 页面标题 */}
      <div className="bg-gradient-to-br from-dong-indigo to-dong-deep text-white py-10">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <BookOpen size={26} className="text-dong-rose/80" />
            <h1 className="text-2xl font-serif font-bold">普通话学习</h1>
          </div>
          <p className="text-white/70 text-sm max-w-xl">
            专为侗族母语者设计的普通话学习课程，对比侗语发音特点进行针对性训练
          </p>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-dong-indigo/10 sticky top-16 z-10">
        <div className="max-w-[1100px] mx-auto px-4 flex gap-0">
          {[
            { key: "courses", label: "课程学习", icon: <BookOpen size={14} /> },
            { key: "practice", label: "发音练习", icon: <Mic size={14} /> },
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
      <section className="flex-1 py-8 px-4">
        <div className="max-w-[1100px] mx-auto">

          {/* 课程学习 */}
          {activeTab === "courses" && (
            <>
              {!selectedLesson ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mandarinLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                        onClick={() => setSelectedLesson(lesson.id)}
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <BookOpen className="w-5 h-5 text-dong-indigo" />
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            lesson.difficulty === 1 ? "bg-green-50 text-green-600" :
                            lesson.difficulty === 2 ? "bg-yellow-50 text-yellow-600" :
                            "bg-red-50 text-red-600"
                          }`}>
                            {lesson.difficulty === 1 ? "初级" : lesson.difficulty === 2 ? "中级" : "高级"}
                          </span>
                        </div>
                        <h3 className="font-bold text-dong-indigo mb-1 group-hover:text-dong-rose transition-colors">{lesson.title}</h3>
                        <p className="text-sm text-dong-light mb-3">{lesson.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-dong-light">{lesson.items.length} 个练习项</span>
                          <ChevronRight className="w-4 h-4 text-dong-light group-hover:text-dong-rose transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-10 bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                    <h3 className="text-lg font-serif text-dong-indigo font-bold mb-4">侗族母语者学普通话小贴士</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-dong-cream/40 rounded-lg p-4">
                        <h4 className="font-bold text-dong-rose text-sm mb-2">发音优势</h4>
                        <ul className="text-sm text-foreground/70 space-y-1">
                          <li>• 侗语声调丰富，有助于掌握普通话四声</li>
                          <li>• 侗语有前后鼻音区分，可迁移到普通话</li>
                          <li>• 侗语辅音系统与普通话有较多共同点</li>
                        </ul>
                      </div>
                      <div className="bg-dong-cream/40 rounded-lg p-4">
                        <h4 className="font-bold text-dong-rose text-sm mb-2">需要注意</h4>
                        <ul className="text-sm text-foreground/70 space-y-1">
                          <li>• 翘舌音(zh, ch, sh, r)是主要难点</li>
                          <li>• 第三声的降升需要特别练习</li>
                          <li>• 注意n和l的区分（部分方言区）</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div>
                  <button onClick={() => { setSelectedLesson(null); setPracticeMode(false); }} className="text-sm text-dong-light hover:text-dong-indigo flex items-center gap-1 mb-6">
                    ← 返回课程列表
                  </button>

                  {currentLesson && (
                    <>
                      <div className="flex items-center justify-between mb-6">
                        <div>
                          <h3 className="text-xl font-serif text-dong-indigo font-bold">{currentLesson.title}</h3>
                          <p className="text-sm text-dong-light">{currentLesson.description}</p>
                        </div>
                        {!practiceMode && (
                          <Button onClick={handlePractice} className="bg-dong-rose hover:bg-dong-rose/80 text-white">
                            <Mic className="w-4 h-4 mr-1" /> 跟读练习
                          </Button>
                        )}
                      </div>

                      {!practiceMode ? (
                        <div className="space-y-4">
                          {currentLesson.items.map((item, i) => {
                            const isDone = completedItems.has(item.chinese);
                            return (
                              <div key={i} className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                      <span className="text-2xl font-bold text-dong-indigo">{item.chinese}</span>
                                      <span className="text-dong-rose font-medium">{item.pinyin}</span>
                                      {isDone && <CheckCircle className="w-4 h-4 text-green-500" />}
                                    </div>
                                    <div className="bg-dong-cream/40 rounded-lg p-3 mb-2">
                                      <p className="text-xs text-dong-light mb-1">侗语对照: <span className="text-dong-indigo">{item.dongEquiv}</span></p>
                                      <p className="text-sm text-foreground/70">{item.tips}</p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 ml-3">
                                    <button onClick={() => speakText(item.chinese)} className="p-2 bg-dong-indigo/5 rounded-lg text-dong-indigo hover:bg-dong-indigo/10 transition-colors" title="听发音">
                                      <Volume2 className="w-5 h-5" />
                                    </button>
                                    {!isDone && (
                                      <button onClick={() => markComplete(item.chinese)} className="p-2 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors" title="标记已掌握">
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="max-w-[500px] mx-auto">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm text-dong-light">{currentItemIndex + 1} / {currentLesson.items.length}</p>
                            <button onClick={() => setPracticeMode(false)} className="text-sm text-dong-light hover:text-dong-indigo">退出练习</button>
                          </div>
                          <div className="w-full bg-dong-cream rounded-full h-2 mb-6">
                            <div className="bg-dong-indigo h-2 rounded-full transition-all" style={{ width: `${((currentItemIndex + 1) / currentLesson.items.length) * 100}%` }} />
                          </div>

                          <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center">
                            <p className="text-5xl font-bold text-dong-indigo mb-3">{currentLesson.items[currentItemIndex].chinese}</p>
                            <p className="text-xl text-dong-rose mb-4">{currentLesson.items[currentItemIndex].pinyin}</p>
                            <div className="bg-dong-cream/40 rounded-lg p-3 mb-4 text-left">
                              <p className="text-xs text-dong-light mb-1">侗语对照: {currentLesson.items[currentItemIndex].dongEquiv}</p>
                              <p className="text-sm text-foreground/70">{currentLesson.items[currentItemIndex].tips}</p>
                            </div>

                            <div className="flex items-center justify-center gap-3 mb-6">
                              <Button onClick={() => speakText(currentLesson.items[currentItemIndex].chinese)} className="bg-dong-indigo hover:bg-dong-deep text-white">
                                <Volume2 className="w-4 h-4 mr-1" /> 听标准发音
                              </Button>
                              <Button onClick={() => { toast.info("请跟读上方文字，注意发音要点"); }} variant="outline" className="border-dong-rose/30 text-dong-rose hover:bg-dong-rose/5">
                                <Mic className="w-4 h-4 mr-1" /> 跟读
                              </Button>
                            </div>
                          </div>

                          <div className="flex items-center justify-center gap-4 mt-6">
                            <Button
                              onClick={() => setCurrentItemIndex(Math.max(0, currentItemIndex - 1))}
                              disabled={currentItemIndex === 0}
                              variant="outline" className="border-dong-indigo/20"
                            >
                              上一个
                            </Button>
                            <Button
                              onClick={() => {
                                if (currentItemIndex < currentLesson.items.length - 1) {
                                  setCurrentItemIndex(currentItemIndex + 1);
                                } else {
                                  toast.success("恭喜完成本课所有练习！");
                                  setPracticeMode(false);
                                }
                              }}
                              className="bg-dong-indigo hover:bg-dong-deep text-white"
                            >
                              {currentItemIndex < currentLesson.items.length - 1 ? "下一个" : "完成"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}

          {/* 发音练习 */}
          {activeTab === "practice" && <MandarinPronunciationPractice />}

        </div>
      </section>

      <Footer />
    </div>
  );
}
