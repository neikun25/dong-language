/*
 * Design: 侗族文化展示页面
 * 轮播图 + 标题 + 大图 + 4个文化分类卡片(建筑/服饰/大歌/节日)
 * 忠实还原PSD设计稿
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { X } from "lucide-react";

const cultureCategories = [
  {
    title: "侗族建筑",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-drum-tower_01b1add8.jpg",
    description: "侗族建筑以鼓楼和风雨桥最为著名。鼓楼是侗寨的标志性建筑，通常建在寨子中心，不用一钉一铆，全靠木榫穿合，造型独特，气势恢宏。风雨桥横跨溪河之上，集桥、廊、亭于一体，既可通行，又可避风雨、休憩聚会。这些建筑充分体现了侗族人民的建筑智慧和艺术才华。",
  },
  {
    title: "侗族服饰",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-costume_bc089a1a.jpg",
    description: "侗族服饰以蓝靛染布为主要特色，男女服饰各有特点。女性服饰华丽精美，以银饰为重要装饰，包括银冠、银项圈、银手镯等，工艺精湛。侗布经过反复浸染、捶打，呈现出独特的深蓝色光泽。侗族刺绣技艺精湛，图案多取材于自然界的花鸟鱼虫，色彩鲜艳，构图精美。",
  },
  {
    title: "侗族大歌",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-grand-song_7810d8ed.jpg",
    description: "侗族大歌是侗族多声部民间歌唱形式，被列入联合国教科文组织人类非物质文化遗产代表作名录。侗族大歌不使用指挥和伴奏，由歌队自然和声，模拟鸟叫虫鸣、高山流水等自然之音。歌词内容丰富，涵盖历史传说、生产劳动、爱情婚姻等方面，是侗族文化的重要载体。",
  },
  {
    title: "侗族节日",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-festival_961bc5d9.png",
    description: "侗族有许多传统节日，如侗年、花炮节、斗牛节、赶坳等。侗年是侗族最隆重的节日，各寨杀猪宰牛，举行盛大的庆祝活动。花炮节以抢花炮为主要活动，场面热烈壮观。赶坳是侗族青年男女社交的重要场合，通过对歌、踩歌堂等形式增进感情，传承文化。",
  },
];

export default function Culture() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* Culture Section */}
      <section className="py-12 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Title with decorative ornament */}
          <div className="text-center mb-10 relative">
            <div className="absolute left-1/2 -translate-x-1/2 -top-2 w-48 h-12 opacity-20">
              <svg viewBox="0 0 200 50" className="w-full h-full text-dong-gold">
                <path d="M20 25 Q50 5 100 25 Q150 45 180 25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M20 25 Q50 45 100 25 Q150 5 180 25" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="10" cy="25" r="3" fill="currentColor" />
                <circle cx="190" cy="25" r="3" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif text-dong-indigo font-bold relative z-10">
              侗族文化
            </h2>
          </div>

          {/* Hero Culture Image */}
          <div className="mb-10 rounded-xl overflow-hidden shadow-lg border border-dong-indigo/10">
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-culture-hero-bXVLgdU2pfKceyYv2mwSed.webp"
              alt="侗族文化"
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>

          {/* Culture Category Cards */}
          <div className="relative">
            {/* Decorative corners */}
            <div className="absolute -left-4 -top-4 w-12 h-12 border-l-2 border-t-2 border-dong-gold/30 rounded-tl-lg" />
            <div className="absolute -right-4 -top-4 w-12 h-12 border-r-2 border-t-2 border-dong-gold/30 rounded-tr-lg" />
            <div className="absolute -left-4 -bottom-4 w-12 h-12 border-l-2 border-b-2 border-dong-gold/30 rounded-bl-lg" />
            <div className="absolute -right-4 -bottom-4 w-12 h-12 border-r-2 border-b-2 border-dong-gold/30 rounded-br-lg" />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 p-4">
              {cultureCategories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedCategory(i)}
                  className="group text-left"
                >
                  <div className="rounded-xl overflow-hidden shadow-md border border-dong-indigo/10 transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={cat.image}
                        alt={cat.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <p className="text-center text-sm font-serif text-dong-indigo font-bold mt-3 group-hover:text-dong-rose transition-colors">
                    {cat.title}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Detail Modal */}
      {selectedCategory !== null && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCategory(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-[700px] w-full max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <img
                src={cultureCategories[selectedCategory].image}
                alt={cultureCategories[selectedCategory].title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setSelectedCategory(null)}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors"
              >
                <X className="w-4 h-4 text-dong-indigo" />
              </button>
            </div>
            <div className="p-8">
              <h3 className="text-2xl font-serif text-dong-indigo font-bold mb-4">
                {cultureCategories[selectedCategory].title}
              </h3>
              <p className="text-foreground/75 leading-relaxed text-sm">
                {cultureCategories[selectedCategory].description}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
