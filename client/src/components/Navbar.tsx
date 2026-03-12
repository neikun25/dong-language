/*
 * Design: 侗族语言应用 - 青蓝雅致主题
 * 导航栏: 深靛蓝紫色背景(dong-indigo), 白色文字
 * Logo区域在上方, 导航菜单在下方
 * 搜索框带麦克风图标
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Mic, ChevronDown } from "lucide-react";

const navItems = [
  { label: "首页", path: "/" },
  { label: "侗语纠音", path: "/pronunciation" },
  { label: "普通话纠音", path: "/pronunciation" },
  { label: "普通话学习", path: "/" },
  { label: "侗语学习", path: "/" },
  { label: "侗族文化", path: "/culture" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Logo Area */}
      <div className="bg-dong-deep/95 backdrop-blur-sm py-3 px-6 flex items-center justify-between">
        <div className="flex-1" />
        <Link href="/" className="flex items-center gap-3 group">
          {/* Logo SVG */}
          <div className="w-12 h-12 rounded-full bg-dong-rose/20 flex items-center justify-center border-2 border-dong-rose/40 group-hover:border-dong-rose/70 transition-colors">
            <svg viewBox="0 0 40 40" className="w-8 h-8">
              <circle cx="20" cy="20" r="8" fill="none" stroke="#c75c8e" strokeWidth="2" />
              <line x1="20" y1="12" x2="20" y2="8" stroke="#c75c8e" strokeWidth="2" />
              <line x1="20" y1="28" x2="20" y2="32" stroke="#c75c8e" strokeWidth="2" />
              <path d="M14 16 Q20 6 26 16" fill="none" stroke="#c75c8e" strokeWidth="1.5" />
              <path d="M12 18 Q20 4 28 18" fill="none" stroke="#c75c8e" strokeWidth="1" opacity="0.6" />
              <line x1="16" y1="22" x2="16" y2="28" stroke="#c75c8e" strokeWidth="1.5" />
              <line x1="20" y1="22" x2="20" y2="30" stroke="#c75c8e" strokeWidth="1.5" />
              <line x1="24" y1="22" x2="24" y2="28" stroke="#c75c8e" strokeWidth="1.5" />
            </svg>
          </div>
          <div>
            <h1 className="text-white text-2xl font-serif font-bold tracking-wider">
              侗族语言应用
            </h1>
            <p className="text-white/60 text-xs tracking-[0.3em] font-['Crimson_Text']">
              Application of Dong Language
            </p>
          </div>
        </Link>
        <div className="flex-1 flex justify-end">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索"
              className="bg-white/10 border border-white/20 rounded-md px-4 py-2 pr-10 text-white placeholder-white/50 text-sm w-44 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all"
            />
            <Mic className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-dong-indigo border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`px-6 py-3.5 text-sm tracking-wider transition-all relative
                ${location === item.path
                  ? "text-white font-medium"
                  : "text-white/75 hover:text-white"
                }
              `}
            >
              {item.label}
              {location === item.path && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-dong-rose rounded-full" />
              )}
            </Link>
          ))}

          {/* 个人中心 Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`px-6 py-3.5 text-sm tracking-wider transition-all flex items-center gap-1
                ${["/login", "/message"].includes(location)
                  ? "text-white font-medium"
                  : "text-white/75 hover:text-white"
                }
              `}
            >
              个人中心
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-0 bg-dong-indigo/95 backdrop-blur-sm border border-white/10 rounded-b-md shadow-xl min-w-[120px] overflow-hidden z-50">
                <Link
                  href="/message"
                  className="block px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  留言
                </Link>
                <Link
                  href="/login"
                  className="block px-5 py-3 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  登录
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
