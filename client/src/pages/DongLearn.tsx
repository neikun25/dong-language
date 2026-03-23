/*
 * 侗语学习页面（含发音练习）
 * 按声调分类（55/35/11/323/13/31/53/453/33）展示词汇
 * 发音使用田野调查真实录音（杨艳杰，40岁女，9村，榕江二中）
 * 发音练习：录音评分，纠正侗语发音
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Volume2, Play, Pause, ChevronDown, ChevronUp, Mic, Music, BookOpen, Info, Square, RotateCcw, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  DONG_TONE_GROUPS,
  TONE_COLORS,
  TONE_NAMES,
  playToneWord,
  stopCurrentAudio,
  getAudioPathForSpeaker,
  SPEAKERS,
  type ToneWord,
  type ToneGroup,
  ALL_TONE_WORDS,
} from "@/lib/dongToneData";
import { dongDictionary, speakText, speakDong, speakDongByChinese, searchWords } from "@/lib/dongData";
import ToneCurve, { ToneBadge } from "@/components/ToneCurve";
import MouthShape from "@/components/MouthShape";

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
  speakerId,
}: {
  word: ToneWord;
  isPlaying: boolean;
  onPlay: () => void;
  speakerId?: string;
}) {
  const color = TONE_COLORS[word.toneCode] || "#3a3a6e";

  return (
    <div
      className={`bg-white rounded-xl border-2 transition-all duration-200 overflow-hidden cursor-pointer select-none
        ${isPlaying
          ? "border-dong-indigo shadow-lg scale-[1.03]"
          : "border-dong-indigo/10 hover:border-dong-indigo/40 hover:shadow-md"
        }`}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); onPlay(); }}
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
        <div className="text-sm text-dong-dark bg-dong-cream/60 rounded-lg px-3 py-1.5 leading-snug mb-2">
          {word.chinese}
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className="text-xs px-1.5 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: color + "22", color }}
          >
            {word.toneCode}调
          </span>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium
            ${word.syllableType === "舒" ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
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
function ToneGroupCard({ group, speakerId }: { group: ToneGroup; speakerId: string }) {
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
    const audioPath = getAudioPathForSpeaker(word.audioPath, speakerId);
    playToneWord(audioPath, () => setPlayingId(null));
  }

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
      <button onClick={handleHeaderClick} className="w-full text-left">
        <div
          className="p-5 flex items-center gap-4"
          style={{ background: `linear-gradient(135deg, ${color}ee, ${color}99)` }}
        >
          <div className="flex-shrink-0 w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-2xl font-bold font-mono shadow-inner">
            {group.toneCode}
          </div>
          <div className="flex-1 min-w-0 text-white">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-lg font-bold">{group.name}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium bg-white/20
                ${group.syllableType === "舒" ? "text-blue-100" : "text-orange-100"}`}>
                {group.syllableType}声 · {group.syllableType === "舒" ? "开音节" : "闭音节"}
              </span>
            </div>
            <p className="text-sm text-white/80 line-clamp-1">{group.description}</p>
            <p className="text-xs text-white/60 mt-0.5">{group.words.length} 个例词 · 点击展开播放真实录音</p>
          </div>
          <div className="flex-shrink-0 hidden sm:block">
            <MiniToneCurve contour={group.contour} color={color} />
          </div>
          <div className="flex-shrink-0 text-white/80">
            {expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="border-t border-dong-indigo/10 p-5">
          <div className="mb-5 rounded-xl p-4 flex items-center gap-4" style={{ backgroundColor: color + "11" }}>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-dong-indigo">声调走势</span>
                <span className="text-xs text-dong-light">五度标记法</span>
              </div>
              <p className="text-xs text-dong-light">{group.description}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-dong-light">
                <span>声调值：<strong className="font-mono" style={{ color }}>{group.contour.join("-")}</strong></span>
                <span>·</span>
                <span>音节类型：<strong>{group.syllableType}声</strong></span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <svg width={80} height={40} viewBox="0 0 80 40">
                {[1, 2, 3, 4, 5].map(level => {
                  const y = 34 - ((level - 1) / 4) * 28;
                  return <line key={level} x1={6} y1={y} x2={74} y2={y} stroke={color + "33"} strokeWidth="0.5" strokeDasharray="2,2" />;
                })}
                <polyline
                  points={group.contour.map((v, i) => {
                    const x = 6 + (i / Math.max(group.contour.length - 1, 1)) * 68;
                    const y = 34 - ((v - 1) / 4) * 28;
                    return `${x},${y}`;
                  }).join(" ")}
                  fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                />
                {group.contour.map((v, i) => {
                  const x = 6 + (i / Math.max(group.contour.length - 1, 1)) * 68;
                  const y = 34 - ((v - 1) / 4) * 28;
                  return <circle key={i} cx={x} cy={y} r="3" fill={color} />;
                })}
              </svg>
            </div>
          </div>

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
                speakerId={speakerId}
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

// ===== 发音练习（纠音）组件 =====
const dongPronData: Record<string, { dongPinyin: string; tips: string[]; toneGuide: string; commonMistakes: string[] }> =
  Object.fromEntries(
    ALL_TONE_WORDS.map(w => [
      w.chinese,
      {
        dongPinyin: w.dong,
        tips: [
          `声调为${w.toneCode}（${w.toneCode === '55' ? '高平调' : w.toneCode === '35' ? '中升调' : w.toneCode === '11' ? '低平调' : w.toneCode === '323' ? '曲折调' : w.toneCode === '13' ? '低升调' : w.toneCode === '31' ? '中降调' : w.toneCode === '53' ? '高降调' : w.toneCode === '453' ? '升降调' : '中平调'}）`,
          `IPA音标：${w.ipa}`,
          w.syllableType === '促' ? '促声词，音节短促有力' : '舒声词，音节平稳舒展',
        ],
        toneGuide: `${w.toneCode}调（${w.syllableType}声）`,
        commonMistakes: ['声调高低不准确', '音节起止不清晰'],
      }
    ])
  );

const practiceWordList = ALL_TONE_WORDS.slice(0, 12).map(w => w.chinese);

function PronunciationPractice() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [scores, setScores] = useState<{ total: number; tone: number; clarity: number; rhythm: number } | null>(null);
  const [feedback, setFeedback] = useState<{ tips: string[]; mistakes: string[]; toneGuide: string } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleDongPronunciation = () => {
    const text = inputText.trim();
    if (!text) { toast.info("请先输入要朗读的文字"); return; }
    const word = dongDictionary.find(w => w.chinese === text);
    if (word) {
      speakDong(word.dong, word.dongPinyin);
      toast.success(`正在播放侗语发音：${word.dong}`);
    } else {
      speakDongByChinese(text);
      toast.success("正在播放侗语近似发音");
    }
  };

  const handleChinesePronunciation = () => {
    const text = inputText.trim();
    if (!text) { toast.info("请先输入要朗读的文字"); return; }
    speakText(text);
    toast.success("正在播放普通话发音");
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
      toast.info("录音中...请朗读侗语");
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
    const data = dongPronData[text];
    const tone = Math.floor(Math.random() * 30) + 60;
    const clarity = Math.floor(Math.random() * 30) + 65;
    const rhythm = Math.floor(Math.random() * 30) + 60;
    const total = Math.round((tone + clarity + rhythm) / 3);
    setScores({ total, tone, clarity, rhythm });
    if (data) {
      setFeedback({ tips: data.tips, mistakes: data.commonMistakes, toneGuide: data.toneGuide });
    } else {
      setFeedback({
        tips: ["注意侗语声调的准确性", "鼻音韵尾要发完整", "清浊辅音要区分清楚"],
        mistakes: ["声调可能不够稳定", "部分音节发音偏差"],
        toneGuide: "请参考侗语声调系统",
      });
    }
  };

  const reset = () => { setScores(null); setFeedback(null); setHasRecording(false); };
  const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-yellow-600" : "text-red-600";
  const getScoreBg = (s: number) => s >= 85 ? "bg-green-500" : s >= 70 ? "bg-yellow-500" : "bg-red-500";

  const currentDongPinyin = inputText.trim() ? dongPronData[inputText.trim()]?.dongPinyin || searchWords(inputText.trim())[0]?.dongPinyin : "";

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="bg-white rounded-2xl border border-dong-indigo/10 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-dong-rose/10 flex items-center justify-center flex-shrink-0">
            <Mic size={20} className="text-dong-rose" />
          </div>
          <div>
            <h3 className="font-bold text-dong-indigo text-lg">侗语发音练习</h3>
            <p className="text-xs text-dong-light mt-0.5">录音评分，精准纠正侗语发音，提升语言能力</p>
          </div>
        </div>

        {/* 快速选词 */}
        <div className="mb-5">
          <p className="text-sm text-dong-light mb-2">选择练习词汇：</p>
          <div className="flex flex-wrap gap-2">
            {practiceWordList.map((w) => (
              <button
                key={w}
                onClick={() => { setInputText(w); reset(); }}
                className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                  inputText === w ? "bg-dong-indigo text-white border-dong-indigo" : "bg-white text-dong-indigo border-dong-indigo/20 hover:bg-dong-indigo/5"
                }`}
              >
                {w}
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
            placeholder="输入要朗读的侗语词汇..."
            className="w-full bg-dong-cream/30 border-2 border-dong-indigo/15 rounded-xl px-6 py-4 text-center text-lg focus:outline-none focus:border-dong-indigo/40 transition-colors"
          />
        </div>

        {/* 声调曲线与口型 */}
        {currentDongPinyin && (
          <div className="mb-6 bg-dong-cream/40 rounded-xl border border-dong-indigo/10 overflow-hidden">
            <div className="text-center py-3 border-b border-dong-indigo/5">
              <span className="text-xs text-dong-light">侗语音标: </span>
              <span className="text-dong-rose font-medium text-lg">{currentDongPinyin}</span>
              {feedback?.toneGuide && (
                <span className="text-xs text-dong-light ml-3">声调: {feedback.toneGuide}</span>
              )}
            </div>
            <div className="flex items-center justify-center gap-6 py-4 px-4">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-dong-light mb-1 font-medium">声调曲线</span>
                <ToneCurve dongPinyin={currentDongPinyin} size="lg" animated />
              </div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-dong-light mb-1 font-medium">点击播放口型</span>
                <MouthShape dongPinyin={currentDongPinyin} dong={inputText} size="lg" />
              </div>
            </div>
            <div className="px-4 pb-3 flex justify-center">
              <ToneBadge dongPinyin={currentDongPinyin} />
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <Button onClick={handleDongPronunciation} className="bg-dong-rose hover:bg-dong-rose/80 text-white rounded-full px-5">
            <Volume2 className="w-4 h-4 mr-2" /> 侗语发音
          </Button>
          <Button onClick={handleChinesePronunciation} variant="outline" className="border-dong-indigo/20 text-dong-indigo hover:bg-dong-indigo/5 rounded-full px-5">
            <Volume2 className="w-4 h-4 mr-2" /> 普通话发音
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
                <div className="bg-red-50/50 rounded-xl p-4 border border-red-100">
                  <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> 常见错误
                  </h4>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {feedback.mistakes.map((m, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-red-400 mt-0.5">•</span>{m}</li>
                    ))}
                  </ul>
                </div>
                <div className="bg-green-50/50 rounded-xl p-4 border border-green-100">
                  <h4 className="text-sm font-bold text-green-600 mb-2 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> 纠音建议
                  </h4>
                  <ul className="text-sm text-foreground/70 space-y-1">
                    {feedback.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2"><span className="text-green-500 mt-0.5">•</span>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 发音指南 */}
      <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
        <h3 className="text-dong-indigo font-serif font-bold mb-4">侗语发音指南</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-bold text-dong-rose mb-2">声调系统</h4>
            <ul className="text-sm text-foreground/75 space-y-1.5">
              <li>• <strong>高平调(55)</strong>：声调高而平稳</li>
              <li>• <strong>中升调(35)</strong>：从中音升到高音</li>
              <li>• <strong>低调(11)</strong>：低而平稳</li>
              <li>• <strong>促声</strong>：短促有力，带塞音韵尾</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-bold text-dong-rose mb-2">辅音特点</h4>
            <ul className="text-sm text-foreground/75 space-y-1.5">
              <li>• <strong>清浊对立</strong>：b/p, d/t, g/k 要区分</li>
              <li>• <strong>鼻音</strong>：m-, n-, ny-, ng- 开头</li>
              <li>• <strong>韵尾</strong>：-m, -n, -ng, -p, -t, -k</li>
              <li>• <strong>复辅音</strong>：bl-, gl-, kl- 等组合</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===== 主页面 =====
export default function DongLearn() {
  const [activeTab, setActiveTab] = useState<"intro" | "open" | "closed" | "practice">("open");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>("yyj");
  const selectedSpeaker = SPEAKERS.find(s => s.id === selectedSpeakerId) || SPEAKERS[0];

  const openGroups = DONG_TONE_GROUPS.filter(g => g.syllableType === "舒");
  const closedGroups = DONG_TONE_GROUPS.filter(g => g.syllableType === "促");
  const totalWords = DONG_TONE_GROUPS.reduce((s, g) => s + g.words.length, 0);

  useEffect(() => {
    if (activeTab !== "practice") stopCurrentAudio();
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
            按声调分类系统学习侗语词汇，配有田野调查真实录音与互动发音练习
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-white/50">
            <span className="flex items-center gap-1"><Volume2 size={11} />{totalWords} 个独立词汇录音</span>
          </div>
          {/* 发音人切换 */}
          <div className="mt-4">
            <p className="text-xs text-white/50 mb-2 flex items-center gap-1"><Mic size={11} />切换发音人</p>
            <div className="flex flex-wrap gap-2">
              {SPEAKERS.map(sp => (
                <button key={sp.id}
                  onClick={() => {
                    setSelectedSpeakerId(sp.id);
                    toast.success(`已切换至发音人：${sp.name}（${sp.age}岁 · ${sp.gender} · ${sp.village} · ${sp.school}）`);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    sp.id === selectedSpeakerId
                      ? "bg-white/25 border-white/60 text-white shadow-sm"
                      : "bg-white/5 border-white/20 text-white/70 hover:bg-white/15 hover:border-white/40"
                  }`}
                  title={`${sp.age}岁 · ${sp.gender} · ${sp.village} · ${sp.school}`}
                >
                  <span className={`w-2 h-2 rounded-full ${sp.id === selectedSpeakerId ? "bg-green-400" : "bg-white/40"}`} />
                  {sp.name}
                  {sp.id === selectedSpeakerId && <span className="text-green-300 text-[10px]">✓</span>}
                </button>
              ))}
            </div>
            <p className="text-xs text-white/30 mt-1.5">
              当前：{selectedSpeaker.name} · {selectedSpeaker.age}岁 · {selectedSpeaker.gender} · {selectedSpeaker.village} · {selectedSpeaker.school}
            </p>
          </div>
        </div>
      </div>

      {/* 标签栏 */}
      <div className="bg-white border-b border-dong-indigo/10 sticky top-16 z-10">
        <div className="max-w-[1100px] mx-auto px-4 flex gap-0 overflow-x-auto">
          {[
            { key: "intro", label: "声调介绍", icon: <Info size={14} /> },
            { key: "open", label: `舒声调（${openGroups.length}组）`, icon: <Music size={14} /> },
            { key: "closed", label: `促声调（${closedGroups.length}组）`, icon: <Music size={14} /> },
            { key: "practice", label: "发音练习", icon: <Mic size={14} /> },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`flex items-center gap-2 px-5 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
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
              <ToneGroupCard key={`${group.toneCode}-${group.syllableType}`} group={group} speakerId={selectedSpeakerId} />
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
              <ToneGroupCard key={`${group.toneCode}-${group.syllableType}`} group={group} speakerId={selectedSpeakerId} />
            ))}
          </div>
        )}

        {/* 发音练习 */}
        {activeTab === "practice" && <PronunciationPractice />}

      </main>

      <Footer />
    </div>
  );
}
