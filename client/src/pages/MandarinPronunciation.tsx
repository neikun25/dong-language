/*
 * Design: 普通话纠音评分页面
 * 针对侗族母语者的普通话发音纠正
 * 输入文字 -> 标准发音 -> 录音 -> 评分 -> 纠音提示
 */
import { useState, useRef, useCallback } from "react";
import { Mic, Square, Play, Volume2, RotateCcw, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { speakText } from "@/lib/dongData";

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
  { text: "你好", category: "日常用语" },
  { text: "谢谢", category: "日常用语" },
  { text: "吃饭", category: "日常用语" },
  { text: "说话", category: "日常用语" },
  { text: "老师", category: "称呼" },
  { text: "朋友", category: "称呼" },
  { text: "学习", category: "学习" },
  { text: "知道", category: "日常用语" },
  { text: "中国", category: "地名" },
  { text: "人民", category: "词汇" },
];

export default function MandarinPronunciation() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
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
    const randomScore = Math.floor(Math.random() * 36) + 60;
    setScore(randomScore);
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

  const reset = () => {
    setScore(null);
    setFeedback(null);
    setHasRecording(false);
  };

  const getScoreColor = (s: number) => s >= 85 ? "text-green-600" : s >= 70 ? "text-yellow-600" : "text-red-600";
  const getScoreLabel = (s: number) => s >= 85 ? "优秀" : s >= 70 ? "良好" : "需要改进";
  const getScoreBg = (s: number) => s >= 85 ? "bg-green-50 border-green-200" : s >= 70 ? "bg-yellow-50 border-yellow-200" : "bg-red-50 border-red-200";

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-serif text-dong-indigo font-bold text-center mb-2">
            普通话发音纠正
          </h2>
          <p className="text-sm text-dong-light text-center mb-8">
            专为侗族母语者设计，针对性纠正普通话发音问题
          </p>

          {/* Quick Practice Words */}
          <div className="mb-6">
            <p className="text-sm text-dong-light mb-2">快速选择练习词汇：</p>
            <div className="flex flex-wrap gap-2">
              {practiceTexts.map((p) => (
                <button
                  key={p.text}
                  onClick={() => { setInputText(p.text); reset(); }}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all ${
                    inputText === p.text
                      ? "bg-dong-indigo text-white border-dong-indigo"
                      : "bg-white text-dong-indigo border-dong-indigo/20 hover:bg-dong-indigo/5"
                  }`}
                >
                  {p.text}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="mb-5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => { setInputText(e.target.value); reset(); }}
              placeholder="输入要练习的普通话词汇或句子..."
              className="w-full bg-white border-2 border-dong-indigo/15 rounded-xl px-6 py-4 text-center text-lg focus:outline-none focus:border-dong-indigo/40 transition-colors"
            />
          </div>

          {/* Pinyin Display */}
          {inputText.trim() && mandarinPronData[inputText.trim()] && (
            <div className="text-center mb-4">
              <span className="text-dong-rose font-medium text-lg">{mandarinPronData[inputText.trim()].pinyin}</span>
            </div>
          )}

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
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
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-sm font-medium">录音中...</span>
            </div>
          )}

          {/* Score Result */}
          {score !== null && (
            <div className={`rounded-2xl p-6 border mb-6 ${getScoreBg(score)}`}>
              <div className="flex items-center justify-center gap-4 mb-4">
                <span className={`text-5xl font-bold ${getScoreColor(score)}`}>{score}</span>
                <div>
                  <span className="text-sm text-dong-light">分</span>
                  <p className={`text-sm font-medium ${getScoreColor(score)}`}>{getScoreLabel(score)}</p>
                </div>
                <Button onClick={reset} variant="ghost" size="sm" className="text-dong-light hover:text-dong-indigo ml-4">
                  <RotateCcw className="w-4 h-4 mr-1" /> 重试
                </Button>
              </div>

              {feedback && (
                <div className="space-y-4">
                  {/* Focus Points */}
                  <div className="flex flex-wrap gap-2 justify-center">
                    {feedback.focusPoints.map((fp, i) => (
                      <span key={i} className="px-3 py-1 bg-white/80 rounded-full text-xs text-dong-indigo border border-dong-indigo/10">
                        {fp}
                      </span>
                    ))}
                  </div>

                  {/* Common Errors */}
                  <div className="bg-white/60 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-red-600 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> 常见错误
                    </h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      {feedback.errors.map((err, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-400 mt-0.5">•</span> {err}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tips */}
                  <div className="bg-white/60 rounded-xl p-4">
                    <h4 className="text-sm font-bold text-dong-indigo mb-2">纠音建议</h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      {feedback.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-dong-rose mt-0.5">•</span> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pronunciation Tips */}
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
      </section>

      <Footer />
    </div>
  );
}
