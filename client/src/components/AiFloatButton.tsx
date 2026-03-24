/**
 * AI助手浮窗按钮
 * 右下角固定，IP表情包图标流畅切换动画，点击跳转AI助手页面
 * 动画序列：happy → (过渡1) → yes → (过渡2) → fighting → (过渡3) → cool → (过渡4) → working → (过渡5) → happy
 */
import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";

declare const __BASE_PATH__: string;
const BASE_URL = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '';

// 动画帧序列：原版表情 + 过渡帧交替排列，形成流畅动画
const FRAMES = [
  { src: `${BASE_URL}/ip-happy.png`,        duration: 1800, label: "开心" },
  { src: `${BASE_URL}/ip-transition-1.png`, duration: 350,  label: "" },     // happy→yes 过渡
  { src: `${BASE_URL}/ip-yes.png`,          duration: 1800, label: "自信" },
  { src: `${BASE_URL}/ip-transition-2.png`, duration: 350,  label: "" },     // yes→fighting 过渡
  { src: `${BASE_URL}/ip-fighting.png`,     duration: 1800, label: "加油" },
  { src: `${BASE_URL}/ip-transition-3.png`, duration: 350,  label: "" },     // fighting→cool 过渡
  { src: `${BASE_URL}/ip-cool.png`,         duration: 1800, label: "酷" },
  { src: `${BASE_URL}/ip-transition-4.png`, duration: 350,  label: "" },     // cool→working 过渡
  { src: `${BASE_URL}/ip-working.png`,      duration: 1800, label: "努力" },
  { src: `${BASE_URL}/ip-transition-5.png`, duration: 350,  label: "" },     // working→happy 过渡
];

export default function AiFloatButton() {
  const [frameIndex, setFrameIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 动画驱动：根据每帧的 duration 动态调度
  useEffect(() => {
    const scheduleNext = (index: number) => {
      const frame = FRAMES[index];
      timerRef.current = setTimeout(() => {
        // 淡出
        setOpacity(0);
        setTimeout(() => {
          const nextIndex = (index + 1) % FRAMES.length;
          setFrameIndex(nextIndex);
          setOpacity(1);
          scheduleNext(nextIndex);
        }, 200); // 200ms 淡出后切换
      }, frame.duration);
    };

    scheduleNext(frameIndex);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // 只在挂载时启动一次

  const currentFrame = FRAMES[frameIndex];
  const currentLabel = FRAMES[frameIndex].label;

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-1">
      {/* 表情标签 */}
      {hovered && currentLabel && (
        <div
          className="mb-1 px-3 py-1.5 rounded-xl text-xs font-medium text-white shadow-lg whitespace-nowrap"
          style={{
            backgroundColor: "#3a3a6e",
            animation: "fadeInUp 0.2s ease-out",
          }}
        >
          AI学习助手·侗侗
        </div>
      )}

      {/* 浮窗按钮 */}
      <button
        onClick={() => navigate("/ai-assistant")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-20 h-20 rounded-full border-[3px] border-white overflow-hidden transition-transform hover:scale-110 active:scale-95"
        style={{
          boxShadow: "0 4px 20px rgba(58,58,110,0.35)",
          background: "white",
        }}
        title="AI学习助手·侗侗"
      >
        <img
          src={currentFrame.src}
          alt="AI助手·侗侗"
          className="w-full h-full object-cover"
          style={{
            opacity,
            transition: "opacity 0.2s ease-in-out",
            objectPosition: "center top",
          }}
        />
      </button>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
