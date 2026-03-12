/*
 * Design: 留言板页面 (增强版)
 * 留言表单 + 留言列表 + 搜索过滤 + 点赞功能
 */
import { useState, useMemo } from "react";
import { MessageCircle, Send, Heart, Search, User, Clock, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageItem {
  id: string;
  name: string;
  content: string;
  category: string;
  time: string;
  likes: number;
  liked: boolean;
}

const defaultMessages: MessageItem[] = [
  { id: "m1", name: "吴小花", content: "侗族大歌真的太美了！第一次听到就被深深震撼，希望更多人能了解侗族文化。", category: "文化感悟", time: "2025-12-15", likes: 24, liked: false },
  { id: "m2", name: "杨明远", content: "作为侗族人，看到有这样的平台来传播我们的语言和文化，感到非常欣慰和自豪。", category: "平台反馈", time: "2025-12-10", likes: 31, liked: false },
  { id: "m3", name: "李文学", content: "侗语的声调系统很有趣，和普通话有很大不同。纠音功能对我帮助很大！", category: "学习心得", time: "2025-12-08", likes: 18, liked: false },
  { id: "m4", name: "陈思雨", content: "去过肇兴侗寨旅游，鼓楼和风雨桥太壮观了。希望能学会一些基本的侗语问候语。", category: "文化感悟", time: "2025-12-05", likes: 15, liked: false },
  { id: "m5", name: "石秀英", content: "建议增加更多日常对话的课程内容，这样学起来更实用。总体来说平台做得很好！", category: "平台反馈", time: "2025-12-01", likes: 9, liked: false },
  { id: "m6", name: "龙建国", content: "侗族的银饰工艺令人叹为观止，每一件都是艺术品。希望这些传统手艺能传承下去。", category: "文化感悟", time: "2025-11-28", likes: 22, liked: false },
];

const categories = ["全部", "学习心得", "文化感悟", "平台反馈", "其他"];

export default function Message() {
  const [messages, setMessages] = useState<MessageItem[]>(defaultMessages);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", content: "", category: "学习心得", interest: "侗语学习" });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("全部");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchSearch = !searchQuery || m.content.includes(searchQuery) || m.name.includes(searchQuery);
      const matchCategory = filterCategory === "全部" || m.category === filterCategory;
      return matchSearch && matchCategory;
    });
  }, [messages, searchQuery, filterCategory]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = "请输入姓名";
    if (!formData.content.trim()) errs.content = "请输入留言内容";
    else if (formData.content.length < 5) errs.content = "留言内容至少5个字";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = "邮箱格式不正确";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newMsg: MessageItem = {
      id: `m${Date.now()}`,
      name: formData.name,
      content: formData.content,
      category: formData.category,
      time: new Date().toISOString().split("T")[0],
      likes: 0,
      liked: false,
    };
    setMessages([newMsg, ...messages]);
    setFormData({ name: "", phone: "", email: "", content: "", category: "学习心得", interest: "侗语学习" });
    setErrors({});
    toast.success("留言发布成功！");
  };

  const handleLike = (id: string) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, likes: m.liked ? m.likes - 1 : m.likes + 1, liked: !m.liked } : m
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      <section className="py-10 px-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-serif text-dong-indigo font-bold inline-flex items-center gap-3">
              <span className="text-dong-gold text-lg">❖</span>
              留言板
              <span className="text-dong-gold text-lg">❖</span>
            </h2>
            <p className="text-dong-light text-sm mt-1 font-['Crimson_Text'] italic">Leave a message</p>
            <p className="text-dong-light text-xs mt-2">分享您的学习心得、文化感悟，与大家一起交流</p>
          </div>

          <div className="grid lg:grid-cols-[380px_1fr] gap-6">
            {/* Left: Form */}
            <div className="bg-white rounded-xl p-6 border border-dong-indigo/10 shadow-sm h-fit lg:sticky lg:top-24">
              <h3 className="font-serif text-dong-indigo font-bold mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5" /> 发表留言
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-dong-light mb-1">姓名 *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => { setFormData({ ...formData, name: e.target.value }); setErrors({ ...errors, name: "" }); }}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${errors.name ? "border-red-300 focus:border-red-400" : "border-dong-indigo/15 focus:border-dong-indigo/40"}`}
                    placeholder="您的姓名"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-dong-light mb-1">手机号</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full border border-dong-indigo/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-dong-indigo/40"
                      placeholder="选填"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-dong-light mb-1">邮箱</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => { setFormData({ ...formData, email: e.target.value }); setErrors({ ...errors, email: "" }); }}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none transition-colors ${errors.email ? "border-red-300 focus:border-red-400" : "border-dong-indigo/15 focus:border-dong-indigo/40"}`}
                      placeholder="选填"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-dong-light mb-1">分类</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border border-dong-indigo/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-dong-indigo/40 bg-white"
                    >
                      <option value="学习心得">学习心得</option>
                      <option value="文化感悟">文化感悟</option>
                      <option value="平台反馈">平台反馈</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-dong-light mb-1">兴趣方向</label>
                    <select
                      value={formData.interest}
                      onChange={(e) => setFormData({ ...formData, interest: e.target.value })}
                      className="w-full border border-dong-indigo/15 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-dong-indigo/40 bg-white"
                    >
                      <option value="侗语学习">侗语学习</option>
                      <option value="普通话学习">普通话学习</option>
                      <option value="侗族文化">侗族文化</option>
                      <option value="侗族音乐">侗族音乐</option>
                      <option value="其他">其他</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-dong-light mb-1">留言内容 *</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => { setFormData({ ...formData, content: e.target.value }); setErrors({ ...errors, content: "" }); }}
                    rows={4}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none resize-none transition-colors ${errors.content ? "border-red-300 focus:border-red-400" : "border-dong-indigo/15 focus:border-dong-indigo/40"}`}
                    placeholder="写下您的留言..."
                  />
                  {errors.content && <p className="text-xs text-red-500 mt-0.5">{errors.content}</p>}
                </div>

                <Button type="submit" className="w-full bg-dong-indigo hover:bg-dong-deep text-white">
                  <Send className="w-4 h-4 mr-1" /> 发布留言
                </Button>
              </form>
            </div>

            {/* Right: Messages */}
            <div>
              {/* Search & Filter */}
              <div className="flex flex-col sm:flex-row gap-3 mb-5">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dong-light/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full border border-dong-indigo/15 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-dong-indigo/40 bg-white"
                    placeholder="搜索留言..."
                  />
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Filter className="w-4 h-4 text-dong-light flex-shrink-0" />
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                        filterCategory === cat ? "bg-dong-indigo text-white" : "bg-white text-dong-light border border-dong-indigo/10 hover:bg-dong-indigo/5"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-dong-light mb-3">共 {filteredMessages.length} 条留言</p>

              {/* Message List */}
              <div className="space-y-3">
                {filteredMessages.length === 0 ? (
                  <div className="bg-white rounded-xl p-10 border border-dong-indigo/10 text-center">
                    <MessageCircle className="w-10 h-10 text-dong-light/30 mx-auto mb-3" />
                    <p className="text-dong-light">暂无留言</p>
                  </div>
                ) : (
                  filteredMessages.map((msg) => (
                    <div key={msg.id} className="bg-white rounded-xl p-5 border border-dong-indigo/10 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-dong-indigo/10 flex items-center justify-center">
                            <User className="w-4 h-4 text-dong-indigo" />
                          </div>
                          <div>
                            <span className="text-sm font-bold text-dong-indigo">{msg.name}</span>
                            <div className="flex items-center gap-2 text-[10px] text-dong-light">
                              <Clock className="w-3 h-3" /> {msg.time}
                              <span className="px-1.5 py-0.5 bg-dong-indigo/5 rounded-full">{msg.category}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleLike(msg.id)}
                          className={`flex items-center gap-1 text-xs transition-colors ${msg.liked ? "text-red-500" : "text-dong-light hover:text-red-400"}`}
                        >
                          <Heart className={`w-4 h-4 ${msg.liked ? "fill-current" : ""}`} />
                          {msg.likes}
                        </button>
                      </div>
                      <p className="text-sm text-foreground/75 leading-relaxed pl-10">{msg.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
