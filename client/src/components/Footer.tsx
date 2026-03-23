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
          <div className="w-24 h-24 bg-white rounded-lg overflow-hidden border-2 border-white/30 shadow-lg">
            <img
              src={`${import.meta.env.BASE_URL}wechat-qr.jpg`}
              alt="DongScape侗音绘语公众号二维码"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs text-white/70 font-medium">扫码关注公众号</span>
          <span className="text-[10px] text-white/40">DongScape侗音绘语</span>
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
