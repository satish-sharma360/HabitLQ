import React, { useEffect, useRef, useState } from "react";
import axiosInstance from "../../api/axios";

/* ── helpers ──────────────────────────────────────────────────────── */
const Spinner = ({ size = 4 }) => (
  <div
    className={`w-${size} h-${size} border-2 border-indigo-500 border-t-transparent rounded-full animate-spin`}
  />
);

const formatTime = (iso) => {
  if (!iso) return "";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/* ── message bubble ───────────────────────────────────────────────── */
const Bubble = ({ role, text }) => {
  const isUser = role === "user";
  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {/* avatar */}
      <div
        className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold ${
          isUser ? "bg-indigo-600" : "bg-zinc-700"
        }`}
      >
        {isUser ? "U" : "🤖"}
      </div>

      {/* bubble */}
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "bg-zinc-800 text-zinc-100 rounded-tl-sm"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════ */
const AiCoach = () => {
  const [messages, setMessages] = useState([]); // { role: "user"|"ai", text }
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const bottomRef = useRef(null);

  /* fetch history on mount */
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await axiosInstance.get("/ai/history");
        setHistory(data.data);
      } catch (err) {
        console.error("Error fetching AI history", err);
      } finally {
        setHistoryLoading(false);
      }
    };
    fetchHistory();
  }, []);

  /* scroll to bottom whenever messages change */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* send message */
  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    // append user bubble immediately
    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axiosInstance.post("/ai/ask", { message: trimmed });
      setMessages((prev) => [...prev, { role: "ai", text: data.reply }]);

      // prepend to local history so it appears without refetch
      setHistory((prev) => [
        { _id: Date.now(), message: trimmed, reply: data.reply, createdAt: new Date().toISOString() },
        ...prev,
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "ai", text: "Something went wrong. Please try again." },
      ]);
      console.error("Error asking AI", err);
    } finally {
      setLoading(false);
    }
  };

  /* load a history item into chat */
  const loadHistoryItem = (item) => {
    setMessages([
      { role: "user", text: item.message },
      { role: "ai", text: item.reply },
    ]);
  };

  /* enter key support */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-10rem)]">

      {/* ── Main Chat ───────────────────────────────────────────────── */}
      <div className="lg:col-span-2 flex flex-col bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

        {/* chat header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-lg">
            🤖
          </div>
          <div>
            <p className="font-semibold text-sm">HabitIQ Coach</p>
            <p className="text-xs text-zinc-400">Powered by AI · knows your habits & logs</p>
          </div>
        </div>

        {/* messages area */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-zinc-500 space-y-3 text-center">
              <span className="text-4xl">💬</span>
              <p className="text-sm max-w-xs">
                Ask your AI coach anything — about your habits, streaks, motivation, or what to focus on next.
              </p>
              {/* quick prompts */}
              <div className="flex flex-wrap gap-2 justify-center mt-2">
                {[
                  "How am I doing this week?",
                  "Which habit should I focus on?",
                  "Give me motivation!",
                  "Analyze my streaks",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="text-xs bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-1.5 rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <Bubble key={i} role={msg.role} text={msg.text} />
          ))}

          {/* typing indicator */}
          {loading && (
            <div className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-sm">
                🤖
              </div>
              <div className="bg-zinc-800 px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5 items-center">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-zinc-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* input bar */}
        <div className="px-4 py-4 border-t border-zinc-800 flex gap-3">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask your AI Coach… (Enter to send)"
            className="flex-1 bg-zinc-800 text-sm text-zinc-100 placeholder-zinc-500 px-4 py-2.5 rounded-xl outline-none resize-none border border-zinc-700 focus:border-indigo-500 transition-colors"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed px-4 rounded-xl transition-colors flex items-center gap-2 text-sm font-medium"
          >
            {loading ? <Spinner size={4} /> : "Send"}
          </button>
        </div>
      </div>

      {/* ── History Sidebar ──────────────────────────────────────────── */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden">
        <div className="px-5 py-4 border-b border-zinc-800">
          <h2 className="font-semibold text-sm">Recent Questions</h2>
          <p className="text-xs text-zinc-500 mt-0.5">Click any to reload the chat</p>
        </div>

        <div className="flex-1 overflow-y-auto">
          {historyLoading ? (
            <div className="flex justify-center py-10">
              <Spinner size={6} />
            </div>
          ) : history.length === 0 ? (
            <p className="text-sm text-zinc-500 text-center py-10 px-4">
              No past questions yet. Start chatting!
            </p>
          ) : (
            <ul className="divide-y divide-zinc-800">
              {history.map((item) => (
                <li key={item._id}>
                  <button
                    onClick={() => loadHistoryItem(item)}
                    className="w-full text-left px-5 py-3 hover:bg-zinc-800 transition-colors space-y-1"
                  >
                    <p className="text-sm text-zinc-200 line-clamp-2 leading-snug">
                      {item.message}
                    </p>
                    <p className="text-xs text-zinc-500">{formatTime(item.createdAt)}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

    </div>
  );
};

export default AiCoach;