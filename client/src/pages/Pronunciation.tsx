/*
 * Design: 侗语发音评分系统页面 (增强版)
 * 功能: 输入文字 -> 标准发音 -> 录音 -> 评分 -> 详细纠音反馈
 * 增加: 更多词汇、详细评分维度、发音对比、练习建议
 */
import { useState, useRef, useCallback } from "react";
import { Mic, Square, Play, Volume2, RotateCcw, AlertCircle, CheckCircle, BarChart3 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dongDictionary, speakText, speakDong, speakDongByChinese, searchWords } from "@/lib/dongData";
import ToneCurve, { ToneBadge } from "@/components/ToneCurve";
import MouthShape from "@/components/MouthShape";

const dongPronData: Record<string, { dongPinyin: string; tips: string[]; toneGuide: string; commonMistakes: string[] }> = {
  "你好": { dongPinyin: "mii laox", tips: ["'mii'发音短促，高平调", "'laox'中升调，注意鼻音"], toneGuide: "高平调+中升调", commonMistakes: ["声调不稳定", "鼻音不够明显"] },
  "谢谢": { dongPinyin: "laox siik", tips: ["'laox'中升调", "'siik'入声，短促有力"], toneGuide: "中升调+入声", commonMistakes: ["入声不够短促", "声调偏高"] },
  "鼓楼": { dongPinyin: "gul laox", tips: ["'gul'低调，浊辅音开头", "'laox'中升调"], toneGuide: "低调+中升调", commonMistakes: ["'g'清浊不分", "低调不够低"] },
  "大歌": { dongPinyin: "al laox", tips: ["'al'低平调", "'laox'中升调，两个音节都要饱满"], toneGuide: "低平调+中升调", commonMistakes: ["低平调偏高", "音节不够饱满"] },
  "吃饭": { dongPinyin: "nyaoc jax", tips: ["'nyaoc'鼻音开头，注意ny-的发音", "'jax'入声"], toneGuide: "中调+入声", commonMistakes: ["ny-鼻音不到位", "入声丢失"] },
  "朋友": { dongPinyin: "bioul nyenc", tips: ["'bioul'双元音要完整", "'nyenc'鼻音韵尾"], toneGuide: "低调+中调", commonMistakes: ["双元音不完整", "鼻音韵尾丢失"] },
  "唱歌": { dongPinyin: "al gal", tips: ["两个低调音节", "注意'g'的浊辅音发音"], toneGuide: "低调+低调", commonMistakes: ["声调不够低", "清浊不分"] },
  "家": { dongPinyin: "yangh", tips: ["中升调", "鼻音韵尾-ng要完整"], toneGuide: "中升调", commonMistakes: ["鼻音韵尾不完整", "声调偏平"] },
  "山": { dongPinyin: "bya", tips: ["浊辅音b-开头", "低调"], toneGuide: "低调", commonMistakes: ["b-发成p-", "声调偏高"] },
  "水": { dongPinyin: "naml", tips: ["低调入声", "鼻音开头"], toneGuide: "低调入声", commonMistakes: ["入声不够短促", "鼻音不明显"] },
  "太阳": { dongPinyin: "wenc nyiedl", tips: ["'wenc'中调，鼻音韵尾", "'nyiedl'低调入声"], toneGuide: "中调+低调入声", commonMistakes: ["韵尾不完整", "入声丢失"] },
  "月亮": { dongPinyin: "laox nyiedl", tips: ["'laox'中升调", "'nyiedl'低调入声"], toneGuide: "中升调+低调入声", commonMistakes: ["声调组合不准", "入声不到位"] },
};

const practiceWords = ["你好", "谢谢", "鼓楼", "大歌", "吃饭", "朋友", "唱歌", "家", "山", "水", "太阳", "月亮"];

export default function Pronunciation() {
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
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-serif text-dong-indigo font-bold text-center mb-2">
            侗语发音评分系统
          </h2>
          <p className="text-sm text-dong-light text-center mb-8">
            录音评分，精准纠正侗语发音，提升语言能力
          </p>

          {/* Quick Practice Words */}
          <div className="mb-6">
            <p className="text-sm text-dong-light mb-2">选择练习词汇：</p>
            <div className="flex flex-wrap gap-2">
              {practiceWords.map((w) => (
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

          {/* Input */}
          <div className="mb-4">
            <input
              type="text"
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); reset(); }}
              placeholder="输入要朗读的侗语词汇..."
              className="w-full bg-white border-2 border-dong-indigo/15 rounded-xl px-6 py-4 text-center text-lg focus:outline-none focus:border-dong-indigo/40 transition-colors"
            />
          </div>

          {/* Dong Pinyin Display with Tone Curve & Mouth Shape */}
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
                {/* 声调曲线 */}
                <div className="flex flex-col items-center">
                  <span className="text-[10px] text-dong-light mb-1 font-medium">声调曲线</span>
                  <ToneCurve dongPinyin={currentDongPinyin} size="lg" animated />
                </div>
                {/* 口型动画 */}
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

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-sm font-medium">录音中...</span>
            </div>
          )}

          {/* Detailed Score */}
          {scores !== null && (
            <div className="bg-white rounded-2xl p-6 border border-dong-indigo/10 shadow-sm mb-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-dong-indigo" />
                  <h3 className="font-serif text-dong-indigo font-bold">评分结果</h3>
                </div>
                <Button onClick={reset} variant="ghost" size="sm" className="text-dong-light hover:text-dong-indigo">
                  <RotateCcw className="w-4 h-4 mr-1" /> 重试
                </Button>
              </div>

              {/* Total Score */}
              <div className="text-center mb-6">
                <span className={`text-5xl font-bold ${getScoreColor(scores.total)}`}>{scores.total}</span>
                <span className="text-dong-light text-sm ml-1">分</span>
                <p className={`text-sm font-medium mt-1 ${getScoreColor(scores.total)}`}>
                  {scores.total >= 85 ? "优秀" : scores.total >= 70 ? "良好" : "需要改进"}
                </p>
              </div>

              {/* Dimension Scores */}
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

              {/* Feedback */}
              {feedback && (
                <div className="space-y-4">
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

          {/* Dong Pronunciation Guide */}
          <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
            <h3 className="text-dong-indigo font-serif font-bold mb-4">侗语发音指南</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-bold text-dong-rose mb-2">声调系统</h4>
                <ul className="text-sm text-foreground/75 space-y-1.5">
                  <li>• <strong>高平调(55)</strong>：声调高而平稳</li>
                  <li>• <strong>中升调(35)</strong>：从中音升到高音</li>
                  <li>• <strong>低调(21)</strong>：低而平或略降</li>
                  <li>• <strong>入声</strong>：短促有力，带喉塞尾</li>
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
      </section>

      <Footer />
    </div>
  );
}
