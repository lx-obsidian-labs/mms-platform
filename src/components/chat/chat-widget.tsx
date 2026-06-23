"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Loader2, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  message: string;
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", message: "Hi! I'm MMS AI Assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(
    "chat_" + Array.from(crypto.getRandomValues(new Uint32Array(1)))[0].toString(36).substring(2, 10)
  );

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => scrollToBottom(), [messages, scrollToBottom]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", message: text }]);
    setLoading(true);

    const form = new FormData();
    form.set("message", text);
    form.set("sessionId", sessionId.current);

    try {
      const { chatWithAI } = await import("@/lib/actions");
      const result = await chatWithAI(form);
      if (result.success && result.reply) {
        setMessages((prev) => [...prev, { role: "assistant", message: result.reply! }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", message: "Sorry, I couldn't process that. Please try again." },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", message: "Something went wrong. Please try again." },
      ]);
    }

    setLoading(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-gold text-industrial-black shadow-lg transition-all hover:bg-gold-light hover:shadow-[0_0_30px_rgba(217,164,0,0.3)]",
          open && "hidden"
        )}
        aria-label="Open chat"
      >
        <MessageCircle className="size-6" />
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex w-[360px] flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0d] shadow-2xl sm:w-[400px]">
          {/* Header */}
          <div className="flex items-center justify-between bg-gold px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-full bg-industrial-black">
                <Bot className="size-4 text-gold" />
              </div>
              <div>
                <p className="text-sm font-bold text-industrial-black">MMS AI Assistant</p>
                <p className="text-[10px] text-industrial-black/70">Online</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="flex size-8 items-center justify-center rounded-full bg-industrial-black/10 text-industrial-black transition-colors hover:bg-industrial-black/20"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: "400px" }}>
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn("mb-3 flex", msg.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-gold/20 text-off-white"
                      : "bg-surface text-off-white"
                  )}
                >
                  {msg.message}
                </div>
              </div>
            ))}
            {loading && (
              <div className="mb-3 flex justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-surface px-3.5 py-2.5">
                  <Loader2 className="size-4 animate-spin text-gold" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-white/5 p-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                disabled={loading}
                className="h-10 flex-1 rounded-lg border border-white/10 bg-surface px-3.5 text-sm text-off-white placeholder:text-muted-foreground/50 focus:border-gold/50 focus:outline-none disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={!input.trim() || loading}
                className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gold text-industrial-black transition-all hover:bg-gold-light disabled:opacity-40"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
