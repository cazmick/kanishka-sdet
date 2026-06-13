import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Bot, Send, Sparkles, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import chatBuddy from "@/assets/chat-buddy.png";

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
            className="fixed bottom-16 right-2 z-50 flex flex-col items-center gap-1 md:bottom-20 md:right-4"
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
                className="absolute -bottom-1 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45"
                style={{ background: "oklch(0.7 0.22 320)" }}
              />
            </motion.div>
            {/* Dancing buddy */}
            <motion.div
              animate={
                reacted
                  ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0], scale: [1, 1.3, 1.2, 1.1, 1] }
                  : {
                      y: [0, -10, 0, -6, 0],
                      rotate: [0, -8, 8, -5, 0],
                      x: [0, 3, -3, 2, 0],
                    }
              }
              transition={
                reacted
                  ? { duration: 0.7 }
                  : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }
              }
              className="relative h-24 w-24"
              style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.35))" }}
            >
              <img
                src={chatBuddy}
                alt="Chat buddy"
                width={200}
                height={200}
                loading="lazy"
                className="h-full w-full object-contain"
              />
              {/* sparkle ring */}
              <motion.span
                className="pointer-events-none absolute inset-0 rounded-full"
                animate={{ scale: [1, 1.5], opacity: [0.6, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                style={{ boxShadow: "0 0 0 2px oklch(0.78 0.18 195 / 0.5)" }}
              />
              {/* extra sparkles */}
              <motion.span
                className="pointer-events-none absolute -top-1 -right-1 h-2 w-2 rounded-full bg-amber-300"
                animate={{ scale: [0.8, 1.4, 0.8], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="pointer-events-none absolute -bottom-1 -left-1 h-1.5 w-1.5 rounded-full bg-cyan-300"
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
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
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        isUser
                          ? "rounded-br-sm text-white whitespace-pre-wrap"
                          : "rounded-bl-sm text-foreground/90"
                      }`}
                      style={
                        isUser
                          ? { background: "var(--gradient-cyan-magenta, linear-gradient(135deg, oklch(0.78 0.18 195), oklch(0.7 0.22 320)))" }
                          : { background: "oklch(1 0 0 / 0.06)", border: "1px solid oklch(1 0 0 / 0.08)" }
                      }
                    >
                      {isUser ? (
                        text
                      ) : text ? (
                        <div className="text-sm leading-relaxed">
                          <ReactMarkdown
                            components={{
                              a: ({ node, className, ...props }) => (
                                <a
                                  {...props}
                                  className={`font-semibold text-cyan underline underline-offset-2 hover:text-lime transition-colors ${className || ""}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                />
                              ),
                              p: ({ node, ...props }) => <p {...props} className="my-1" />,
                              ul: ({ node, ...props }) => <ul {...props} className="my-1 list-disc pl-4" />,
                              ol: ({ node, ...props }) => <ol {...props} className="my-1 list-decimal pl-4" />,
                            }}
                          >
                            {text}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        isLoading && <Loader2 className="h-4 w-4 animate-spin" />
                      )}
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
