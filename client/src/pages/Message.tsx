/*
 * Design: 留言页面
 * 轮播图 + 留言表单(姓名/手机/邮箱/兴趣/内容) + 右侧装饰图
 * 忠实还原PSD设计稿布局
 */
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Carousel from "@/components/Carousel";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MessageItem {
  id: number;
  name: string;
  content: string;
  time: string;
  interested: boolean;
}

export default function Message() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    interested: true,
    content: "",
  });

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 1,
      name: "小明",
      content: "侗族文化真的很有魅力，特别是侗族大歌，希望能学到更多侗语！",
      time: "2025-07-28 14:30",
      interested: true,
    },
    {
      id: 2,
      name: "李老师",
      content: "这个平台的发音评分功能很实用，对我教学帮助很大。",
      time: "2025-07-25 09:15",
      interested: true,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.content) {
      toast.error("请填写姓名和留言内容");
      return;
    }

    const newMessage: MessageItem = {
      id: Date.now(),
      name: formData.name,
      content: formData.content,
      time: new Date().toLocaleString("zh-CN"),
      interested: formData.interested,
    };

    setMessages([newMessage, ...messages]);
    setFormData({ name: "", phone: "", email: "", interested: true, content: "" });
    toast.success("留言发送成功！感谢您的反馈");
  };

  return (
    <div className="min-h-screen flex flex-col bg-dong-paper">
      <Navbar />
      <Carousel />

      {/* Message Form Section */}
      <section className="py-12 px-4">
        <div className="max-w-[1100px] mx-auto">
          {/* Title */}
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-dong-indigo font-bold inline-flex items-center gap-3">
              <span className="text-dong-gold text-lg">❖</span>
              给我们留言
              <span className="text-dong-gold text-lg">❖</span>
            </h2>
            <p className="text-dong-light text-sm mt-1 font-['Crimson_Text'] italic">
              Leave a message
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Form */}
            <form onSubmit={handleSubmit} className="flex-1 space-y-6">
              <div>
                <label className="block text-sm font-bold text-dong-indigo mb-2">姓名：</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="请输入您的姓名"
                  className="w-full border-2 border-dong-indigo/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dong-indigo/40 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dong-indigo mb-2">手机号码：</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="请输入您的手机号码"
                  className="w-full border-2 border-dong-indigo/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dong-indigo/40 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dong-indigo mb-2">邮箱：</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="请输入您的邮箱"
                  className="w-full border-2 border-dong-indigo/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dong-indigo/40 transition-colors bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-dong-indigo mb-3">您是否对侗语感兴趣</label>
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interested"
                      checked={formData.interested === true}
                      onChange={() => setFormData({ ...formData, interested: true })}
                      className="w-4 h-4 accent-dong-rose"
                    />
                    <span className="text-sm">是</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="interested"
                      checked={formData.interested === false}
                      onChange={() => setFormData({ ...formData, interested: false })}
                      className="w-4 h-4 accent-dong-rose"
                    />
                    <span className="text-sm">否</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-dong-indigo mb-2">留言内容：</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入里面内容"
                  rows={6}
                  className="w-full border-2 border-dong-indigo/15 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-dong-indigo/40 transition-colors bg-white resize-none"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-dong-indigo hover:bg-dong-deep text-white px-10 py-3 rounded-lg font-medium"
                >
                  发送
                </Button>
              </div>
            </form>

            {/* Right: Decorative Image */}
            <div className="lg:w-[320px] flex-shrink-0">
              <div className="rounded-xl overflow-hidden shadow-lg border border-dong-indigo/10">
                <img
                  src="https://d2xsxph8kpxj0f.cloudfront.net/310519663064893205/SY2i5NaAzwi6E5fT3x7KZc/dong-girl-portrait-5gRSDKjXUrXYxpMmfAKLGP.webp"
                  alt="侗族少女"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>

          {/* Message List */}
          {messages.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-serif text-dong-indigo font-bold mb-4">留言列表</h3>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="bg-white rounded-lg p-5 border border-dong-indigo/10 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-dong-indigo/10 flex items-center justify-center text-dong-indigo text-sm font-bold">
                          {msg.name[0]}
                        </div>
                        <span className="font-medium text-dong-indigo text-sm">{msg.name}</span>
                        {msg.interested && (
                          <span className="text-xs bg-dong-rose/10 text-dong-rose px-2 py-0.5 rounded-full">
                            对侗语感兴趣
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-dong-light">{msg.time}</span>
                    </div>
                    <p className="text-sm text-foreground/75 leading-relaxed pl-10">
                      {msg.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
