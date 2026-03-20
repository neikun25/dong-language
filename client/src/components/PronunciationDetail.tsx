/**
 * 发音详情弹窗组件
 * 展示声调曲线 + 发音指导（已移除口型动画）
 */
import ToneCurve, { ToneBadge } from "./ToneCurve";
import { speakDong, speakText, type DongWord } from "@/lib/dongData";
import { X, Volume2 } from "lucide-react";

interface PronunciationDetailProps {
  word: DongWord;
  onClose: () => void;
}

export default function PronunciationDetail({ word, onClose }: PronunciationDetailProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-[#3a3a6e] to-[#5a5a9e] px-5 py-4 text-white">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-start gap-4 pr-8">
            <div className="flex-1">
              <h3 className="text-2xl font-bold" style={{ fontFamily: "'Noto Serif SC', serif" }}>{word.chinese}</h3>
              <p className="text-white/80 text-base mt-0.5 font-mono">{word.dong}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => speakDong(word.dong, word.dongPinyin)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-400/30 hover:bg-pink-400/50 text-xs transition-colors border border-pink-300/30"
              >
                <Volume2 className="w-3.5 h-3.5" /> 侗语发音
              </button>
              <button
                onClick={() => speakText(word.chinese)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> 普通话
              </button>
            </div>
          </div>
        </div>

        {/* 内容区域 */}
        <div className="p-5 space-y-4">
          {/* 音标信息 */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#f8f6f2] rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">侗语拼写</div>
              <div className="font-bold text-[#3a3a6e] text-lg font-mono">{word.dong}</div>
            </div>
            <div className="bg-[#f8f6f2] rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">IPA 音标</div>
              <div className="font-bold text-[#3a3a6e] text-lg font-mono">{word.dongPinyin}</div>
            </div>
            <div className="bg-[#f8f6f2] rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">普通话拼音</div>
              <div className="font-bold text-[#3a3a6e] text-lg">{word.mandarinPinyin}</div>
            </div>
            {/* 声调标记 */}
            <div className="bg-[#f8f6f2] rounded-xl p-3">
              <div className="text-xs text-gray-400 mb-1">声调标记</div>
              <ToneBadge dongPinyin={word.dongPinyin} toneCode={word.toneCode} syllableType={word.syllableType} />
              {word.toneCode && (
                <div className="text-xs text-gray-500 mt-1">
                  {word.toneCode}调 · {word.syllableType === "checked" ? "促声" : "舒声"}
                </div>
              )}
             </div>
          </div>

          {/* 声调曲线 */}
          <div>
            <h4 className="text-sm font-bold text-[#3a3a6e] mb-2">声调走势</h4>
            <div className="flex justify-center py-4 bg-[#f8f6f2] rounded-xl">
              <ToneCurve
                dongPinyin={word.dongPinyin}
                toneCode={word.toneCode}
                syllableType={word.syllableType}
                size="lg"
                animated
              />
            </div>
          </div>

          {/* 五度标记说明 */}
          <div className="grid grid-cols-5 gap-1.5 text-[10px]">
            {[
              { num: "5", label: "最高", color: "bg-red-50 text-red-600" },
              { num: "4", label: "次高", color: "bg-orange-50 text-orange-600" },
              { num: "3", label: "中", color: "bg-amber-50 text-amber-600" },
              { num: "2", label: "次低", color: "bg-green-50 text-green-600" },
              { num: "1", label: "最低", color: "bg-blue-50 text-blue-600" },
            ].map(({ num, label, color }) => (
              <div key={num} className={`rounded-lg p-1.5 text-center ${color}`}>
                <div className="font-bold text-sm">{num}</div>
                <div>{label}</div>
              </div>
            ))}
          </div>

          {/* 例句 */}
          {word.example && (
            <div className="pt-3 border-t border-[#3a3a6e]/10">
              <div className="text-xs text-gray-400 mb-1">例句</div>
              <p className="text-sm text-[#3a3a6e]">{word.example}</p>
              {word.exampleDong && (
                <p className="text-sm text-pink-600 font-mono mt-0.5">{word.exampleDong}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 内联版发音详情 - 用于词汇卡片中的展开显示
 */
export function InlinePronunciationGuide({ word, className = "" }: { word: DongWord; className?: string }) {
  return (
    <div className={`bg-[#f8f6f2] rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <ToneCurve
            dongPinyin={word.dongPinyin}
            toneCode={word.toneCode}
            syllableType={word.syllableType}
            size="sm"
            animated={false}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ToneBadge dongPinyin={word.dongPinyin} toneCode={word.toneCode} syllableType={word.syllableType} className="mb-1" />
          <div className="text-xs text-gray-500 font-mono">{word.dongPinyin}</div>
          {word.toneCode && (
            <div className="text-xs text-gray-400 mt-0.5">{word.toneCode}调 · {word.syllableType === "checked" ? "促声" : "舒声"}</div>
          )}
        </div>
      </div>
    </div>
  );
}
