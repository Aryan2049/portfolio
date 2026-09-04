import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";
import { profile, suggestionPrompts } from "../content/profile";
import { ChatError, streamReply, type ChatMessage } from "../lib/chat";

const GREETING = (first: string) =>
  `Hey, adventurer! I'm ${first}'s AI companion — ask me anything about ${first}: what they're building, the stack they use, or how to get in touch.`;

/* The quill (feather) that marks the chat launcher */
function Quill({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"
        fill="rgba(255,184,0,0.15)"
        stroke="#FFB800"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line x1="16" y1="8" x2="2" y2="22" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="17.5" y1="15" x2="9" y2="15" stroke="#FFB800" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const first = profile.name.split(" ")[0];

  // Seed the conversation the first time the panel opens
  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "assistant", content: GREETING(first) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Keep the newest message in view
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, streaming, busy, open]);

  // Clean up an in-flight request if the panel unmounts
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const send = async (raw: string) => {
    const text = raw.trim();
    if (!text || busy) return;
    setInput("");
    setError(null);
    const history: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(history);
    setBusy(true);
    setStreaming("");

    const controller = new AbortController();
    abortRef.current = controller;

    let acc = "";
    try {
      for await (const chunk of streamReply(history, controller.signal)) {
        acc += chunk;
        setStreaming(acc);
      }
      if (acc) {
        setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
      }
    } catch (err) {
      const message =
        err instanceof ChatError
          ? err.message
          : "Something went wrong on my end — please try again.";
      setError(message);
      if (acc) {
        setMessages((prev) => [...prev, { role: "assistant", content: acc }]);
      }
    } finally {
      setStreaming("");
      setBusy(false);
      abortRef.current = null;
    }
  };

  const close = () => {
    abortRef.current?.abort();
    setOpen(false);
    setBusy(false);
    setStreaming("");
  };

  return (
    <>
      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-4 bottom-24 z-50 flex h-[min(34rem,calc(100dvh-7rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border-2 border-gold/25 shadow-[0_24px_70px_rgba(0,0,0,0.65)] sm:right-6"
            style={{ background: "linear-gradient(160deg, #261c10 0%, #171006 55%, #120c05 100%)" }}
            role="dialog"
            aria-label={`Chat with ${first}'s AI assistant`}
          >
            {/* header */}
            <div className="flex items-center gap-3 border-b border-gold/15 px-4 py-3.5">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl"
                style={{ background: "linear-gradient(145deg, #FF8236 0%, #E05A12 100%)" }}
              >
                <Quill className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-heading truncate text-sm font-bold text-ash">{first}&apos;s assistant</p>
                <p className="flex items-center gap-1.5 text-[11px] text-gold/70">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                  </span>
                  {busy ? "scrying…" : "online · Groq/Claude"}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close chat"
                className="rounded-lg p-1.5 text-ash/50 transition-colors hover:bg-white/5 hover:text-ash"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* messages */}
            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <span className="mt-1 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-[10px] font-bold text-gold">
                      {first[0]}
                    </span>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap ${
                      m.role === "user"
                        ? "rounded-br-sm border border-gold/25 bg-gold/10 text-ash"
                        : "rounded-bl-sm border border-white/10 bg-[#1F180D] text-ash/90"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {busy && !streaming && (
                <div className="flex justify-start">
                  <span className="mt-1 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-[10px] font-bold text-gold">
                    {first[0]}
                  </span>
                  <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm border border-white/10 bg-[#1F180D] px-4 py-3">
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold/70"
                        style={{ animationDelay: `${d * 0.18}s` }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {streaming && (
                <div className="flex justify-start">
                  <span className="mt-1 mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-gold/30 bg-gold/10 text-[10px] font-bold text-gold">
                    {first[0]}
                  </span>
                  <div className="rounded-2xl rounded-bl-sm border border-white/10 bg-[#1F180D] px-3.5 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap text-ash/90">
                    {streaming}
                    <span className="animate-pulse text-gold">▍</span>
                  </div>
                </div>
              )}

              {error && !busy && (
                <div className="rounded-xl border border-amber-300/25 bg-amber-300/5 px-3.5 py-2.5 text-[12px] leading-relaxed text-amber-200/90">
                  {error}
                </div>
              )}

              {/* quick suggestions */}
              {messages.length <= 1 && !busy && (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {suggestionPrompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      className="rounded-xl border border-earth/30 bg-[#120d06]/80 px-3 py-2.5 text-left text-[11px] leading-snug text-ash/60 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-gold/15 px-3 py-3"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={`Ask about ${first}…`}
                disabled={busy}
                className="min-w-0 flex-1 rounded-xl border border-earth/30 bg-[#120d06]/80 px-3.5 py-2.5 text-sm text-ash placeholder:text-ash/35 focus:border-gold/50 focus:outline-none disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!input.trim() || busy}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-cocoa transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ background: "linear-gradient(145deg, #FFB800 0%, #E08A00 100%)" }}
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating action button — the leather & gold quill */}
      <motion.button
        initial={{ opacity: 0, translateY: 20, scale: 0 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ delay: 1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        onClick={() => (open ? close() : setOpen(true))}
        aria-label={open ? "Close AI chat" : `Chat with ${first}'s AI assistant`}
        className="group fixed right-4 bottom-6 z-50 sm:right-6"
      >
        <div
          className="chat-pulse pointer-events-none absolute -inset-3 rounded-2xl blur-xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,130,54,0.35) 0%, rgba(255,184,0,0.15) 50%, transparent 70%)",
          }}
        />
        <div
          className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border-2 border-gold/70 transition-colors group-hover:border-gold"
          style={{
            background: "linear-gradient(145deg, #3A2A1A 0%, #2A1C10 50%, #1E140C 100%)",
            boxShadow:
              "0 4px 16px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,184,0,0.15), 0 0 20px rgba(255,130,54,0.15)",
          }}
        >
          {/* stitched corners */}
          <span className="absolute top-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-gold/60" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-gold/60" />
          <span className="absolute bottom-1.5 left-1.5 h-1.5 w-1.5 rounded-full bg-gold/60" />
          <span className="absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full bg-gold/60" />
          <Quill className="relative z-10 h-6 w-6 drop-shadow-[0_0_8px_rgba(255,184,0,0.6)] transition-all group-hover:drop-shadow-[0_0_12px_rgba(255,184,0,0.85)]" />
        </div>
        {/* tooltip */}
        <span className="pointer-events-none absolute right-0 bottom-full mb-2 rounded-lg border border-gold/50 bg-[#2A1C10] px-2.5 py-1 text-[10px] font-medium whitespace-nowrap text-gold/90 opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
          Talk to me
        </span>
      </motion.button>
    </>
  );
}
