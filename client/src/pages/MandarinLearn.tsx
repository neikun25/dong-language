/*
 * Design: 普通话学习页面
 * 针对侗族母语者的普通话学习课程
 * 课程列表 + 发音练习 + 声调训练
 */
import { useState } from "react";
import { Volume2, Play, CheckCircle, ChevronRight, BookOpen, Mic } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { speakText } from "@/lib/dongData";

interface MandarinLesson {
  id: string;
  title: string;
  description: string;
  difficulty: number;
  items: { chinese: string; pinyin: string; dongEquiv: string; tips: string }[];
}

const mandarinLessons: MandarinLesson[] = [
  {
    id: "m1", title: "声母发音", description: "学习普通话21个声母的正确发音", difficulty: 1,
    items: [
      { chinese: "波", pinyin: "bō", dongEquiv: "类似侗语b-", tips: "双唇不送气清塞音，嘴唇轻轻合拢后打开" },
      { chinese: "坡", pinyin: "pō", dongEquiv: "类似侗语p-", tips: "双唇送气清塞音，比'b'多一股气流" },
      { chinese: "摸", pinyin: "mō", dongEquiv: "类似侗语m-", tips: "双唇鼻音，气流从鼻腔出" },
      { chinese: "佛", pinyin: "fó", dongEquiv: "侗语无对应", tips: "上齿咬下唇，气流从缝隙出" },
      { chinese: "得", pinyin: "dé", dongEquiv: "类似侗语d-", tips: "舌尖抵住上齿龈，不送气" },
      { chinese: "特", pinyin: "tè", dongEquiv: "类似侗语t-", tips: "舌尖抵住上齿龈，送气" },
    ],
  },
  {
    id: "m2", title: "韵母发音", description: "学习普通话单韵母和复韵母", difficulty: 1,
    items: [
      { chinese: "啊", pinyin: "ā", dongEquiv: "类似侗语a", tips: "嘴巴张大，舌头放平" },
      { chinese: "哦", pinyin: "ō", dongEquiv: "类似侗语o", tips: "嘴唇圆拢，舌头后缩" },
      { chinese: "鹅", pinyin: "é", dongEquiv: "类似侗语e", tips: "嘴半开半合，舌头居中" },
      { chinese: "衣", pinyin: "yī", dongEquiv: "类似侗语i", tips: "嘴唇扁平，舌尖抵下齿" },
      { chinese: "乌", pinyin: "wū", dongEquiv: "类似侗语u", tips: "嘴唇圆拢突出" },
      { chinese: "鱼", pinyin: "yú", dongEquiv: "侗语无对应", tips: "嘴唇圆拢，舌尖抵下齿" },
    ],
  },
  {
    id: "m3", title: "四声练习", description: "掌握普通话四个声调的发音规律", difficulty: 2,
    items: [
      { chinese: "妈", pinyin: "mā (一声)", dongEquiv: "类似侗语高平调", tips: "高而平，保持不变，像唱歌的高音" },
      { chinese: "麻", pinyin: "má (二声)", dongEquiv: "类似侗语中升调", tips: "从中音升到高音，像疑问语气" },
      { chinese: "马", pinyin: "mǎ (三声)", dongEquiv: "侗语无完全对应", tips: "先降后升(214)，注意降到最低再升" },
      { chinese: "骂", pinyin: "mà (四声)", dongEquiv: "类似侗语高降调", tips: "从高音快速降到低音，干脆利落" },
      { chinese: "吗", pinyin: "ma (轻声)", dongEquiv: "侗语无对应", tips: "轻而短，不要用力，跟在前一个字后面" },
    ],
  },
  {
    id: "m4", title: "翘舌音训练", description: "区分平舌音和翘舌音（侗族母语者难点）", difficulty: 3,
    items: [
      { chinese: "知/资", pinyin: "zhī / zī", dongEquiv: "侗语无翘舌", tips: "zh: 舌尖翘起抵硬腭前部；z: 舌尖抵上齿背" },
      { chinese: "吃/次", pinyin: "chī / cì", dongEquiv: "侗语无翘舌", tips: "ch: 舌尖翘起送气；c: 舌尖抵齿背送气" },
      { chinese: "诗/思", pinyin: "shī / sī", dongEquiv: "侗语无翘舌", tips: "sh: 舌尖翘起，气流从舌面出；s: 舌尖抵齿背" },
      { chinese: "日", pinyin: "rì", dongEquiv: "侗语无对应", tips: "舌尖翘起接近硬腭，声带振动" },
    ],
  },
  {
    id: "m5", title: "前后鼻音", description: "区分前鼻音(-n)和后鼻音(-ng)", difficulty: 3,
    items: [
      { chinese: "烟/央", pinyin: "yān / yāng", dongEquiv: "侗语有-n和-ng", tips: "-n: 舌尖抵上齿龈；-ng: 舌根抵软腭" },
      { chinese: "民/明", pinyin: "mín / míng", dongEquiv: "侗语有类似区分", tips: "注意结尾舌位不同" },
      { chinese: "真/争", pinyin: "zhēn / zhēng", dongEquiv: "注意侗语对应", tips: "-n结尾嘴可以闭合；-ng结尾嘴保持张开" },
      { chinese: "因/英", pinyin: "yīn / yīng", dongEquiv: "侗语有类似", tips: "多听多练，注意韵尾的区别" },
    ],
  },
];

