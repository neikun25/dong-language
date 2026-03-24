/**
 * AI助手页面
 * 功能：生成个性化侗语学习计划、回答侗语学习问题
 */
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, BookOpen, Target, Calendar, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  { label: "生成学习计划", icon: <Calendar className="w-4 h-4" />, prompt: "请根据我是零基础学习者，帮我制定一个4周的侗语声调学习计划，每天30分钟。" },
  { label: "声调学习技巧", icon: <Target className="w-4 h-4" />, prompt: "侗语有15个声调，对于普通话母语者来说，学习侗语声调有哪些实用技巧？" },
  { label: "侗语文化背景", icon: <BookOpen className="w-4 h-4" />, prompt: "请介绍一下侗族的语言文化背景，以及学习侗语对文化保护有什么意义？" },
  { label: "发音难点解析", icon: <Sparkles className="w-4 h-4" />, prompt: "侗语中哪些声调对普通话母语者来说最难掌握？有什么专项练习方法？" },
];

const SYSTEM_PROMPT = `你是"侗音绘语"侗族语言学习平台的AI助手，名叫"侗侗"。你专注于帮助用户学习侗语（南部侗语，贵州榕江方言），具备以下专业知识：
1. 侗语语音系统：15个声调（9舒声调+6促声调），声调编码如55、35、11、323、13、31、53、453、33等
2. 侗语基本词汇：包含字表75个核心词汇
3. 侗族文化：侗族大歌、琵琶歌、民间故事、传统习俗
4. 语言学习方法：声调对比练习、听辨训练、最小对立词组练习

请用友好、专业的中文回答，适当使用侗语例词（如 bal 鱼、tang 糖等）来举例说明。如果用户询问学习计划，请给出具体的每日/每周安排。`;

const BASE_URL = typeof __BASE_PATH__ !== 'undefined' ? __BASE_PATH__ : '';
declare const __BASE_PATH__: string;

