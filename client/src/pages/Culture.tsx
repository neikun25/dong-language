/*
 * Design: 侗族文化展示页面 (增强版)
 * 文化分类卡片 + 详细文章 + 侗族大歌音频展示 + 文化知识问答
 */
import { useState } from "react";
import { X, BookOpen, Music, MapPin, Calendar, ChevronRight, Volume2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cultureArticles, speakText } from "@/lib/dongData";

const cultureCategories = [
  {
    title: "侗族建筑",
    icon: MapPin,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-drum-tower_01b1add8.jpg",
    summary: "鼓楼、风雨桥——侗族建筑智慧的结晶",
    description: "侗族建筑以鼓楼和风雨桥最为著名。鼓楼是侗寨的标志性建筑，通常建在寨子中心，不用一钉一铆，全靠木榫穿合，造型独特，气势恢宏。鼓楼不仅是侗寨的地标，更是村民议事、集会、娱乐的重要场所。风雨桥横跨溪河之上，集桥、廊、亭于一体，既可通行，又可避风雨、休憩聚会。这些建筑充分体现了侗族人民的建筑智慧和艺术才华。侗族建筑多采用杉木建造，与自然环境和谐共生，体现了侗族人民'天人合一'的生态理念。",
    facts: ["鼓楼最高可达20余层", "不用一钉一铆的榫卯结构", "风雨桥可长达数百米", "建筑技艺已列入国家级非遗"],
  },
  {
    title: "侗族服饰",
    icon: Calendar,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-costume_bc089a1a.jpg",
    summary: "蓝靛染布、银饰华美——侗族服饰之美",
    description: "侗族服饰以蓝靛染布为主要特色，男女服饰各有特点。女性服饰华丽精美，以银饰为重要装饰，包括银冠、银项圈、银手镯等，工艺精湛。侗布经过反复浸染、捶打，呈现出独特的深蓝色光泽，被称为'亮布'。侗族刺绣技艺精湛，图案多取材于自然界的花鸟鱼虫，色彩鲜艳，构图精美。不同地区的侗族服饰各有特色，北侗服饰较为简朴，南侗服饰则更加华丽。侗族服饰不仅是穿着，更是民族文化和审美观念的集中体现。",
    facts: ["蓝靛染布需反复浸染数十次", "银饰重量可达数公斤", "刺绣图案有数百种之多", "侗族亮布制作技艺已列入非遗"],
  },
  {
    title: "侗族大歌",
    icon: Music,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-grand-song_7810d8ed.jpg",
    summary: "多声部无伴奏合唱——人类非物质文化遗产",
    description: "侗族大歌（侗语：al laox）是侗族多声部民间歌唱形式，2009年被列入联合国教科文组织人类非物质文化遗产代表作名录。侗族大歌不使用指挥和伴奏，由歌队自然和声，模拟鸟叫虫鸣、高山流水等自然之音，被誉为'清泉般闪光的音乐'。歌词内容丰富，涵盖历史传说、生产劳动、爱情婚姻等方面。侗族大歌分为声音大歌、柔声大歌、伦理大歌、叙事大歌等类型。演唱时，一人领唱，众人和声，高低音交织，形成独特的和声效果。侗族大歌是侗族文化的重要载体，也是中国乃至世界音乐宝库中的瑰宝。",
    facts: ["2009年列入联合国非遗名录", "无指挥无伴奏的多声部合唱", "模拟自然之音的独特和声", "歌队通常由同性别同年龄组成"],
  },
  {
    title: "侗族节日",
    icon: Calendar,
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-festival_961bc5d9.png",
    summary: "侗年、花炮节、赶坳——丰富多彩的民族节日",
    description: "侗族有许多传统节日，如侗年、花炮节、斗牛节、赶坳等。侗年（侗语：nyenc jil）是侗族最隆重的节日，各寨杀猪宰牛，举行盛大的庆祝活动，日期因地区而异，一般在农历十月或十一月。花炮节以抢花炮为主要活动，场面热烈壮观，是侗族地区最具观赏性的节日之一。赶坳是侗族青年男女社交的重要场合，通过对歌、踩歌堂等形式增进感情，传承文化。此外还有萨玛节（祭祀侗族女神萨玛）、吃新节（庆祝丰收）等节日，展现了侗族人民丰富的精神文化生活。",
    facts: ["侗年通常在农历十月或十一月", "花炮节已有数百年历史", "赶坳是青年男女对歌社交场合", "萨玛节祭祀侗族女神萨玛"],
  },
];

const dongSongs = [
  { title: "蝉之歌", dongTitle: "al nyenc", description: "模拟蝉鸣的声音大歌，展现侗族人与自然的和谐" },
  { title: "大山真美好", dongTitle: "bya meix nyaoh", description: "赞美侗族山水风光的柔声大歌" },
  { title: "装呆傻", dongTitle: "al ngangs", description: "风趣幽默的叙事大歌，讲述民间故事" },
  { title: "敬酒歌", dongTitle: "al jius", description: "侗族宴席上的祝酒歌，热情洋溢" },
];

