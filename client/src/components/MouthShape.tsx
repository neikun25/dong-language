/**
 * 口型动画组件
 * 根据侗语拼音的音素展示口型变化动画
 * 帮助学习者理解发音时的口腔形态
 */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";

interface MouthShapeProps {
  dongPinyin: string;
  dong: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

// 口型形态定义
interface MouthForm {
  // 嘴唇参数 (0-1)
  openness: number;    // 张开度
  width: number;       // 宽度（展唇/圆唇）
  roundness: number;   // 圆度
  tonguePos: string;   // 舌位描述
  lipShape: string;    // 唇形描述
  tipText: string;     // 发音提示
}

// 侗语音素到口型的映射
const phonemeToMouth: Record<string, MouthForm> = {
  // 元音
  "a": { openness: 0.85, width: 0.7, roundness: 0.2, tonguePos: "舌位低，舌面平", lipShape: "大开口", tipText: "嘴巴张大，舌头放平" },
  "e": { openness: 0.5, width: 0.65, roundness: 0.25, tonguePos: "舌位中，舌面微抬", lipShape: "半开口", tipText: "嘴巴半开，舌面微抬" },
  "i": { openness: 0.15, width: 0.8, roundness: 0.1, tonguePos: "舌位高，舌面前抬", lipShape: "展唇", tipText: "嘴角向两侧展开，舌尖抵下齿" },
  "o": { openness: 0.55, width: 0.4, roundness: 0.8, tonguePos: "舌位中后，舌面后抬", lipShape: "圆唇半开", tipText: "嘴唇收圆，舌头后缩" },
  "u": { openness: 0.25, width: 0.3, roundness: 0.9, tonguePos: "舌位高后，舌面后高抬", lipShape: "圆唇", tipText: "嘴唇收圆突出，开口小" },
  "ae": { openness: 0.7, width: 0.75, roundness: 0.15, tonguePos: "舌位低前", lipShape: "大展唇", tipText: "嘴巴张大，嘴角展开" },
  "ou": { openness: 0.4, width: 0.35, roundness: 0.85, tonguePos: "舌位中后→高后", lipShape: "圆唇渐收", tipText: "从半圆唇滑向小圆唇" },
  "iu": { openness: 0.2, width: 0.5, roundness: 0.6, tonguePos: "舌位高前→高后", lipShape: "展唇→圆唇", tipText: "从展唇滑向圆唇" },
  "ei": { openness: 0.35, width: 0.7, roundness: 0.2, tonguePos: "舌位中→高前", lipShape: "半开→展唇", tipText: "从半开口滑向展唇" },
  "ai": { openness: 0.6, width: 0.75, roundness: 0.15, tonguePos: "舌位低→高前", lipShape: "大开→展唇", tipText: "从大开口滑向展唇" },
  "au": { openness: 0.6, width: 0.5, roundness: 0.5, tonguePos: "舌位低→高后", lipShape: "大开→圆唇", tipText: "从大开口滑向圆唇" },
  // 辅音（影响口型的）
  "m": { openness: 0.0, width: 0.5, roundness: 0.3, tonguePos: "双唇闭合，气流从鼻腔出", lipShape: "闭唇", tipText: "双唇轻闭，气从鼻子出" },
  "n": { openness: 0.1, width: 0.5, roundness: 0.2, tonguePos: "舌尖抵上齿龈", lipShape: "微开", tipText: "舌尖顶住上牙龈，气从鼻子出" },
  "ng": { openness: 0.15, width: 0.5, roundness: 0.3, tonguePos: "舌根抵软腭", lipShape: "微开", tipText: "舌根抬起抵住软腭" },
  "p": { openness: 0.0, width: 0.5, roundness: 0.3, tonguePos: "双唇闭合后弹开", lipShape: "闭唇→弹开", tipText: "双唇紧闭后快速弹开" },
  "t": { openness: 0.1, width: 0.5, roundness: 0.2, tonguePos: "舌尖抵上齿龈后弹开", lipShape: "微开", tipText: "舌尖顶住上牙龈后弹开" },
  "k": { openness: 0.15, width: 0.5, roundness: 0.3, tonguePos: "舌根抵软腭后弹开", lipShape: "微开", tipText: "舌根抬起后快速弹开" },
  "s": { openness: 0.1, width: 0.65, roundness: 0.1, tonguePos: "舌尖接近上齿龈", lipShape: "展唇微开", tipText: "舌尖接近上牙龈，气流从缝隙出" },
  "l": { openness: 0.15, width: 0.55, roundness: 0.2, tonguePos: "舌尖抵上齿龈，气从两侧出", lipShape: "微开", tipText: "舌尖顶住上牙龈，气从舌两侧出" },
  "ny": { openness: 0.15, width: 0.6, roundness: 0.2, tonguePos: "舌面前部抵硬腭", lipShape: "展唇微开", tipText: "舌面贴住上腭前部，气从鼻腔出" },
  "default": { openness: 0.3, width: 0.5, roundness: 0.3, tonguePos: "自然放松", lipShape: "自然", tipText: "口腔自然放松" },
};

function getPhonemes(dongPinyin: string): { phoneme: string; mouth: MouthForm; duration: number }[] {
  const syllables = dongPinyin.replace(/[˦˧˩˥:]/g, "").trim().split(/\s+/);
  const result: { phoneme: string; mouth: MouthForm; duration: number }[] = [];
  
  for (const syl of syllables) {
    const lower = syl.toLowerCase();
    // 解析音节的声母和韵母
    let i = 0;
    
    // 检测声母
    if (lower.startsWith("ny")) {
      result.push({ phoneme: "ny", mouth: phonemeToMouth["ny"], duration: 300 });
      i = 2;
    } else if (lower.startsWith("ng")) {
      result.push({ phoneme: "ng", mouth: phonemeToMouth["ng"], duration: 300 });
      i = 2;
    } else if ("mnptksl".includes(lower[0] || "")) {
      const c = lower[0];
      result.push({ phoneme: c, mouth: phonemeToMouth[c] || phonemeToMouth["default"], duration: 250 });
      i = 1;
      // 检查送气 h
      if (lower[1] === "h" && "ptk".includes(c)) i = 2;
    } else if (lower[0] === "ɲ") {
      result.push({ phoneme: "ny", mouth: phonemeToMouth["ny"], duration: 300 });
      i = 1;
    } else if (lower[0] === "ɣ") {
      result.push({ phoneme: "g(浊)", mouth: phonemeToMouth["default"], duration: 250 });
      i = 1;
    } else if (lower[0] === "n" && lower[1] === "̥") {
      result.push({ phoneme: "hn", mouth: phonemeToMouth["n"], duration: 300 });
      i = 2;
    }
    
    // 解析韵母
    const vowelPart = lower.slice(i);
    if (vowelPart.length > 0) {
      // 检查复合韵母
      const diph = ["ae", "ou", "iu", "ei", "ai", "au"];
      let matched = false;
      for (const d of diph) {
        if (vowelPart.startsWith(d)) {
          result.push({ phoneme: d, mouth: phonemeToMouth[d], duration: 500 });
          const rest = vowelPart.slice(d.length);
          if (rest && phonemeToMouth[rest]) {
            result.push({ phoneme: rest, mouth: phonemeToMouth[rest], duration: 250 });
          }
          matched = true;
          break;
        }
      }
      if (!matched) {
        // 单元音
        const firstVowel = vowelPart[0];
        if (phonemeToMouth[firstVowel]) {
          result.push({ phoneme: firstVowel, mouth: phonemeToMouth[firstVowel], duration: 400 });
        }
        // 韵尾
        const tail = vowelPart.slice(1);
        if (tail === "ng" || tail === "ŋ") {
          result.push({ phoneme: "ng", mouth: phonemeToMouth["ng"], duration: 300 });
        } else if (tail === "n") {
          result.push({ phoneme: "n", mouth: phonemeToMouth["n"], duration: 250 });
        } else if (tail === "m") {
          result.push({ phoneme: "m", mouth: phonemeToMouth["m"], duration: 250 });
        } else if ("ptk".includes(tail)) {
          result.push({ phoneme: tail + "(入声)", mouth: phonemeToMouth[tail] || phonemeToMouth["default"], duration: 150 });
        }
      }
    }
    
    // 音节间停顿
    result.push({ phoneme: "·", mouth: phonemeToMouth["default"], duration: 200 });
  }
  
  // 移除最后的停顿
  if (result.length > 0 && result[result.length - 1].phoneme === "·") {
    result.pop();
  }
  
  return result;
}

const sizeMap = {
  sm: { w: 48, h: 48, face: 44 },
  md: { w: 64, h: 64, face: 58 },
  lg: { w: 80, h: 80, face: 72 },
};

export default function MouthShape({ dongPinyin, dong, size = "md", className = "" }: MouthShapeProps) {
  const phonemes = useMemo(() => getPhonemes(dongPinyin), [dongPinyin]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dim = sizeMap[size];
  
  const currentMouth = currentIndex >= 0 && currentIndex < phonemes.length
    ? phonemes[currentIndex].mouth
    : phonemeToMouth["default"];
  
  const currentPhoneme = currentIndex >= 0 && currentIndex < phonemes.length
    ? phonemes[currentIndex]
    : null;

  const playAnimation = useCallback(() => {
    if (phonemes.length === 0) return;
    setIsPlaying(true);
    setCurrentIndex(0);
    
    let idx = 0;
    const step = () => {
      if (idx >= phonemes.length - 1) {
        timerRef.current = setTimeout(() => {
          setCurrentIndex(-1);
          setIsPlaying(false);
        }, phonemes[phonemes.length - 1].duration);
        return;
      }
      timerRef.current = setTimeout(() => {
        idx++;
        setCurrentIndex(idx);
        step();
      }, phonemes[idx].duration);
    };
    step();
  }, [phonemes]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // 嘴巴SVG绘制
  const mouthCx = dim.w / 2;
  const mouthCy = dim.h * 0.58;
  const mouthW = 8 + currentMouth.width * (dim.face * 0.35);
  const mouthH = 3 + currentMouth.openness * (dim.face * 0.28);
  const mouthRound = currentMouth.roundness;

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      {/* 口型动画区域 */}
      <button
        onClick={playAnimation}
        disabled={isPlaying}
        className="relative group cursor-pointer"
        title="点击播放口型动画"
      >
        <svg width={dim.w} height={dim.h} viewBox={`0 0 ${dim.w} ${dim.h}`}>
          {/* 脸部轮廓 */}
          <ellipse
            cx={mouthCx}
            cy={dim.h * 0.45}
            rx={dim.face * 0.4}
            ry={dim.face * 0.45}
            fill="#fde8d0"
            stroke="#e8c9a8"
            strokeWidth={1}
          />
          
          {/* 眼睛 */}
          <ellipse cx={mouthCx - dim.face * 0.13} cy={dim.h * 0.32} rx={2.5} ry={3} fill="#3a3a6e" />
          <ellipse cx={mouthCx + dim.face * 0.13} cy={dim.h * 0.32} rx={2.5} ry={3} fill="#3a3a6e" />
          
          {/* 眼白高光 */}
          <circle cx={mouthCx - dim.face * 0.13 + 0.8} cy={dim.h * 0.31} r={0.8} fill="white" />
          <circle cx={mouthCx + dim.face * 0.13 + 0.8} cy={dim.h * 0.31} r={0.8} fill="white" />
          
          {/* 嘴巴 */}
          {currentMouth.openness < 0.05 ? (
            // 闭嘴
            <line
              x1={mouthCx - mouthW / 2}
              y1={mouthCy}
              x2={mouthCx + mouthW / 2}
              y2={mouthCy}
              stroke="#c97a6d"
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          ) : mouthRound > 0.6 ? (
            // 圆唇
            <ellipse
              cx={mouthCx}
              cy={mouthCy}
              rx={mouthW * 0.45}
              ry={mouthH * 0.5}
              fill="#c97a6d"
              stroke="#b06a5d"
              strokeWidth={0.8}
              style={{ transition: "all 0.15s ease-out" }}
            />
          ) : (
            // 展唇/半开
            <ellipse
              cx={mouthCx}
              cy={mouthCy}
              rx={mouthW * 0.5}
              ry={mouthH * 0.5}
              fill="#c97a6d"
              stroke="#b06a5d"
              strokeWidth={0.8}
              style={{ transition: "all 0.15s ease-out" }}
            />
          )}
          
          {/* 嘴巴内部（张开时显示） */}
          {currentMouth.openness > 0.3 && (
            <ellipse
              cx={mouthCx}
              cy={mouthCy + 1}
              rx={mouthW * 0.35}
              ry={mouthH * 0.3}
              fill="#8b3a3a"
              style={{ transition: "all 0.15s ease-out" }}
            />
          )}
          
          {/* 舌头（张开较大时显示） */}
          {currentMouth.openness > 0.5 && (
            <ellipse
              cx={mouthCx}
              cy={mouthCy + mouthH * 0.2}
              rx={mouthW * 0.25}
              ry={mouthH * 0.15}
              fill="#d4726a"
              style={{ transition: "all 0.15s ease-out" }}
            />
          )}
        </svg>
        
        {/* 播放提示 */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 rounded-full transition-colors">
            <span className="text-transparent group-hover:text-dong-indigo text-[10px] font-medium transition-colors">
              ▶ 口型
            </span>
          </div>
        )}
      </button>
      
      {/* 当前音素提示 */}
      {isPlaying && currentPhoneme && currentPhoneme.phoneme !== "·" && (
        <div className="mt-1 text-center animate-in fade-in duration-150">
          <span className="text-xs font-bold text-dong-rose">{currentPhoneme.phoneme}</span>
          <p className="text-[9px] text-dong-light leading-tight max-w-[100px]">{currentPhoneme.mouth.tipText}</p>
        </div>
      )}
    </div>
  );
}

/**
 * 紧凑版口型提示 - 用于词汇列表中的内联显示
 * 显示关键音素的口型描述
 */
export function MouthTip({ dongPinyin, className = "" }: { dongPinyin: string; className?: string }) {
  const phonemes = useMemo(() => getPhonemes(dongPinyin), [dongPinyin]);
  
  // 只取元音和关键辅音的提示
  const tips = phonemes
    .filter(p => p.phoneme !== "·" && p.mouth.tipText !== "口腔自然放松")
    .slice(0, 3);
  
  if (tips.length === 0) return null;
  
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {tips.map((tip, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-50 text-[9px] text-amber-700 border border-amber-100"
          title={tip.mouth.tipText}
        >
          <MouthIcon openness={tip.mouth.openness} roundness={tip.mouth.roundness} />
          {tip.mouth.lipShape}
        </span>
      ))}
    </div>
  );
}

/**
 * 微型口型图标
 */
function MouthIcon({ openness, roundness }: { openness: number; roundness: number }) {
  const w = 10;
  const h = 10;
  const mw = 2 + (1 - roundness) * 3;
  const mh = 1 + openness * 3;
  
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="inline-block">
      <ellipse cx={w / 2} cy={h / 2} rx={mw} ry={mh} fill="#d97706" opacity={0.6} />
    </svg>
  );
}
