/**
 * 发音详情弹窗组件
 * 整合声调曲线图示 + 口型动画 + 发音指导
 * 点击词汇时弹出，提供完整的发音学习体验
 */
import { useState } from "react";
import { X, Volume2, Play } from "lucide-react";
import ToneCurve, { ToneBadge } from "./ToneCurve";
import MouthShape, { MouthTip } from "./MouthShape";
import { speakDong, speakText, type DongWord } from "@/lib/dongData";
import { Button } from "@/components/ui/button";

interface PronunciationDetailProps {
  word: DongWord;
  onClose: () => void;
}

export default function PronunciationDetail({ word, onClose }: PronunciationDetailProps) {
  const [activeTab, setActiveTab] = useState<"tone" | "mouth">("tone");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="bg-gradient-to-r from-dong-indigo to-dong-deep px-5 py-4 text-white">
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-4">
            <div>
              <h3 className="text-2xl font-serif font-bold">{word.chinese}</h3>
              <p className="text-white/80 text-sm mt-0.5">{word.dong}</p>
            </div>
            <div className="flex gap-2 ml-auto mr-6">
              <button
                onClick={() => speakDong(word.dong, word.dongPinyin)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> 侗语
              </button>
              <button
                onClick={() => speakText(word.chinese)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-xs transition-colors"
              >
                <Volume2 className="w-3.5 h-3.5" /> 普通话
              </button>
            </div>
          </div>
          <div className="flex gap-4 mt-2 text-xs text-white/70">
            <span>侗语音标: <span className="text-white/90">{word.dongPinyin}</span></span>
            <span>普通话拼音: <span className="text-white/90">{word.mandarinPinyin}</span></span>
          </div>
        </div>

        {/* 标签切换 */}
        <div className="flex border-b border-dong-indigo/10">
          <button
            onClick={() => setActiveTab("tone")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "tone"
                ? "text-dong-indigo border-b-2 border-dong-indigo"
                : "text-dong-light hover:text-dong-indigo"
            }`}
          >
            声调曲线
          </button>
          <button
            onClick={() => setActiveTab("mouth")}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              activeTab === "mouth"
                ? "text-dong-indigo border-b-2 border-dong-indigo"
                : "text-dong-light hover:text-dong-indigo"
            }`}
          >
            口型动画
          </button>
        </div>

        {/* 内容区域 */}
        <div className="p-5">
          {activeTab === "tone" && (
            <div className="space-y-4">
              {/* 声调曲线 */}
              <div className="flex justify-center py-3 bg-dong-cream/30 rounded-xl">
                <ToneCurve dongPinyin={word.dongPinyin} size="lg" animated />
              </div>
              
              {/* 声调说明 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-dong-indigo">声调解读</h4>
                <ToneBadge dongPinyin={word.dongPinyin} className="mb-2" />
                <div className="bg-dong-cream/30 rounded-lg p-3">
                  <p className="text-xs text-dong-light leading-relaxed">
                    侗语声调系统较为丰富，共有9个声调（含入声）。声调曲线中，
                    <span className="text-red-500 font-medium">红色</span>表示高调，
                    <span className="text-amber-500 font-medium">橙色</span>表示中调，
                    <span className="text-blue-500 font-medium">蓝色</span>表示低调，
                    <span className="text-green-500 font-medium">绿色</span>表示升调。
                    竖线标记表示入声（短促音节）。
                  </p>
                </div>
                
                {/* 五度标记法说明 */}
                <div className="grid grid-cols-3 gap-2 text-[10px]">
                  <div className="bg-red-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-red-600">5 (˦)</div>
                    <div className="text-red-500">高</div>
                  </div>
                  <div className="bg-amber-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-amber-600">3 (˧)</div>
                    <div className="text-amber-500">中</div>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <div className="font-bold text-blue-600">1 (˩)</div>
                    <div className="text-blue-500">低</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mouth" && (
            <div className="space-y-4">
              {/* 口型动画 */}
              <div className="flex justify-center py-3 bg-dong-cream/30 rounded-xl">
                <MouthShape dongPinyin={word.dongPinyin} dong={word.dong} size="lg" />
              </div>
              
              {/* 口型提示 */}
              <div className="space-y-2">
                <h4 className="text-sm font-bold text-dong-indigo">发音口型</h4>
                <MouthTip dongPinyin={word.dongPinyin} />
                <div className="bg-dong-cream/30 rounded-lg p-3">
                  <p className="text-xs text-dong-light leading-relaxed">
                    点击上方的脸部图标播放口型动画。动画会逐个展示每个音素的口腔形态变化，
                    包括嘴唇张合度、圆展程度和舌位高低。跟随动画模仿口型，有助于掌握正确发音。
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 例句 */}
          {word.example && (
            <div className="mt-4 pt-3 border-t border-dong-indigo/10">
              <p className="text-xs text-dong-light">
                例句: <span className="text-dong-indigo">{word.example}</span>
                {word.exampleDong && <span className="text-dong-rose ml-2">({word.exampleDong})</span>}
              </p>
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
    <div className={`bg-dong-cream/30 rounded-lg p-3 ${className}`}>
      <div className="flex items-start gap-3">
        {/* 声调曲线 */}
        <div className="flex-shrink-0">
          <ToneCurve dongPinyin={word.dongPinyin} size="sm" animated={false} />
        </div>
        {/* 口型提示 */}
        <div className="flex-1 min-w-0">
          <ToneBadge dongPinyin={word.dongPinyin} className="mb-1" />
          <MouthTip dongPinyin={word.dongPinyin} />
        </div>
      </div>
    </div>
  );
}
