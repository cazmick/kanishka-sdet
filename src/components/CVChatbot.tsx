import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "Summarize Kanishka's experience",
  "What AI/ML work has he done?",
  "Top automation skills?",
  "Current role at Salesforce?",
];

export default function CVChatbot() {
  const [open, setOpen] = useState(false);
  const [reacted, setReacted] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const initial: UIMessage[] = [
    {
      id: "welcome",
      role: "assistant",
      parts: [
        {
          type: "text",
          text: "Hi! I'm Kanishka's CV assistant. Ask me anything about his experience, skills, or projects.",
        },
      ],
    },
  ];

  const { messages, sendMessage, status } = useChat({
    id: "cv-chat",
    messages: initial,
    transport,
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 250);
  }, [open, messages.length]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || isLoading) return;
    sendMessage({ text: value });
    setInput("");
  };

  return (
    <>
      {/* Animated sticker pointing at chatbot */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="sticker"
            onClick={() => {
              setReacted(true);
              setTimeout(() => setOpen(true), 400);
            }}
            initial={{ opacity: 0, y: 20, scale: 0.5 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 12 }}
            aria-label="Chat with me"
            className="fixed bottom-24 right-4 z-50 flex items-center gap-2 md:bottom-28 md:right-10"
          >
            {/* Speech bubble */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="relative rounded-2xl px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
              style={{
                background: "linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320))",
              }}
            >
              Chat with me!
              <span
                className="absolute -bottom-1 right-4 h-3 w-3 rotate-45"
                style={{ background: "oklch(0.7 0.22 320)" }}
              />
            </motion.div>
            {/* Genmoji */}
            <motion.div
              animate={
                reacted
                  ? { rotate: [0, -20, 20, -10, 10, 0], scale: [1, 1.4, 1.4, 1.2, 1.2, 1] }
                  : { rotate: [0, -15, 15, -15, 0], y: [0, -6, 0, -6, 0] }
              }
              transition={
                reacted
                  ? { duration: 0.6 }
                  : { duration: 2.4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }
              }
              className="relative grid h-12 w-12 place-items-center rounded-full text-3xl"
              style={{
                background: "radial-gradient(circle at 30% 30%, oklch(0.95 0.1 90), oklch(0.78 0.18 60))",
                boxShadow: "0 8px 25px oklch(0.78 0.18 60 / 0.5), inset -3px -4px 8px oklch(0 0 0 / 0.15)",
              }}
            >
              <span style={{ filter: "drop-shadow(0 2px 3px rgba(0,0,0,0.25))" }}>
                {reacted ? "🤩" : "👇"}
              </span>
              {/* sparkle ring */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
                style={{ boxShadow: "0 0 0 2px oklch(0.95 0.1 90 / 0.6)" }}
              />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Open CV chatbot"
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full text-white shadow-2xl md:bottom-8 md:right-8"
        style={{
          background: "var(--gradient-hero, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))",
          boxShadow: "0 10px 40px oklch(0.78 0.18 195 / 0.45)",
        }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span key="b" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span className="pointer-events-none absolute inset-0 rounded-full animate-ping" style={{ background: "oklch(0.78 0.18 195 / 0.35)" }} />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass fixed bottom-24 right-3 z-50 flex h-[min(600px,80vh)] w-[min(400px,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-2xl border border-border md:bottom-28 md:right-8"
            style={{ background: "oklch(0.16 0.02 260 / 0.92)", backdropFilter: "blur(20px)", boxShadow: "0 25px 80px oklch(0 0 0 / 0.5)" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4 py-3" style={{ background: "var(--gradient-surface, transparent)" }}>
              <div className="relative grid h-9 w-9 place-items-center rounded-full" style={{ background: "var(--gradient-cyan-magenta, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))" }}>
                <Bot className="h-5 w-5 text-white" />
                <Sparkles className="absolute -right-1 -top-1 h-3 w-3 text-amber-300" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-display text-sm font-semibold">Ask about Kanishka</div>
                <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> CV assistant · online
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m) => {
                const text = m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");
                const isUser = m.role === "user";
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                        isUser
                          ? "rounded-br-sm text-white"
                          : "rounded-bl-sm text-foreground/90"
                      }`}
                      style={
                        isUser
                          ? { background: "var(--gradient-cyan-magenta, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))" }
                          : { background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.08)" }
                      }
                    >
                      {text || (m.role === "assistant" && isLoading && <Loader2 className="h-4 w-4 animate-spin" />)}
                    </div>
                  </motion.div>
                );
              })}
              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 rounded-2xl rounded-bl-sm px-3.5 py-2.5" style={{ background: "oklch(1 0 0 / 0.06)" }}>
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestions */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-1.5 px-4 pb-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    disabled={isLoading}
                    className="rounded-full border border-border/70 bg-white/5 px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground disabled:opacity-50"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-center gap-2 border-t border-border/60 p-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Kanishka's CV…"
                disabled={isLoading}
                className="flex-1 rounded-full border border-border/70 bg-white/5 px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/60 focus:outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full text-white transition-opacity disabled:opacity-40"
                style={{ background: "var(--gradient-cyan-magenta, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))" }}
                aria-label="Send"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