const quizQuestions = [
  { q: "侗族大歌被列入联合国非遗名录是哪一年？", options: ["2005年", "2009年", "2012年", "2015年"], answer: 1 },
  { q: "侗族建筑中最具代表性的是？", options: ["吊脚楼", "鼓楼和风雨桥", "土楼", "碉楼"], answer: 1 },
  { q: "侗族服饰以什么颜色为主？", options: ["红色", "白色", "蓝靛色", "黄色"], answer: 2 },
  { q: "侗族大歌的演唱特点是？", options: ["独唱", "有指挥的合唱", "无伴奏多声部合唱", "器乐伴奏"], answer: 2 },
  { q: "侗年通常在农历几月？", options: ["正月", "五月", "八月", "十月或十一月"], answer: 3 },
];

export default function Culture() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"categories" | "articles" | "songs" | "quiz">("categories");
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);

  const handleQuizAnswer = (idx: number) => {
    setQuizAnswer(idx);
    if (idx === quizQuestions[quizIndex].answer) {
      setQuizScore((s) => s + 1);
    }
    setTimeout(() => {
      if (quizIndex + 1 < quizQuestions.length) {
        setQuizIndex((i) => i + 1);
        setQuizAnswer(null);
      } else {
        setQuizFinished(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setQuizAnswer(null);
    setQuizFinished(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-dong-indigo font-bold">侗族文化</h2>
            <p className="text-dong-light text-sm mt-2 max-w-[600px] mx-auto">
              探索侗族丰富多彩的文化遗产，了解建筑、服饰、音乐、节日等方面的独特魅力
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-8 bg-white rounded-xl p-1 border border-dong-indigo/10 shadow-sm max-w-[600px] mx-auto">
            {[
              { key: "categories" as const, label: "文化分类", icon: MapPin },
              { key: "articles" as const, label: "文化文章", icon: BookOpen },
              { key: "songs" as const, label: "侗族大歌", icon: Music },
              { key: "quiz" as const, label: "知识问答", icon: Calendar },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm transition-all ${
                  activeTab === t.key ? "bg-dong-indigo text-white shadow-sm" : "text-dong-light hover:text-dong-indigo hover:bg-dong-cream/50"
                }`}
              >
                <t.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          {/* Categories Tab */}
          {activeTab === "categories" && (
            <>
              {/* Hero Image */}
              <div className="mb-8 rounded-xl overflow-hidden shadow-lg border border-dong-indigo/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp"
                  alt="侗族文化"
                  className="w-full h-auto max-h-[400px] object-cover"
                />
              </div>

              {/* Category Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {cultureCategories.map((cat, i) => (
                  <button key={i} onClick={() => setSelectedCategory(i)} className="group text-left">
                    <div className="rounded-xl overflow-hidden shadow-md border border-dong-indigo/10 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                      <div className="aspect-[3/4] overflow-hidden">
                        <img src={cat.image} alt={cat.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                    </div>
                    <p className="text-center text-sm font-serif text-dong-indigo font-bold mt-3 group-hover:text-dong-rose transition-colors">
                      {cat.title}
                    </p>
                    <p className="text-center text-xs text-dong-light mt-0.5 line-clamp-1">{cat.summary}</p>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Articles Tab */}
          {activeTab === "articles" && (
            <div>
              {selectedArticle === null ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {cultureArticles.map((article, i) => (
                    <div
                      key={article.id}
                      className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                      onClick={() => setSelectedArticle(i)}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-dong-indigo/5 text-dong-indigo">{article.category}</span>
                      </div>
                      <h3 className="font-bold text-dong-indigo group-hover:text-dong-rose transition-colors mb-1">{article.title}</h3>
                      <p className="text-sm text-dong-light line-clamp-3">{article.content.substring(0, 120)}...</p>
                      <div className="flex items-center justify-end mt-3">
                        <span className="text-xs text-dong-rose flex items-center gap-1">
                          阅读全文 <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div>
                  <button onClick={() => setSelectedArticle(null)} className="text-sm text-dong-light hover:text-dong-indigo flex items-center gap-1 mb-4">
                    ← 返回文章列表
                  </button>
                  <div className="bg-white rounded-xl p-6 md:p-8 border border-dong-indigo/10 shadow-sm">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-dong-indigo/5 text-dong-indigo">{cultureArticles[selectedArticle].category}</span>
                    <h3 className="text-2xl font-serif text-dong-indigo font-bold mt-3 mb-4">{cultureArticles[selectedArticle].title}</h3>
                    <div className="prose prose-sm max-w-none text-foreground/80 leading-relaxed whitespace-pre-line">
                      {cultureArticles[selectedArticle].content}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Songs Tab */}
          {activeTab === "songs" && (
            <div>
              <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm mb-6">
                <h3 className="font-serif text-dong-indigo font-bold text-lg mb-2">关于侗族大歌</h3>
                <p className="text-sm text-foreground/70 leading-relaxed">
                  侗族大歌（侗语：al laox）是侗族多声部民间歌唱形式，2009年被列入联合国教科文组织人类非物质文化遗产代表作名录。
                  大歌不使用指挥和伴奏，由歌队自然和声，模拟鸟叫虫鸣、高山流水等自然之音，被誉为"清泉般闪光的音乐"。
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {dongSongs.map((song, i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-4 h-4 text-dong-rose" />
                          <h4 className="font-bold text-dong-indigo">{song.title}</h4>
                        </div>
                        <p className="text-xs text-dong-rose mb-2">侗语: {song.dongTitle}</p>
                        <p className="text-sm text-dong-light">{song.description}</p>
                      </div>
                      <button
                        onClick={() => {
                          speakText(song.title);
                          toast.info(`正在播放"${song.title}"的名称发音`);
                        }}
                        className="p-2 bg-dong-indigo/5 rounded-lg text-dong-indigo hover:bg-dong-indigo/10 transition-colors flex-shrink-0"
                      >
                        <Volume2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-dong-cream/40 rounded-xl p-5 border border-dong-indigo/10">
                <h4 className="font-bold text-dong-indigo text-sm mb-3">侗族大歌的分类</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-bold text-dong-rose mb-1">声音大歌</h5>
                    <p className="text-xs text-dong-light">模拟自然界声音，如蝉鸣、流水、鸟叫等</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-bold text-dong-rose mb-1">柔声大歌</h5>
                    <p className="text-xs text-dong-light">旋律优美柔和，多表达爱情和赞美之情</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-bold text-dong-rose mb-1">伦理大歌</h5>
                    <p className="text-xs text-dong-light">传授道德伦理，教育后人的歌曲</p>
                  </div>
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-bold text-dong-rose mb-1">叙事大歌</h5>
                    <p className="text-xs text-dong-light">讲述历史传说和民间故事</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quiz Tab */}
          {activeTab === "quiz" && (
            <div className="max-w-[600px] mx-auto">
              {!quizFinished ? (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-dong-light">第 {quizIndex + 1} / {quizQuestions.length} 题</p>
                    <p className="text-sm text-dong-rose font-bold">得分: {quizScore}</p>
                  </div>
                  <div className="w-full bg-dong-cream rounded-full h-2 mb-6">
                    <div className="bg-dong-indigo h-2 rounded-full transition-all" style={{ width: `${((quizIndex + 1) / quizQuestions.length) * 100}%` }} />
                  </div>

                  <div className="bg-white rounded-2xl p-6 shadow-lg border border-dong-indigo/10 mb-6">
                    <p className="text-lg font-bold text-dong-indigo text-center">{quizQuestions[quizIndex].q}</p>
                  </div>

                  <div className="space-y-3">
                    {quizQuestions[quizIndex].options.map((opt, idx) => {
                      const isCorrect = idx === quizQuestions[quizIndex].answer;
                      const isSelected = quizAnswer === idx;
                      let cls = "bg-white border border-dong-indigo/15 text-dong-indigo hover:bg-dong-indigo/5";
                      if (quizAnswer !== null) {
                        if (isCorrect) cls = "bg-green-50 border-green-300 text-green-700";
                        else if (isSelected) cls = "bg-red-50 border-red-300 text-red-700";
                      }
                      return (
                        <button
                          key={idx}
                          onClick={() => quizAnswer === null && handleQuizAnswer(idx)}
                          disabled={quizAnswer !== null}
                          className={`w-full rounded-xl p-4 text-left transition-all ${cls} disabled:cursor-default`}
                        >
                          <span className="font-medium">{String.fromCharCode(65 + idx)}. {opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center">
                  <BookOpen className="w-12 h-12 text-dong-gold mx-auto mb-4" />
                  <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-2">问答完成！</h3>
                  <p className="text-4xl font-bold text-dong-rose mb-2">
                    {Math.round((quizScore / quizQuestions.length) * 100)}分
                  </p>
                  <p className="text-sm text-dong-light mb-6">答对 {quizScore} / {quizQuestions.length} 题</p>
                  <Button onClick={resetQuiz} className="bg-dong-indigo hover:bg-dong-deep text-white">
                    重新答题
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Detail Modal */}
      {selectedCategory !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setSelectedCategory(null)}>
          <div className="bg-white rounded-2xl max-w-[750px] w-full max-h-[85vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img src={cultureCategories[selectedCategory].image} alt={cultureCategories[selectedCategory].title} className="w-full h-64 object-cover rounded-t-2xl" />
              <button onClick={() => setSelectedCategory(null)} className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white">
                <X className="w-4 h-4 text-dong-indigo" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-2">{cultureCategories[selectedCategory].title}</h3>
              <p className="text-dong-rose text-sm mb-4">{cultureCategories[selectedCategory].summary}</p>
              <p className="text-foreground/75 leading-relaxed text-sm mb-6">{cultureCategories[selectedCategory].description}</p>

              <div className="bg-dong-cream/40 rounded-xl p-4 border border-dong-indigo/10">
                <h4 className="font-bold text-dong-indigo text-sm mb-2">你知道吗？</h4>
                <ul className="text-sm text-foreground/70 space-y-1.5">
                  {cultureCategories[selectedCategory].facts.map((fact, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-dong-gold mt-0.5">★</span> {fact}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
