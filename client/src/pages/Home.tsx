/*
 * Design: 侗族语言应用主页 - 文化传播与语言学习平台
 * 轮播图 + 平台介绍 + 快速入口 + 翻译搜索 + 学习进度 + 热门课程
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Search, Volume2, BookOpen, Mic, MessageSquare, Globe, Star, ChevronRight, Music } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { dongDictionary, dongLessons, speakText, speakDong, speakDongByChinese, searchWords, type DongWord } from "@/lib/dongData";
import PronunciationDetail, { InlinePronunciationGuide } from "@/components/PronunciationDetail";
import { ToneBadge } from "@/components/ToneCurve";

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<DongWord[]>([]);
  const [searched, setSearched] = useState(false);
  const [detailWord, setDetailWord] = useState<DongWord | null>(null);

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      toast.info("请输入要查询的中文词汇");
      return;
    }
    const found = searchWords(trimmed);
    setSearched(true);
    setResults(found);
    if (found.length === 0) {
      toast.info("未找到相关词汇，请尝试其他关键词");
    }
  };

  const quickEntries = [
    { icon: BookOpen, label: "侗语学习", desc: "系统学习侗语词汇", path: "/dong-learn", color: "bg-blue-50 text-blue-600 border-blue-100" },
    { icon: Globe, label: "普通话学习", desc: "提升普通话水平", path: "/mandarin-learn", color: "bg-green-50 text-green-600 border-green-100" },
    { icon: Mic, label: "发音纠音", desc: "AI评分纠正发音", path: "/pronunciation", color: "bg-purple-50 text-purple-600 border-purple-100" },
    { icon: Music, label: "声调练习", desc: "对比学习侗语声调", path: "/tone-compare", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
    { icon: Star, label: "侗族文化", desc: "探索侗族文化瑰宝", path: "/culture", color: "bg-amber-50 text-amber-600 border-amber-100" },
    { icon: MessageSquare, label: "留言交流", desc: "分享学习心得", path: "/message", color: "bg-rose-50 text-rose-600 border-rose-100" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* Platform Introduction */}
      <section className="py-12 px-4">
        <div className="max-w-[1100px] mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-serif text-dong-indigo font-bold mb-4">
            侗族文化传播与语言学习平台
          </h2>
          <p className="text-dong-light text-sm md:text-base max-w-[700px] mx-auto leading-relaxed mb-3">
            致力于侗族语言文化的保护与传承，提供侗语学习、普通话提升、发音纠正等功能，
            让更多人了解和学习侗族这一珍贵的民族文化遗产。
          </p>
          <div className="flex items-center justify-center gap-6 text-xs text-dong-light mt-4">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-dong-rose" />{dongDictionary.length}+ 侗语词汇</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-dong-indigo" />{dongLessons.length} 节课程</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-dong-gold" />AI发音评分</span>
          </div>
        </div>
      </section>

      {/* Quick Entry Cards */}
      <section className="pb-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {quickEntries.map((entry) => (
              <Link key={entry.label} href={entry.path}>
                <div className={`rounded-xl p-4 border transition-all hover:shadow-md hover:-translate-y-0.5 ${entry.color} h-full`}>
                  <entry.icon className="w-7 h-7 mb-2" />
                  <h3 className="font-bold text-sm mb-0.5">{entry.label}</h3>
                  <p className="text-xs opacity-70">{entry.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Translation Section */}
      <section className="py-10 px-4 bg-white/60">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-dong-indigo font-bold flex items-center gap-3">
              普通话-侗语翻译
              <span className="text-xs font-sans font-normal text-dong-light bg-dong-indigo/5 px-3 py-1 rounded-full">
                支持中文/侗语/拼音搜索
              </span>
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Dong intro image */}
            <div className="lg:w-[280px] flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-md border border-dong-indigo/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp"
                  alt="侗语介绍"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-sm text-dong-light mt-3 text-center italic">侗族文化 · 语言之美</p>
            </div>

            {/* Right: Translation fields */}
            <div className="flex-1 space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="输入中文、侗语或拼音搜索..."
                    className="w-full border-2 border-dong-indigo/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-dong-indigo/50 transition-colors bg-white"
                  />
                </div>
                <Button onClick={handleSearch} className="bg-dong-indigo hover:bg-dong-deep text-white px-6">
                  <Search className="w-4 h-4 mr-2" />
                  搜索
                </Button>
              </div>

              {/* Results */}
              {searched && results.length > 0 && (
                <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                  {results.map((word) => (
                    <div key={word.id} className="bg-white rounded-lg p-4 border border-dong-indigo/10 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-lg font-bold text-dong-indigo">{word.chinese}</span>
                            <span className="text-dong-rose font-medium">{word.dong}</span>
                            <span className="text-xs bg-dong-cream px-2 py-0.5 rounded text-dong-light">{word.category}</span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-dong-light">
                            <span>侗语音标: <span className="text-dong-indigo">{word.dongPinyin}</span></span>
                            <span>普通话拼音: <span className="text-dong-indigo">{word.mandarinPinyin}</span></span>
                          </div>
                          <ToneBadge dongPinyin={word.dongPinyin} className="mt-1.5" />
                          {word.example && (
                            <p className="text-xs text-foreground/60 mt-1.5">例: {word.example}</p>
                          )}
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <button
                            onClick={() => { speakDong(word.dong, word.dongPinyin); toast.success("正在播放侗语发音"); }}
                            className="flex items-center gap-1 text-dong-rose hover:text-dong-indigo transition-colors px-2 py-1 rounded-md bg-dong-rose/5 hover:bg-dong-rose/10 text-xs"
                            title="播放侗语发音"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> 侗语
                          </button>
                          <button
                            onClick={() => { speakText(word.chinese); toast.success("正在播放普通话发音"); }}
                            className="flex items-center gap-1 text-dong-indigo/60 hover:text-dong-indigo transition-colors px-2 py-1 rounded-md bg-dong-indigo/5 hover:bg-dong-indigo/10 text-xs"
                            title="播放普通话发音"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> 普通话
                          </button>
                          <button
                            onClick={() => setDetailWord(word)}
                            className="flex items-center gap-1 text-amber-600 hover:text-amber-700 transition-colors px-2 py-1 rounded-md bg-amber-50 hover:bg-amber-100 text-xs"
                            title="查看发音详情"
                          >
                            口型/声调
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {searched && results.length === 0 && (
                <div className="bg-white rounded-lg p-6 border border-dong-indigo/10 text-center">
                  <p className="text-dong-light text-sm">未找到相关词汇，试试其他关键词</p>
                </div>
              )}
              {!searched && (
                <div className="bg-dong-cream/40 rounded-lg p-5 border border-dong-indigo/10">
                  <p className="text-sm text-dong-light mb-3">热门搜索：</p>
                  <div className="flex flex-wrap gap-2">
                    {["你好", "谢谢", "鼓楼", "大歌", "吃饭", "朋友", "唱歌", "山", "水"].map((w) => (
                      <button
                        key={w}
                        onClick={() => { setSearchText(w); const found = searchWords(w); setSearched(true); setResults(found); }}
                        className="px-3 py-1.5 bg-white rounded-full text-xs text-dong-indigo border border-dong-indigo/15 hover:bg-dong-indigo hover:text-white transition-colors"
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>


      {/* Hot Courses */}
      <section className="py-10 px-4 bg-white/60">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-serif text-dong-indigo font-bold">推荐课程</h2>
            <Link href="/dong-learn" className="text-sm text-dong-rose hover:text-dong-indigo flex items-center gap-1 transition-colors">
              全部课程 <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
            {dongLessons.slice(0, 5).map((lesson) => {
              const isCompleted = false;
              return (
                <Link key={lesson.id} href="/dong-learn">
                  <div className="bg-white rounded-xl p-4 border border-dong-indigo/10 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all h-full">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                        lesson.difficulty === 1 ? "bg-green-50 text-green-600" :
                        lesson.difficulty === 2 ? "bg-yellow-50 text-yellow-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {lesson.difficulty === 1 ? "初级" : lesson.difficulty === 2 ? "中级" : "高级"}
                      </span>
                      {isCompleted && <span className="text-[10px] text-green-600">已完成</span>}
                    </div>
                    <h3 className="font-bold text-dong-indigo text-sm mb-1">{lesson.title}</h3>
                    <p className="text-xs text-dong-light line-clamp-2">{lesson.description}</p>
                    <p className="text-[10px] text-dong-light mt-2">{lesson.wordIds.length} 个词汇</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pronunciation Issues Section */}
      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-xl font-serif text-dong-indigo font-bold mb-6">常见发音问题</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
              <h3 className="text-dong-rose font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-dong-rose/10 flex items-center justify-center text-dong-rose text-xs">侗</span>
                侗语发音常见问题
              </h3>
              <ol className="text-sm text-foreground/80 space-y-2 list-decimal list-inside">
                <li>声调不稳定，特别是高平调（55）和低升调（13）容易混淆</li>
                <li>鼻音韵尾有时发不完整，如"-m"、"-n"、"-ng"</li>
                <li>清浊辅音区分不够明显</li>
                <li>入声字的喉塞尾容易丢失</li>
              </ol>
              <Link href="/pronunciation" className="inline-block mt-4 text-xs text-dong-rose hover:text-dong-indigo transition-colors">
                前往侗语纠音练习 →
              </Link>
            </div>
            <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
              <h3 className="text-dong-indigo font-semibold text-sm mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-dong-indigo/10 flex items-center justify-center text-dong-indigo text-xs">普</span>
                普通话发音常见问题
              </h3>
              <ol className="text-sm text-foreground/80 space-y-2 list-decimal list-inside">
                <li>"n"和"l"发音混淆（侗语母语者常见）</li>
                <li>翘舌音（zh, ch, sh, r）发不到位</li>
                <li>第三声（214）降升不够明显</li>
                <li>前后鼻音（-n/-ng）区分困难</li>
              </ol>
              <Link href="/mandarin-pronunciation" className="inline-block mt-4 text-xs text-dong-indigo hover:text-dong-rose transition-colors">
                前往普通话纠音练习 →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {detailWord && <PronunciationDetail word={detailWord} onClose={() => setDetailWord(null)} />}
    </div>
  );
}