export default function AiAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "你好！我是侗侗，你的侗语学习助手。我可以帮你制定学习计划、解答声调疑问、介绍侗族文化。有什么我可以帮你的吗？"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const isFirstRender = useRef(true);

  // 只在新消息发送后才滚动聊天容器到底部，不影响页面滚动
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.filter(m => m.id !== "welcome").map(m => ({ role: m.role, content: m.content })),
        { role: "user", content: text.trim() }
      ];

      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(import.meta as any).env?.VITE_OPENAI_KEY || ""}`
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          messages: apiMessages,
          max_tokens: 800,
          temperature: 0.7
        })
      });

      if (!resp.ok) throw new Error(`API错误: ${resp.status}`);
      const data = await resp.json();
      const content = data.choices?.[0]?.message?.content || "抱歉，我暂时无法回答这个问题，请稍后再试。";
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content }]);
    } catch {
      // API失败时使用预设回复
      const fallbackReplies: Record<string, string> = {
        "学习计划": "根据你的需求，我为你制定以下4周学习计划：\n\n**第1周：声调入门**\n- 每天15分钟：听9个舒声调录音，重点感受55（高平）、35（中升）、11（低平）\n- 每天15分钟：跟读字表词汇\n\n**第2周：声调对比**\n- 重点练习容易混淆的声调对：55 vs 33，35 vs 13\n- 使用「声调练习」页面的听辨测验\n\n**第3周：促声调**\n- 学习6个促声调，注意入声的短促特征\n\n**第4周：综合练习**\n- 使用AI检测功能验证发音\n- 尝试阅读民间故事",
        "声调": "侗语声调学习技巧：\n\n1. **先听后说**：反复听田野录音，建立音高感知\n2. **五度标记法**：用1-5数字感受音高，如55调全程保持最高位\n3. **最小对立词组**：如 bal（鱼，55调）vs bal（不同声调的词），感受音位区别\n4. **分组记忆**：先掌握平调（55、33、11），再学升降调\n5. **每日坚持**：声调学习需要肌肉记忆，建议每天至少15分钟",
        "文化": "侗族语言文化背景：\n\n侗族主要分布在贵州、湖南、广西交界地区，人口约300万。侗语属汉藏语系壮侗语族，分南北两大方言。\n\n**文化特色：**\n- **侗族大歌**：无指挥无伴奏的多声部合唱，2009年列入联合国非遗名录\n- **琵琶歌**：弹唱一体的独特艺术形式，在月堂行歌坐月时演唱\n- **鼓楼文化**：侗族社区的精神中心\n\n学习侗语不仅是语言技能，更是对少数民族文化的传承与保护。",
      };
      
      let reply = "感谢你的提问！作为侗语学习助手，我建议你从声调入手，先熟悉9个舒声调，再学习6个促声调。平台上的「声调练习」页面有真实田野录音，非常适合入门练习。有具体问题随时问我！";
      for (const [key, val] of Object.entries(fallbackReplies)) {
        if (text.includes(key)) { reply = val; break; }
      }
      setMessages(prev => [...prev, { id: Date.now().toString(), role: "assistant", content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([{
      id: "welcome",
      role: "assistant",
      content: "你好！我是侗侗，你的侗语学习助手。我可以帮你制定学习计划、解答声调疑问、介绍侗族文化。有什么我可以帮你的吗？"
    }]);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#f8f6f2" }}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-24 pb-10 overflow-hidden" style={{ background: "linear-gradient(135deg, #3a3a6e 0%, #5a4a8e 50%, #7a5aae 100%)" }}>
        <div className="container relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <img
                src={`${BASE_URL}/ip-yes.png`}
                alt="侗侗"
                className="w-16 h-16 rounded-full object-cover border-2 border-white/30"
              />
              <div className="text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-white" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  AI学习助手·侗侗
                </h1>
                <p className="text-white/70 text-sm">你的专属侗语学习伙伴</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 container py-6 max-w-3xl mx-auto">
        {/* 快捷提示 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
          {QUICK_PROMPTS.map((p, i) => (
            <button key={i} onClick={() => sendMessage(p.prompt)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-medium border bg-white hover:shadow-sm transition-all text-left"
              style={{ borderColor: "rgba(58,58,110,0.15)", color: "#3a3a6e" }}>
              <span style={{ color: "#7a5aae" }}>{p.icon}</span>
              {p.label}
            </button>
          ))}
        </div>

        {/* 聊天区域 */}
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden" style={{ borderColor: "rgba(58,58,110,0.12)" }}>
          {/* 消息列表 */}
          <div ref={messagesContainerRef} className="h-[420px] overflow-y-auto p-4 space-y-4">
            <AnimatePresence initial={false}>
              {messages.map(msg => (
                <motion.div key={msg.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  {/* 头像 */}
                  {msg.role === "assistant" ? (
                    <img src={`${BASE_URL}/ip-happy.png`} alt="侗侗" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: "#3a3a6e" }}>我</div>
                  )}
                  {/* 消息气泡 */}
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "text-white rounded-tr-sm"
                      : "rounded-tl-sm border"
                  }`}
                    style={msg.role === "user"
                      ? { backgroundColor: "#3a3a6e" }
                      : { backgroundColor: "rgba(58,58,110,0.04)", borderColor: "rgba(58,58,110,0.1)", color: "#2d2d4e" }
                    }>
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {loading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                <img src={`${BASE_URL}/ip-working.png`} alt="侗侗" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                <div className="rounded-2xl rounded-tl-sm px-4 py-3 border" style={{ backgroundColor: "rgba(58,58,110,0.04)", borderColor: "rgba(58,58,110,0.1)" }}>
                  <div className="flex gap-1 items-center h-5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: "#7a5aae", animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* 输入区域 */}
          <div className="border-t p-3 flex gap-2 items-end" style={{ borderColor: "rgba(58,58,110,0.1)" }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="输入你的问题，按 Enter 发送（Shift+Enter 换行）"
              rows={1}
              className="flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#3a3a6e]/20"
              style={{ borderColor: "rgba(58,58,110,0.2)", color: "#2d2d4e", maxHeight: 120 }}
            />
            <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-40"
              style={{ backgroundColor: "#3a3a6e" }}>
              <Send className="w-4 h-4" />
            </button>
            <button onClick={resetChat} title="清空对话"
              className="w-10 h-10 rounded-xl flex items-center justify-center border transition-all hover:bg-gray-50"
              style={{ borderColor: "rgba(58,58,110,0.2)", color: "#3a3a6e" }}>
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        <p className="text-xs text-center mt-3" style={{ color: "rgba(58,58,110,0.4)" }}>
          侗侗基于AI技术，回答仅供学习参考。如需专业语言学指导，请咨询专业教师。
        </p>
      </main>

      <Footer />
    </div>
  );
}
