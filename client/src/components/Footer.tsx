/*
 * Design: 深蓝色页脚
 * 包含网站信息、客服热线、二维码区域
 */
export default function Footer() {
  return (
    <footer className="bg-dong-deep text-white/80 py-8 px-6 mt-auto">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-medium text-dong-rose">
            本站网址：<span className="text-white/70">www.donglanguage.com</span>
          </p>
          <p className="text-sm font-medium text-dong-rose">
            客服热线：<span className="text-white/70">400-888-6688</span>
          </p>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-20 h-20 bg-white/10 rounded-md flex items-center justify-center border border-white/20">
            <svg viewBox="0 0 60 60" className="w-14 h-14 text-white/40">
              <rect x="5" y="5" width="20" height="20" rx="2" fill="currentColor" />
              <rect x="35" y="5" width="20" height="20" rx="2" fill="currentColor" />
              <rect x="5" y="35" width="20" height="20" rx="2" fill="currentColor" />
              <rect x="35" y="35" width="12" height="12" rx="1" fill="currentColor" />
              <rect x="43" y="43" width="12" height="12" rx="1" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xs text-white/50">扫码关注我们</span>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-6 pt-4 border-t border-white/10 text-center">
        <p className="text-xs text-white/40">
          &copy; 2025 侗族语言应用 All Rights Reserved
        </p>
      </div>
    </footer>
  );
}