export default function MandarinLearn() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const currentLesson = mandarinLessons.find((l) => l.id === selectedLesson);

  const handlePractice = () => {
    setPracticeMode(true);
    setCurrentItemIndex(0);
  };

  const markComplete = (itemChinese: string) => {
    setCompletedItems((prev) => { const next = new Set(Array.from(prev)); next.add(itemChinese); return next; });
    toast.success("已掌握！");
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-dong-indigo font-bold">普通话学习</h2>
            <p className="text-sm text-dong-light mt-1">专为侗族母语者设计的普通话学习课程，对比侗语发音特点进行针对性训练</p>
          </div>

          {!selectedLesson ? (
            <>
              {/* Course Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mandarinLessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-5 h-5 text-dong-indigo" />
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        lesson.difficulty === 1 ? "bg-green-50 text-green-600" :
                        lesson.difficulty === 2 ? "bg-yellow-50 text-yellow-600" :
                        "bg-red-50 text-red-600"
                      }`}>
                        {lesson.difficulty === 1 ? "初级" : lesson.difficulty === 2 ? "中级" : "高级"}
                      </span>
                    </div>
                    <h3 className="font-bold text-dong-indigo mb-1 group-hover:text-dong-rose transition-colors">{lesson.title}</h3>
                    <p className="text-sm text-dong-light mb-3">{lesson.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-dong-light">{lesson.items.length} 个练习项</span>
                      <ChevronRight className="w-4 h-4 text-dong-light group-hover:text-dong-rose transition-colors" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Tips Section */}
              <div className="mt-10 bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm">
                <h3 className="text-lg font-serif text-dong-indigo font-bold mb-4">侗族母语者学普通话小贴士</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-dong-cream/40 rounded-lg p-4">
                    <h4 className="font-bold text-dong-rose text-sm mb-2">发音优势</h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• 侗语声调丰富，有助于掌握普通话四声</li>
                      <li>• 侗语有前后鼻音区分，可迁移到普通话</li>
                      <li>• 侗语辅音系统与普通话有较多共同点</li>
                    </ul>
                  </div>
                  <div className="bg-dong-cream/40 rounded-lg p-4">
                    <h4 className="font-bold text-dong-rose text-sm mb-2">需要注意</h4>
                    <ul className="text-sm text-foreground/70 space-y-1">
                      <li>• 翘舌音(zh, ch, sh, r)是主要难点</li>
                      <li>• 第三声的降升需要特别练习</li>
                      <li>• 注意n和l的区分（部分方言区）</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              {/* Back Button */}
              <button onClick={() => { setSelectedLesson(null); setPracticeMode(false); }} className="text-sm text-dong-light hover:text-dong-indigo flex items-center gap-1 mb-6">
                ← 返回课程列表
              </button>

              {currentLesson && (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-serif text-dong-indigo font-bold">{currentLesson.title}</h3>
                      <p className="text-sm text-dong-light">{currentLesson.description}</p>
                    </div>
                    {!practiceMode && (
                      <Button onClick={handlePractice} className="bg-dong-rose hover:bg-dong-rose/80 text-white">
                        <Mic className="w-4 h-4 mr-1" /> 跟读练习
                      </Button>
                    )}
                  </div>

                  {!practiceMode ? (
                    <div className="space-y-4">
                      {currentLesson.items.map((item, i) => {
                        const isDone = completedItems.has(item.chinese);
                        return (
                          <div key={i} className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <span className="text-2xl font-bold text-dong-indigo">{item.chinese}</span>
                                  <span className="text-dong-rose font-medium">{item.pinyin}</span>
                                  {isDone && <CheckCircle className="w-4 h-4 text-green-500" />}
                                </div>
                                <div className="bg-dong-cream/40 rounded-lg p-3 mb-2">
                                  <p className="text-xs text-dong-light mb-1">侗语对照: <span className="text-dong-indigo">{item.dongEquiv}</span></p>
                                  <p className="text-sm text-foreground/70">{item.tips}</p>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 ml-3">
                                <button onClick={() => speakText(item.chinese)} className="p-2 bg-dong-indigo/5 rounded-lg text-dong-indigo hover:bg-dong-indigo/10 transition-colors" title="听发音">
                                  <Volume2 className="w-5 h-5" />
                                </button>
                                {!isDone && (
                                  <button onClick={() => markComplete(item.chinese)} className="p-2 bg-green-50 rounded-lg text-green-600 hover:bg-green-100 transition-colors" title="标记已掌握">
                                    <CheckCircle className="w-5 h-5" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Practice Mode */
                    <div className="max-w-[500px] mx-auto">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-dong-light">{currentItemIndex + 1} / {currentLesson.items.length}</p>
                        <button onClick={() => setPracticeMode(false)} className="text-sm text-dong-light hover:text-dong-indigo">退出练习</button>
                      </div>
                      <div className="w-full bg-dong-cream rounded-full h-2 mb-6">
                        <div className="bg-dong-indigo h-2 rounded-full transition-all" style={{ width: `${((currentItemIndex + 1) / currentLesson.items.length) * 100}%` }} />
                      </div>

                      <div className="bg-white rounded-2xl p-8 shadow-lg border border-dong-indigo/10 text-center">
                        <p className="text-5xl font-bold text-dong-indigo mb-3">{currentLesson.items[currentItemIndex].chinese}</p>
                        <p className="text-xl text-dong-rose mb-4">{currentLesson.items[currentItemIndex].pinyin}</p>
                        <div className="bg-dong-cream/40 rounded-lg p-3 mb-4 text-left">
                          <p className="text-xs text-dong-light mb-1">侗语对照: {currentLesson.items[currentItemIndex].dongEquiv}</p>
                          <p className="text-sm text-foreground/70">{currentLesson.items[currentItemIndex].tips}</p>
                        </div>

                        <div className="flex items-center justify-center gap-3 mb-6">
                          <Button onClick={() => speakText(currentLesson.items[currentItemIndex].chinese)} className="bg-dong-indigo hover:bg-dong-deep text-white">
                            <Volume2 className="w-4 h-4 mr-1" /> 听标准发音
                          </Button>
                          <Button onClick={() => {
                            toast.info("请跟读上方文字，注意发音要点");
                          }} variant="outline" className="border-dong-rose/30 text-dong-rose hover:bg-dong-rose/5">
                            <Mic className="w-4 h-4 mr-1" /> 跟读
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-4 mt-6">
                        <Button
                          onClick={() => setCurrentItemIndex(Math.max(0, currentItemIndex - 1))}
                          disabled={currentItemIndex === 0}
                          variant="outline" className="border-dong-indigo/20"
                        >
                          上一个
                        </Button>
                        <Button
                          onClick={() => {
                            if (currentItemIndex < currentLesson.items.length - 1) {
                              setCurrentItemIndex(currentItemIndex + 1);
                            } else {
                              toast.success("恭喜完成本课所有练习！");
                              setPracticeMode(false);
                            }
                          }}
                          className="bg-dong-indigo hover:bg-dong-deep text-white"
                        >
                          {currentItemIndex < currentLesson.items.length - 1 ? "下一个" : "完成"}
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
