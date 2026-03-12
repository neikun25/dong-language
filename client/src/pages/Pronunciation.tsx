/*
 * Design: 侗语发音评分系统页面
 * 功能: 输入文字 -> 标准发音 -> 录音 -> 评分 -> 发音对比
 * 布局: 轮播图 + 评分系统 + 发音要点 + 评估结果 + 发音对比
 */
import { useState, useRef, useCallback } from "react";
import { Mic, Square, Play, Volume2, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Simulated pronunciation data
const pronunciationData: Record<string, { pinyin: string; dongPinyin: string; tips: string[] }> = {
  "你好": { pinyin: "nǐ hǎo", dongPinyin: "mii laox", tips: ["注意第三声的降升", "侗语中'mii'发音要短促"] },
  "谢谢": { pinyin: "xiè xie", dongPinyin: "laox siik", tips: ["轻声'xie'要轻读", "侗语'siik'注意入声"] },
  "鼓楼": { pinyin: "gǔ lóu", dongPinyin: "gul laox", tips: ["注意'gǔ'的第三声", "侗语'gul'为低调"] },
  "大歌": { pinyin: "dà gē", dongPinyin: "al laox", tips: ["'dà'为第四声降调", "侗语'al'为低平调"] },
  "吃饭": { pinyin: "chī fàn", dongPinyin: "nyaoc jax", tips: ["'chī'翘舌音要到位", "侗语'nyaoc'鼻音开头"] },
  "朋友": { pinyin: "péng you", dongPinyin: "bioul nyenc", tips: ["'péng'后鼻音要完整", "侗语'bioul'注意双元音"] },
  "唱歌": { pinyin: "chàng gē", dongPinyin: "al gal", tips: ["'chàng'后鼻音注意", "侗语两个低调音节"] },
  "家": { pinyin: "jiā", dongPinyin: "yangh", tips: ["'jiā'第一声平调", "侗语'yangh'中升调"] },
  "山": { pinyin: "shān", dongPinyin: "bya", tips: ["'shān'翘舌音", "侗语'bya'浊辅音开头"] },
  "水": { pinyin: "shuǐ", dongPinyin: "naml", tips: ["'shuǐ'第三声降升", "侗语'naml'低调入声"] },
};

export default function Pronunciation() {
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecording, setHasRecording] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{ standard: string; user: string; diff: string[] } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleStandardPronunciation = () => {
    const text = inputText.trim();
    if (!text) {
      toast.info("请先输入要朗读的文字");
      return;
    }
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.7;
      speechSynthesis.speak(utterance);
      toast.success("正在播放标准发音");
    } else {
      toast.error("您的浏览器不支持语音合成");
    }
  };

  const startRecording = useCallback(async () => {
    if (!inputText.trim()) {
      toast.info("请先输入要朗读的文字");
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const audioUrl = URL.createObjectURL(audioBlob);
        audioRef.current = new Audio(audioUrl);
        setHasRecording(true);
        stream.getTracks().forEach((track) => track.stop());

        // Simulate scoring
        simulateScoring();
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("录音中...请朗读文字");
    } catch {
      toast.error("无法访问麦克风，请检查权限设置");
    }
  }, [inputText]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playRecording = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play();
      toast.info("正在播放录音");
    }
  }, []);

  const simulateScoring = () => {
    const text = inputText.trim();
    const data = pronunciationData[text];

    // Generate random score between 60-95
    const randomScore = Math.floor(Math.random() * 36) + 60;
    setScore(randomScore);

    if (data) {
      setFeedback(data.tips);
      setComparison({
        standard: data.pinyin,
        user: data.pinyin.replace(/[ǐǎ]/g, (m) => (m === "ǐ" ? "í" : "á")),
        diff: data.tips,
      });
    } else {
      setFeedback(["发音整体流畅", "注意声调的准确性", "建议多听标准发音进行对比"]);
      setComparison(null);
    }
  };

  const getScoreColor = (s: number) => {
    if (s >= 85) return "text-green-600";
    if (s >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (s: number) => {
    if (s >= 85) return "优秀";
    if (s >= 70) return "良好";
    return "需要改进";
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* Pronunciation Scoring System */}
      <section className="py-12 px-4">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-2xl font-serif text-dong-indigo font-bold text-center mb-10">
            侗语发音评分系统
          </h2>

          {/* Input */}
          <div className="mb-5">
            <input
              type="text"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                setScore(null);
                setFeedback([]);
                setComparison(null);
                setHasRecording(false);
              }}
              placeholder="输入要朗读的文字（如：你好、谢谢、鼓楼...）"
              className="w-full bg-dong-cream/60 border-2 border-dong-indigo/15 rounded-full px-6 py-4 text-center text-base focus:outline-none focus:border-dong-indigo/40 transition-colors"
            />
          </div>

          {/* Standard Pronunciation Button */}
          <div className="mb-6">
            <Button
              onClick={handleStandardPronunciation}
              className="w-full bg-dong-indigo/10 hover:bg-dong-indigo/20 text-dong-indigo border border-dong-indigo/20 rounded-full py-4 text-base font-medium"
              variant="outline"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              标准发音
            </Button>
          </div>

          {/* Recording Controls */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              className={`rounded-full px-6 py-3 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-dong-indigo/10 hover:bg-dong-indigo/20 text-dong-indigo border border-dong-indigo/20"
              }`}
              variant={isRecording ? "default" : "outline"}
            >
              {isRecording ? (
                <>
                  <Square className="w-4 h-4 mr-2" />
                  停止录音
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  开始录音
                </>
              )}
            </Button>

            <Button
              onClick={stopRecording}
              disabled={!isRecording}
              className="rounded-full px-6 py-3 bg-dong-indigo/10 hover:bg-dong-indigo/20 text-dong-indigo border border-dong-indigo/20 disabled:opacity-40"
              variant="outline"
            >
              <Square className="w-4 h-4 mr-2" />
              停止
            </Button>

            <Button
              onClick={playRecording}
              disabled={!hasRecording}
              className="rounded-full px-6 py-3 bg-dong-indigo/10 hover:bg-dong-indigo/20 text-dong-indigo border border-dong-indigo/20 disabled:opacity-40"
              variant="outline"
            >
              <Play className="w-4 h-4 mr-2" />
              播放
            </Button>
          </div>

          {/* Recording indicator */}
          {isRecording && (
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-red-500 text-sm font-medium">录音中...</span>
            </div>
          )}

          {/* Pronunciation Tips */}
          <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm mb-8">
            <h3 className="text-dong-rose font-serif font-bold mb-3">侗语发音要点</h3>
            <ol className="text-sm text-foreground/75 space-y-2 list-decimal list-inside leading-relaxed">
              <li>侗语有6-9个声调，比普通话更复杂</li>
              <li>注意清浊辅音的区别，如"b"和"p"</li>
              <li>鼻音韵尾要发完整，如"-m"、"-n"、"-ng"</li>
              <li>保持稳定的声调，避免调值偏差</li>
            </ol>
          </div>

          {/* Evaluation Result */}
          <div className="mb-8">
            <h3 className="text-dong-rose font-serif font-bold mb-3">评估结果</h3>
            <div className="bg-dong-cream/60 rounded-full px-6 py-4 text-center border border-dong-indigo/10">
              {score !== null ? (
                <div className="flex items-center justify-center gap-4">
                  <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
                  <span className="text-sm text-dong-light">分</span>
                  <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                    score >= 85 ? "bg-green-100 text-green-700" :
                    score >= 70 ? "bg-yellow-100 text-yellow-700" :
                    "bg-red-100 text-red-700"
                  }`}>
                    {getScoreLabel(score)}
                  </span>
                  <Button
                    onClick={() => {
                      setScore(null);
                      setFeedback([]);
                      setComparison(null);
                      setHasRecording(false);
                    }}
                    variant="ghost"
                    size="sm"
                    className="text-dong-light hover:text-dong-indigo"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    重试
                  </Button>
                </div>
              ) : (
                <span className="text-dong-light text-sm">
                  请朗读目标语句并点击"开始录音"按钮
                </span>
              )}
            </div>

            {/* Feedback */}
            {feedback.length > 0 && (
              <div className="mt-4 bg-white rounded-lg p-4 border border-dong-indigo/10">
                <h4 className="text-sm font-semibold text-dong-indigo mb-2">纠音提示：</h4>
                <ul className="text-sm text-foreground/70 space-y-1">
                  {feedback.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-dong-rose mt-0.5">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Pronunciation Comparison */}
          <div className="mb-8">
            <h3 className="text-dong-rose font-serif font-bold mb-3">发音对比</h3>
            <div className="bg-dong-cream/40 rounded-xl p-6 border border-dong-indigo/10 min-h-[120px] flex items-center justify-center">
              {comparison ? (
                <div className="w-full space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-dong-light w-20 flex-shrink-0">标准拼音：</span>
                    <span className="text-dong-indigo font-medium tracking-wider">{comparison.standard}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-dong-light w-20 flex-shrink-0">您的发音：</span>
                    <span className="text-foreground/70 tracking-wider">{comparison.user}</span>
                  </div>
                  {pronunciationData[inputText.trim()] && (
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-dong-light w-20 flex-shrink-0">侗语对照：</span>
                      <span className="text-dong-rose font-medium tracking-wider">
                        {pronunciationData[inputText.trim()]?.dongPinyin}
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-dong-light text-sm">无拼音对比数据</span>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
