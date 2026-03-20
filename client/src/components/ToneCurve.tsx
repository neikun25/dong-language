/**
 * 声调曲线组件
 * 根据侗语拼音中的声调标记(˦˧˩˥等)绘制声调走势曲线
 * 侗语有9个声调（含入声），通过SVG动画展示声调变化
 */
import { useMemo } from "react";

interface ToneCurveProps {
  dongPinyin: string;
  toneCode?: string;   // 直接传入声调编号，优先于解析dongPinyin
  syllableType?: "open" | "checked";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

// 侗语声调系统：
// ˦ (55) 高平调   ˧ (33) 中平调   ˩ (11/21) 低调
// ˧˥ (35) 中升调   ˩˧ (13) 低升调   ˦˩ (51) 高降调
// 入声: ˧ (33p) 中入   ˦ (55p) 高入   ˩ (11p) 低入

interface TonePoint {
  start: number; // 起始音高 0-4 (0=最低, 4=最高)
  end: number;   // 结束音高
  label: string; // 声调名称
  color: string; // 颜色
  isRu: boolean; // 是否入声（短促）
}

// 声调编号到声调点的映射表
const toneCodeMap: Record<string, TonePoint> = {
  "55":  { start: 4, end: 4, label: "高平", color: "#ef4444", isRu: false },
  "35":  { start: 2, end: 4, label: "中升", color: "#4ade80", isRu: false },
  "11":  { start: 0, end: 0, label: "低平", color: "#3b82f6", isRu: false },
  "323": { start: 2, end: 2, label: "曲折", color: "#8b5cf6", isRu: false },  // 特殊处理
  "13":  { start: 0, end: 2, label: "低升", color: "#60a5fa", isRu: false },
  "31":  { start: 2, end: 0, label: "中降", color: "#fb923c", isRu: false },
  "53":  { start: 4, end: 2, label: "高降", color: "#f87171", isRu: false },
  "453": { start: 3, end: 2, label: "升降", color: "#d35400", isRu: false },  // 特殊处理
  "33":  { start: 2, end: 2, label: "中平", color: "#f59e0b", isRu: false },
};

// 上标数字到声调编号的映射
const superscriptToneMap: Record<string, string> = {
  "⁵⁵": "55", "³⁵": "35", "¹¹": "11", "³²³": "323",
  "¹³": "13", "³¹": "31", "⁵³": "53", "⁴⁵³": "453", "³³": "33"
};

function parseToneFromCode(code: string, isRu = false): TonePoint {
  const base = toneCodeMap[code];
  if (!base) return { start: 2, end: 2, label: "中平", color: "#f59e0b", isRu };
  return { ...base, isRu };
}

function parseTone(syllable: string): TonePoint {
  const s = syllable.trim();

  // 促声判断（以p/t/k结尾）
  const baseClean = s.replace(/[¹²³⁴⁵˦˧˩˥]/g, "");
  const isRu = /[ptk]$/.test(baseClean);

  // 优先尝试上标数字格式（⁵⁵/³¹/¹¹等）
  const superMatch = s.match(/(⁴⁵³|[¹²³⁴⁵]{2,3})/);
  if (superMatch) {
    const code = superscriptToneMap[superMatch[1]];
    if (code) return parseToneFromCode(code, isRu);
  }

  // 其次尝试老格式 IPA声调符号
  if (s.includes("˧˥")) return { start: 2, end: 4, label: "中升", color: "#4ade80", isRu: false };
  if (s.includes("˩˧")) return { start: 0, end: 2, label: "低升", color: "#60a5fa", isRu: false };
  if (s.includes("˦˩")) return { start: 4, end: 0, label: "高降", color: "#f87171", isRu: false };
  if (s.includes("˧˩")) return { start: 2, end: 0, label: "中降", color: "#fb923c", isRu: false };
  if (s.includes("˦")) return { start: 4, end: 4, label: isRu ? "高入" : "高平", color: "#ef4444", isRu };
  if (s.includes("˧")) return { start: 2, end: 2, label: isRu ? "中入" : "中平", color: "#f59e0b", isRu };
  if (s.includes("˩")) return { start: 0, end: 0, label: isRu ? "低入" : "低平", color: "#3b82f6", isRu };

  return { start: 2, end: 2, label: "中平", color: "#f59e0b", isRu: false };
}

function parseSyllables(dongPinyin: string, toneCode?: string, syllableType?: "open" | "checked"): { syllable: string; tone: TonePoint }[] {
  const parts = dongPinyin.trim().split(/\s+/);
  const isRu = syllableType === "checked";

  return parts.map((part, i) => {
    // 对于单音节词，使用toneCode直接匹配
    if (toneCode && parts.length === 1) {
      return {
        syllable: part.replace(/[¹²³⁴⁵˦˧˩˥]/g, "").replace(/:/g, ""),
        tone: parseToneFromCode(toneCode, isRu),
      };
    }
    // 对于多音节词，每个音节都从其IPA音标中解析声调（不使用toneCode）
    return {
      syllable: part.replace(/[¹²³⁴⁵˦˧˩˥]/g, "").replace(/:/g, ""),
      tone: parseTone(part),
    };
  });
}

const sizeConfig = {
  sm: { width: 60, height: 28, fontSize: 8, lineWidth: 1.5, dotR: 2 },
  md: { width: 80, height: 36, fontSize: 9, lineWidth: 2, dotR: 2.5 },
  lg: { width: 100, height: 44, fontSize: 10, lineWidth: 2.5, dotR: 3 },
};

export default function ToneCurve({ dongPinyin, toneCode, syllableType, size = "md", animated = true, className = "" }: ToneCurveProps) {
  const syllables = useMemo(() => parseSyllables(dongPinyin, toneCode, syllableType), [dongPinyin, toneCode, syllableType]);
  const cfg = sizeConfig[size];
  
  const totalWidth = syllables.length * cfg.width + 8;
  const svgHeight = cfg.height + 20; // 额外空间给标签
  
  // 音高映射到Y坐标（反转，因为SVG y轴向下）
  const pitchToY = (pitch: number) => {
    const padding = 6;
    return padding + (4 - pitch) * ((cfg.height - 2 * padding) / 4);
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <svg
        width={totalWidth}
        height={svgHeight}
        viewBox={`0 0 ${totalWidth} ${svgHeight}`}
        className="overflow-visible"
      >
        {/* 背景参考线 */}
        {[0, 1, 2, 3, 4].map(level => (
          <line
            key={level}
            x1={4}
            y1={pitchToY(level)}
            x2={totalWidth - 4}
            y2={pitchToY(level)}
            stroke={level === 2 ? "rgba(58,58,110,0.12)" : "rgba(58,58,110,0.05)"}
            strokeWidth={level === 2 ? 0.8 : 0.5}
            strokeDasharray={level === 2 ? "" : "2,2"}
          />
        ))}
        
        {/* 左侧音高标记 */}
        <text x={1} y={pitchToY(4) + 3} fontSize={6} fill="rgba(58,58,110,0.3)" fontFamily="sans-serif">5</text>
        <text x={1} y={pitchToY(2) + 3} fontSize={6} fill="rgba(58,58,110,0.3)" fontFamily="sans-serif">3</text>
        <text x={1} y={pitchToY(0) + 3} fontSize={6} fill="rgba(58,58,110,0.3)" fontFamily="sans-serif">1</text>
        
        {syllables.map((syl, i) => {
          const xStart = 8 + i * cfg.width;
          const xEnd = xStart + cfg.width * 0.65;
          const yStart = pitchToY(syl.tone.start);
          const yEnd = pitchToY(syl.tone.end);
          const xMid = (xStart + xEnd) / 2;
          
          // 入声线更短
          const actualXEnd = syl.tone.isRu ? xStart + cfg.width * 0.35 : xEnd;
          
          // 生成平滑曲线路径
          const path = syl.tone.start === syl.tone.end
            ? `M ${xStart} ${yStart} L ${actualXEnd} ${yEnd}`
            : `M ${xStart} ${yStart} C ${xStart + (actualXEnd - xStart) * 0.3} ${yStart}, ${actualXEnd - (actualXEnd - xStart) * 0.3} ${yEnd}, ${actualXEnd} ${yEnd}`;
          
          return (
            <g key={i}>
              {/* 声调曲线 */}
              <path
                d={path}
                fill="none"
                stroke={syl.tone.color}
                strokeWidth={cfg.lineWidth}
                strokeLinecap="round"
                className={animated ? "tone-curve-animate" : ""}
                style={animated ? {
                  strokeDasharray: 100,
                  strokeDashoffset: 100,
                  animation: `toneDraw 0.6s ease-out ${i * 0.3}s forwards`,
                } : {}}
              />
              
              {/* 起始点 */}
              <circle
                cx={xStart}
                cy={yStart}
                r={cfg.dotR}
                fill={syl.tone.color}
                className={animated ? "opacity-0" : ""}
                style={animated ? {
                  animation: `toneFadeIn 0.3s ease-out ${i * 0.3}s forwards`,
                } : {}}
              />
              
              {/* 终止点 */}
              <circle
                cx={actualXEnd}
                cy={yEnd}
                r={cfg.dotR}
                fill={syl.tone.color}
                className={animated ? "opacity-0" : ""}
                style={animated ? {
                  animation: `toneFadeIn 0.3s ease-out ${i * 0.3 + 0.3}s forwards`,
                } : {}}
              />
              
              {/* 入声标记（短促符号） */}
              {syl.tone.isRu && (
                <line
                  x1={actualXEnd}
                  y1={yEnd - 4}
                  x2={actualXEnd}
                  y2={yEnd + 4}
                  stroke={syl.tone.color}
                  strokeWidth={1.5}
                  opacity={0.6}
                />
              )}
              
              {/* 音节文字 */}
              <text
                x={(xStart + actualXEnd) / 2}
                y={cfg.height + 12}
                textAnchor="middle"
                fontSize={cfg.fontSize}
                fill="rgba(58,58,110,0.7)"
                fontFamily="'Noto Serif SC', serif"
              >
                {syl.syllable}
              </text>
              
              {/* 声调名称 */}
              <text
                x={(xStart + actualXEnd) / 2}
                y={cfg.height + 20}
                textAnchor="middle"
                fontSize={cfg.fontSize - 2}
                fill={syl.tone.color}
                fontFamily="sans-serif"
                fontWeight="500"
              >
                {syl.tone.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/**
 * 紧凑版声调标签 - 用于词汇列表中的内联显示
 */
export function ToneBadge({ dongPinyin, toneCode, syllableType, className = "" }: { dongPinyin: string; toneCode?: string; syllableType?: "open" | "checked"; className?: string }) {
  const syllables = useMemo(() => parseSyllables(dongPinyin, toneCode, syllableType), [dongPinyin, toneCode, syllableType]);
  
  return (
    <div className={`inline-flex items-center gap-0.5 ${className}`}>
      {syllables.map((syl, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-0.5 px-1 py-0.5 rounded text-[9px] font-medium"
          style={{ backgroundColor: `${syl.tone.color}15`, color: syl.tone.color }}
          title={`${syl.syllable}: ${syl.tone.label}${syl.tone.isRu ? "(入声)" : ""}`}
        >
          <ToneArrow start={syl.tone.start} end={syl.tone.end} isRu={syl.tone.isRu} />
          {syl.tone.label}
        </span>
      ))}
    </div>
  );
}

function ToneArrow({ start, end, isRu }: { start: number; end: number; isRu: boolean }) {
  if (isRu) return <span className="text-[8px]">⊣</span>;
  if (start === end) return <span className="text-[8px]">→</span>;
  if (start < end) return <span className="text-[8px]">↗</span>;
  return <span className="text-[8px]">↘</span>;
}
