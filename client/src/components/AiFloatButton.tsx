/**
 * AI助手浮窗按钮
 * 右下角固定，IP表情包图标来回闪烁，点击跳转AI助手页面
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

declare const __BASE_PATH__: string;
const BASE_URL = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '';

const IP_ICONS = [
  `${BASE_URL}/ip-happy.png`,
  `${BASE_URL}/ip-yes.png`,
];

export default function AiFloatButton() {
  const [iconIndex, setIconIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [, navigate] = useLocation();

  // 每1.2秒切换一次表情图标
  useEffect(() => {
    const timer = setInterval(() => {
      setIconIndex(prev => (prev + 1) % IP_ICONS.length);
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-center gap-1">
      {/* 提示文字 */}
      {hovered && (
        <div
          className="mb-1 px-3 py-1.5 rounded-xl text-xs font-medium text-white shadow-lg whitespace-nowrap animate-fade-in"
          style={{ backgroundColor: "#3a3a6e" }}
        >
          AI学习助手·侗侗
        </div>
      )}
      {/* 浮窗按钮 */}
      <button
        onClick={() => navigate("/ai-assistant")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="w-14 h-14 rounded-full shadow-xl border-2 border-white overflow-hidden transition-transform hover:scale-110 active:scale-95"
        style={{ boxShadow: "0 4px 20px rgba(58,58,110,0.35)" }}
        title="AI学习助手·侗侗"
      >
        <img
          key={iconIndex}
          src={IP_ICONS[iconIndex]}
          alt="AI助手"
          className="w-full h-full object-cover"
          style={{ animation: "fadeSwitch 0.4s ease-in-out" }}
        />
      </button>
      <style>{`
        @keyframes fadeSwitch {
          0% { opacity: 0.5; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
