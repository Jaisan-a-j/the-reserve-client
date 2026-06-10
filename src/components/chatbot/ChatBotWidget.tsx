import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { MessageCircle, Send, X } from "lucide-react";
import { addUserMessage } from "../../features/chat/chatSlice";
import { sendChatMessageThunk } from "../../features/chat/chatThunk";

const ChatBotWidget = () => {
  const dispatch = useAppDispatch();
  const { messages, loading, error } = useAppSelector((state) => state.chat);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    dispatch(addUserMessage(trimmed));
    dispatch(sendChatMessageThunk(trimmed));
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <div
        className="fixed bottom-6 right-6 z-60 flex h-16 w-16 cursor-pointer items-center justify-center rounded-full bg-[#7c5dfa] shadow-[0_24px_50px_-20px_rgba(124,93,250,0.75)] transition duration-200 hover:bg-[#6547f0]"
        aria-label="Open chat"
      >
        <button
          type="button"
          className="flex h-full w-full items-center justify-center text-white"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <MessageCircle size={28} />
        </button>
      </div>

      <div
        className={`fixed bottom-24 right-6 z-60 flex h-130 w-90 flex-col overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-[0_30px_90px_-30px_rgba(0,0,0,0.3)] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6 pointer-events-none"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#7c5dfa]/10 px-5 py-4">
          <div>
            <p className="text-sm font-semibold text-slate-900">
              TheReserveBot
            </p>
            <p className="text-xs text-slate-500">
              Ask anything about orders, menus, and reservations.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm transition hover:bg-slate-100"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`max-w-[80%] rounded-3xl px-4 py-3 text-sm shadow-sm ${
                  message.role === "bot"
                    ? "bg-slate-100 text-slate-900"
                    : "ml-auto bg-[#7c5dfa] text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="max-w-[80%] rounded-3xl bg-slate-100 px-4 py-3 text-sm text-slate-900 shadow-sm">
                Typing...
              </div>
            )}
            {error && (
              <div className="max-w-[80%] rounded-3xl bg-amber-100 px-4 py-3 text-sm text-amber-900 shadow-sm">
                {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-4 py-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#7c5dfa] focus:ring-2 focus:ring-[#7c5dfa]/20"
              placeholder="Type a message..."
              aria-label="Type your message"
            />
            <button
              type="button"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#7c5dfa] text-white transition hover:bg-[#6547f0]"
              onClick={handleSend}
              aria-label="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBotWidget;
