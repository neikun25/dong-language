/*
 * Design: 侗族语言应用主页
 * 忠实还原PSD设计稿: 轮播图 + 翻译区 + 发音问题 + 待办 + 学习记录
 * 色彩: dong-indigo主色, dong-paper背景, dong-rose强调
 */
import { useState } from "react";
import { Search, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// 侗语词典数据
const dongDictionary: Record<string, { dong: string; dongPinyin: string; mandarinPinyin: string }> = {
  "你好": { dong: "mii laox", dongPinyin: "mi˧ lau˦", mandarinPinyin: "nǐ hǎo" },
  "谢谢": { dong: "laox siik", dongPinyin: "lau˦ si:k˧", mandarinPinyin: "xiè xie" },
  "吃饭": { dong: "nyaoc jax", dongPinyin: "ɲau˧ tɕa˦", mandarinPinyin: "chī fàn" },
  "喝水": { dong: "nyaoc naml", dongPinyin: "ɲau˧ nam˩", mandarinPinyin: "hē shuǐ" },
  "再见": { dong: "bail laox", dongPinyin: "pai˩ lau˦", mandarinPinyin: "zài jiàn" },
  "朋友": { dong: "bioul nyenc", dongPinyin: "piou˩ ɲen˧", mandarinPinyin: "péng you" },
  "唱歌": { dong: "al gal", dongPinyin: "a˩ ka˩", mandarinPinyin: "chàng gē" },
  "跳舞": { dong: "diux wux", dongPinyin: "tiu˦ wu˦", mandarinPinyin: "tiào wǔ" },
  "家": { dong: "yangh", dongPinyin: "jaŋ˧˥", mandarinPinyin: "jiā" },
  "山": { dong: "bya", dongPinyin: "pja˩", mandarinPinyin: "shān" },
  "水": { dong: "naml", dongPinyin: "nam˩", mandarinPinyin: "shuǐ" },
  "太阳": { dong: "wenc nyiedl", dongPinyin: "wen˧ ɲiet˩", mandarinPinyin: "tài yáng" },
  "月亮": { dong: "laox nyiedl", dongPinyin: "lau˦ ɲiet˩", mandarinPinyin: "yuè liang" },
  "鼓楼": { dong: "gul laox", dongPinyin: "ku˩ lau˦", mandarinPinyin: "gǔ lóu" },
  "大歌": { dong: "al laox", dongPinyin: "a˩ lau˦", mandarinPinyin: "dà gē" },
};

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState<{ dong: string; dongPinyin: string; mandarinPinyin: string } | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      toast.info("请输入要查询的中文词汇");
      return;
    }
    const found = dongDictionary[trimmed];
    setSearched(true);
    if (found) {
      setResult(found);
    } else {
      setResult(null);
      toast.info("未找到该词汇的侗语翻译，请尝试其他词汇");
    }
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'zh-CN';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    } else {
      toast.info("您的浏览器不支持语音合成");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* Translation Section */}
      <section className="py-12 px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-2xl font-serif text-dong-indigo font-bold mb-8 flex items-center gap-3">
            普通话-侗语翻译
            <span className="text-sm font-sans font-normal text-dong-light bg-dong-indigo/5 px-3 py-1 rounded-full">
              搜索
            </span>
          </h2>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left: Dong intro image */}
            <div className="lg:w-[300px] flex-shrink-0">
              <div className="rounded-lg overflow-hidden shadow-md border border-dong-indigo/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp"
                  alt="侗语介绍"
                  className="w-full h-auto object-cover"
                />
              </div>
              <p className="text-sm text-dong-light mt-3 text-center">侗语介绍</p>
            </div>

            {/* Right: Translation fields */}
            <div className="flex-1 space-y-4">
              {/* Search input */}
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    placeholder="输入中文词汇，如：你好、谢谢、鼓楼..."
                    className="w-full border-2 border-dong-indigo/20 rounded-lg px-4 py-3 text-base focus:outline-none focus:border-dong-indigo/50 transition-colors bg-white"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-dong-indigo hover:bg-dong-deep text-white px-6"
                >
                  <Search className="w-4 h-4 mr-2" />
                  搜索
                </Button>
              </div>

              {/* Result fields */}
              <div className="space-y-3">
                {[
                  { num: "壹", label: "普通话", value: searched ? searchText : "" },
                  { num: "贰", label: "侗语", value: result?.dong || (searched ? "未收录" : "") },
                  { num: "叁", label: "侗语音标", value: result?.dongPinyin || (searched ? "—" : "") },
                  { num: "肆", label: "普通话音标", value: result?.mandarinPinyin || (searched ? "—" : "") },
                ].map((field) => (
                  <div key={field.num} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-dong-indigo/10 border border-dong-indigo/20 rounded-md flex items-center justify-center text-dong-indigo font-serif text-lg font-bold flex-shrink-0">
                      {field.num}
                    </div>
                    <div className="flex-1 flex items-center justify-between border-b-2 border-dong-indigo/15 pb-2">
                      <span className="text-sm text-dong-light mr-4 flex-shrink-0">{field.label}</span>
                      <div className="flex-1 flex items-center justify-between">
                        <span className="text-dong-indigo font-medium">
                          {field.value}
                        </span>
                        {field.value && field.value !== "未收录" && field.value !== "—" && (
                          <button
                            onClick={() => handleSpeak(field.num === "壹" ? searchText : field.value)}
                            className="text-dong-light hover:text-dong-indigo transition-colors ml-2"
                            title="播放发音"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pronunciation Issues Section */}
      <section className="py-10 px-4 bg-white/60">
        <div className="max-w-[1100px] mx-auto flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[160px] flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=300&h=400&fit=crop"
              alt="发音问题"
              className="w-full h-auto rounded-lg shadow-sm object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-serif text-dong-indigo font-bold mb-4">发音问题</h2>

            <div className="mb-5">
              <h3 className="text-dong-rose font-semibold text-sm mb-2">侗语发音问题</h3>
              <ol className="text-sm text-foreground/80 space-y-1 list-decimal list-inside">
                <li>声调不稳定，特别是高平调（55）和低升调（13）容易混淆</li>
                <li>鼻音韵尾有时发不完整</li>
                <li>清浊辅音区分不够明显</li>
              </ol>
            </div>

            <div className="mb-5">
              <h3 className="text-dong-rose font-semibold text-sm mb-2">普通话发音问题</h3>
              <ol className="text-sm text-foreground/80 space-y-1 list-decimal list-inside">
                <li>"n"和"l"发音有时混淆</li>
                <li>第三声（214）降升不够明显</li>
                <li>轻声有时发得过重</li>
              </ol>
            </div>

            <div>
              <h3 className="text-dong-rose font-semibold text-sm mb-2">我的待办</h3>
              <ul className="text-sm text-foreground/80 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 border border-dong-indigo/30 rounded-sm flex-shrink-0" />
                  完成本周侗语发音练习
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 border border-dong-indigo/30 rounded-sm flex-shrink-0" />
                  参加侗族文化线上讲座
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 border border-dong-indigo/30 rounded-sm flex-shrink-0" />
                  提交普通话水平测试申请
                </li>
              </ul>
            </div>
          </div>

          <div className="lg:w-[240px] flex-shrink-0 self-end">
            <img
              src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400&h=300&fit=crop"
              alt="侗族风光"
              className="w-full h-auto rounded-lg shadow-sm object-cover"
            />
          </div>
        </div>
      </section>

      {/* Learning Records Section */}
      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <h2 className="text-xl font-serif text-dong-indigo font-bold mb-6">学习记录</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg p-5 border border-dong-indigo/10 shadow-sm">
              <h3 className="text-dong-rose font-semibold text-sm mb-3">侗语学习进度</h3>
              <p className="text-sm text-foreground/70 mb-1">已学习侗语词汇：<span className="text-dong-indigo font-bold">128</span>个</p>
              <div className="w-full bg-dong-cream rounded-full h-2 mt-2">
                <div className="bg-dong-indigo h-2 rounded-full" style={{ width: "42%" }} />
              </div>
              <p className="text-xs text-dong-light mt-3">最近练习：2025-07-30 15:42</p>
            </div>
            <div className="bg-white rounded-lg p-5 border border-dong-indigo/10 shadow-sm">
              <h3 className="text-dong-rose font-semibold text-sm mb-3">普通话学习进度</h3>
              <p className="text-sm text-foreground/70 mb-1">已练习普通话句子：<span className="text-dong-indigo font-bold">56</span>句</p>
              <div className="w-full bg-dong-cream rounded-full h-2 mt-2">
                <div className="bg-dong-rose h-2 rounded-full" style={{ width: "28%" }} />
              </div>
              <p className="text-xs text-dong-light mt-3">最近练习：2025-07-29 09:18</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
