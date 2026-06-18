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

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 639px)");

    const updateScrollLock = () => {
      if (isOpen && mobileQuery.matches) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
    };

    updateScrollLock();
    mobileQuery.addEventListener("change", updateScrollLock);

    return () => {
      mobileQuery.removeEventListener("change", updateScrollLock);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      <div className="fixed bottom-6 right-6 z-[9999]">
        <button
          type="button"
          className="
            flex h-14 w-14 items-center justify-center
            rounded-full
            bg-[#7c5dfa]
            text-white
            shadow-[0_24px_50px_-20px_rgba(124,93,250,0.75)]
            transition-all duration-200
            hover:bg-[#6547f0]
            sm:h-16 sm:w-16
          "
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close chat" : "Open chat"}
        >
          <MessageCircle size={24} className="sm:h-7 sm:w-7" />
        </button>
      </div>

      <div
        className={`
          fixed inset-0 z-[9998] bg-black/60
          transition-opacity duration-300 ease-in-out
          sm:hidden
          ${isOpen ? "opacity-100" : "pointer-events-none opacity-0"}
        `}
        onClick={() => setIsOpen(false)}
        aria-hidden={!isOpen}
      />

      <div
        className={`
          fixed
          top-20
          bottom-24
          left-3
          right-3
          z-[9999]

          flex
          flex-col
          overflow-hidden

          rounded-4xl
          border
          border-slate-200
          bg-white

          shadow-[0_30px_90px_-30px_rgba(0,0,0,0.3)]

          transition-all
          duration-300
          ease-in-out

          sm:top-auto
          sm:bottom-32
          sm:left-auto
          sm:right-6
          sm:w-80
          sm:h-[520px]

          ${
            isOpen
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-6 opacity-0"
          }
        `}
      >
        <div className="flex items-center justify-between border-b border-slate-200 bg-[#7c5dfa]/10 px-4 py-3 sm:px-5 sm:py-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-slate-900">
              TheReserveBot
            </p>
            <p className="truncate text-xs text-slate-500">
              Ask anything about orders, menus,
              <br />
              and reservations.
            </p>
          </div>
          <button
            type="button"
            className="
              ml-2
              inline-flex
              h-8
              w-8
              flex-shrink-0
              items-center
              justify-center
              rounded-full
              bg-white
              text-slate-600
              shadow-sm
              transition
              hover:bg-slate-100
              sm:h-9
              sm:w-9
            "
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X size={16} className="sm:h-[18px] sm:w-[18px]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 sm:px-5 sm:py-4">
          <div className="space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`break-words rounded-3xl px-3 py-2 text-sm shadow-sm sm:px-4 sm:py-3 ${
                  message.role === "bot"
                    ? "w-fit max-w-[85%] bg-slate-100 text-slate-900"
                    : "ml-auto w-fit max-w-[85%] bg-[#7c5dfa] text-white"
                }`}
              >
                {message.text}
              </div>
            ))}
            {loading && (
              <div className="w-fit max-w-[85%] break-words rounded-3xl bg-slate-100 px-3 py-2 text-sm text-slate-900 shadow-sm sm:px-4 sm:py-3">
                Typing...
              </div>
            )}
            {error && (
              <div className="w-fit max-w-[85%] break-words rounded-3xl bg-amber-100 px-3 py-2 text-sm text-amber-900 shadow-sm sm:px-4 sm:py-3">
                {error}
              </div>
            )}
          <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50 px-3 py-3 sm:px-4 sm:py-4">
          <div className="flex gap-2 sm:gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              aria-label="Type your message"
              className="
                flex-1
                rounded-full
                border
                border-slate-200
                bg-white
                px-3
                py-2
                text-xs
                text-slate-900
                outline-none
                transition

                focus:border-[#7c5dfa]
                focus:ring-2
                focus:ring-[#7c5dfa]/20

                sm:px-4
                sm:py-3
                sm:text-sm
              "
            />

            <button
              type="button"
              onClick={handleSend}
              aria-label="Send message"
              className="
                inline-flex
                h-10
                w-10
                flex-shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#7c5dfa]
                text-white
                transition
                hover:bg-[#6547f0]

                sm:h-12
                sm:w-12
              "
            >
              <Send size={16} className="sm:h-[18px] sm:w-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatBotWidget;