/*
 * Design: 侗族语言应用 - 青蓝雅致主题
 * 导航栏: 深靛蓝紫色背景, 白色文字
 * Logo区域在上方, 导航菜单在下方
 * 全局搜索功能 + 移动端菜单
 * 已移除登录/注册相关功能
 */
import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Volume2 } from "lucide-react";
import { searchWords, speakText, speakDong, type DongWord } from "@/lib/dongData";
import { ToneBadge } from "@/components/ToneCurve";

const LOGO_CDN = "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-logo-icon_8cbb45a7.png";

const navItems = [
  { label: "首页", path: "/" },
  { label: "侗语纠音", path: "/pronunciation" },
  { label: "普通话纠音", path: "/mandarin-pronunciation" },
  { label: "普通话学习", path: "/mandarin-learn" },
  { label: "侗语学习", path: "/dong-learn" },
  { label: "声调练习", path: "/tone-compare" },
  { label: "田野录音", path: "/field-data" },
  { label: "侗族文化", path: "/culture" },
  { label: "留言反馈", path: "/message" },
];

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<DongWord[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (q.trim().length > 0) {
      const results = searchWords(q.trim());
      setSearchResults(results.slice(0, 8));
      setShowSearchResults(true);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  return (
    <header className="w-full sticky top-0 z-50">
      {/* Top Logo Area */}
      <div className="bg-dong-deep/95 backdrop-blur-sm py-3 px-4 md:px-6 flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          className="md:hidden text-white/80 hover:text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="hidden md:flex flex-1" />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-dong-rose/10 flex items-center justify-center border-2 border-dong-rose/30 group-hover:border-dong-rose/60 transition-colors overflow-hidden">
            <img
              src={LOGO_CDN}
              alt="侗族语言应用 Logo"
              className="w-full h-full object-contain"
              onError={(e) => {
                // 加载失败时显示备用SVG图标
                const target = e.currentTarget;
                target.style.display = "none";
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<svg viewBox="0 0 40 40" class="w-7 h-7 md:w-8 md:h-8">
                    <circle cx="20" cy="20" r="8" fill="none" stroke="#c75c8e" stroke-width="2"/>
                    <line x1="20" y1="12" x2="20" y2="8" stroke="#c75c8e" stroke-width="2"/>
                    <line x1="20" y1="28" x2="20" y2="32" stroke="#c75c8e" stroke-width="2"/>
                    <path d="M14 16 Q20 6 26 16" fill="none" stroke="#c75c8e" stroke-width="1.5"/>
                    <line x1="16" y1="22" x2="16" y2="28" stroke="#c75c8e" stroke-width="1.5"/>
                    <line x1="20" y1="22" x2="20" y2="30" stroke="#c75c8e" stroke-width="1.5"/>
                    <line x1="24" y1="22" x2="24" y2="28" stroke="#c75c8e" stroke-width="1.5"/>
                  </svg>`;
                }
              }}
            />
          </div>
          <div>
            <h1 className="text-white text-xl md:text-2xl font-serif font-bold tracking-wider">
              侗族语言应用
            </h1>
            <p className="text-white/60 text-[10px] md:text-xs tracking-[0.3em] font-['Crimson_Text']">
              Application of Dong Language
            </p>
          </div>
        </Link>

        {/* Search */}
        <div className="flex-1 flex justify-end" ref={searchRef}>
          <div className="relative">
            <input
              type="text"
              placeholder="搜索侗语词汇..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
              className="bg-white/10 border border-white/20 rounded-md px-3 md:px-4 py-2 pr-10 text-white placeholder-white/50 text-sm w-32 md:w-52 focus:outline-none focus:border-white/40 focus:bg-white/15 focus:w-48 md:focus:w-64 transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/60" />

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-dong-indigo/10 w-72 md:w-96 max-h-80 overflow-y-auto z-50">
                <div className="p-2">
                  <p className="text-xs text-dong-light px-3 py-1">
                    找到 {searchResults.length} 个结果
                  </p>
                  {searchResults.map((word) => (
                    <div
                      key={word.id}
                      className="flex items-center justify-between px-3 py-2.5 hover:bg-dong-cream/50 rounded-md transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-dong-indigo text-sm">{word.chinese}</span>
                          <span className="text-dong-rose text-xs">{word.dong}</span>
                        </div>
                        <p className="text-xs text-dong-light mt-0.5">{word.dongPinyin}</p>
                        <ToneBadge dongPinyin={word.dongPinyin} className="mt-0.5" />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => speakDong(word.dong, word.dongPinyin)}
                          className="text-dong-rose hover:text-dong-indigo p-1 transition-colors text-[10px] flex items-center gap-0.5"
                          title="侗语发音"
                        >
                          <Volume2 className="w-3.5 h-3.5" />侗
                        </button>
                        <button
                          onClick={() => speakText(word.chinese)}
                          className="text-dong-light hover:text-dong-indigo p-1 transition-colors text-[10px] flex items-center gap-0.5"
                          title="普通话发音"
                        >
                          <Volume2 className="w-3.5 h-3.5" />普
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-dong-indigo/10 p-2">
                  <button
                    onClick={() => {
                      setShowSearchResults(false);
                      window.location.href = "/dong-learn";
                    }}
                    className="w-full text-center text-xs text-dong-indigo hover:text-dong-rose py-1.5 transition-colors"
                  >
                    前往侗语学习查看更多 →
                  </button>
                </div>
              </div>
            )}
            {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-xl border border-dong-indigo/10 w-64 p-4 z-50">
                <p className="text-sm text-dong-light text-center">未找到相关词汇</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:block bg-dong-indigo border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex items-center justify-center gap-0 flex-wrap">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.path}
              className={`px-4 lg:px-5 py-3.5 text-sm tracking-wider transition-all relative whitespace-nowrap
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
        </div>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-dong-indigo/95 backdrop-blur-md border-t border-white/10">
          <div className="flex flex-col">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.path}
                className={`px-6 py-3.5 text-sm tracking-wider transition-all border-b border-white/5
                  ${location === item.path
                    ? "text-white font-medium bg-white/5"
                    : "text-white/75 hover:text-white hover:bg-white/5"
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
