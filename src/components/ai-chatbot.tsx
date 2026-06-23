"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Loader2, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const WELCOME = "Hi! I'm the MMS AI assistant. I can help you with course recommendations, learning paths, portal navigation, and personalized study assistance. What would you like to explore?";

export function AiChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", content: WELCOME }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 1) {
      const welcomeMessage = "Welcome! I'm here to help you with your learning journey. I can:\n\n• 📚 Recommend courses based on your interests and goals\n• 🎯 Create personalized learning paths\n• 📊 Track your progress and suggest next steps\n• 💡 Provide study assistance for specific course concepts\n• 🎖️ Help with certificate requirements and career planning\n• 🔍 Answer questions about enrollment, fees, and policies\n\nWhat aspect of your training would you like to explore?";
      
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: welcomeMessage,
          },
        ]);
      }, 1000);
    }
  }, [open, messages.length]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();
      const reply = data.reply ?? "I'm having trouble connecting. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I'm unavailable right now. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* FAB */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gold text-black shadow-lg transition-all hover:bg-gold-light hover:shadow-[0_0_24px_rgba(217,164,0,0.4)]"
        aria-label="Toggle AI Assistant"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-white/5 bg-industrial-black px-4 py-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-gold/20">
                <Sparkles className="size-5 text-gold" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-off-white">MMS AI Assistant</p>
                <p className="text-[10px] text-muted-foreground">Powered by NVIDIA</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 400 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gold text-black"
                        : "bg-industrial-black text-off-white"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mb-3 flex justify-start">
                  <div className="flex items-center gap-2 rounded-xl bg-industrial-black px-4 py-3 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" />
                    Thinking...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/5 p-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me anything..."
                disabled={loading}
                className="flex-1 rounded-lg border border-white/10 bg-industrial-black px-3 py-2 text-sm text-off-white placeholder:text-white/20 focus:border-gold/40 focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gold text-black transition-all hover:bg-gold-light disabled:opacity-40"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
