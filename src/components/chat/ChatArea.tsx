import React, { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface Message {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  isStatus?: boolean;
  candidates?: Array<{ corp_name: string; corp_code: string }>;
  isLoginError?: boolean;
}

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  companyName: string;
  onSelectCandidate: (corpCode: string, corpName: string) => void;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isSidebarOpen,
  onToggleSidebar,
  companyName,
  onSelectCandidate,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottom, setShowScrollBottom] = useState<boolean>(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } =
      scrollContainerRef.current;
    const isScrollUp = scrollHeight - scrollTop - clientHeight > 300;
    setShowScrollBottom(isScrollUp);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section 
      className="w-full flex flex-col h-full box-border font-sans relative"
      style={{ background: "var(--bg-panel)", color: "var(--text)" }}
    >
      <div 
        className="h-11 px-5 border-b border-solid flex items-center justify-between shrink-0 box-border relative"
        style={{ borderBottomColor: "var(--border)", background: "var(--bg-panel)" }}
      >
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "최근 대화 닫기" : "최근 대화 열기"}
          className="group rounded-3xl p-1.5 px-2 cursor-pointer bg-transparent dark:bg-transparent text-[#71717a] dark:text-zinc-400 transition-all duration-150 flex items-center justify-center h-8 w-8 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800 hover:text-[#18181b] dark:hover:text-zinc-50"
        >
          {/* 기본 사이드바 아이콘 */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="block group-hover:hidden"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>

          {/* 호버 시 사이드바 접기 피드백 아이콘 */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="hidden group-hover:block"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
            <path d="M16 15l-3-3 3-3"></path>
          </svg>
        </button>

        {/* 현재 대화 중인 기업 정보 노출 */}
        <span className="absolute left-1/2 transform -translate-x-1/2 text-xs font-bold text-zinc-800 dark:text-zinc-200 select-none tracking-tight">
          {companyName === "새 문서" ? "새 기업 분석 대화" : `${companyName}`}
        </span>
      </div>

      {/* 대화 피드 */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="custom-scrollbar flex-1 p-6 px-5 overflow-y-auto flex flex-col gap-6"
        style={{ background: "var(--bg-panel)" }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "user" ? (
              <div 
                className="max-w-[85%] py-2.5 px-4 rounded-xl text-md leading-relaxed text-left"
                style={{ background: "var(--bg)", color: "var(--text-h)" }}
              >
                {msg.text}
              </div>
            ) : (
              <div className="flex gap-3 max-w-[90%] flex-col">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-3xl bg-[#777777] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    AI
                  </div>
                  <div 
                    className="text-md leading-relaxed pt-1 whitespace-pre-wrap text-left flex-1"
                    style={{ color: "var(--text-h)" }}
                  >
                    <style>{`
                      @keyframes wordWave {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                      }
                    `}</style>
                    {msg.isStatus ? (
                      <div className="inline-flex flex-wrap font-medium" style={{ color: "var(--text)" }}>
                        {msg.text.split("").map((char, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              animation: "wordWave 1.4s infinite ease-in-out",
                              animationDelay: `${index * 0.06}s`,
                              whiteSpace: char === " " ? "pre" : "normal",
                            }}
                          >
                            {char}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <MarkdownRenderer content={msg.text} />
                    )}
                  </div>
                </div>

                {msg.candidates && msg.candidates.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-9 mt-2 max-w-[85%] box-border">
                    {msg.candidates.map((cand, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCandidate(cand.corp_code, cand.corp_name)}
                        className="py-1.5 px-3.5 rounded-full text-xs font-bold border border-solid cursor-pointer transition-all duration-150 select-none hover:bg-[var(--bg-hover)] hover:text-[var(--accent)] hover:border-[var(--accent)] hover:scale-[1.02] active:scale-[0.98] hover:shadow-sm"
                        style={{
                          background: "var(--bg-panel)",
                          borderColor: "var(--border)",
                          color: "var(--text-h)"
                        }}
                      >
                        {cand.corp_name}
                      </button>
                    ))}
                  </div>
                )}

                {/* 로그인 만료 시 로그인 버튼 제공 */}
                {msg.isLoginError && (
                  <div className="ml-9 mt-2.5">
                    <button
                      onClick={() => {
                        sessionStorage.removeItem("accessToken");
                        window.location.href = "/login";
                      }}
                      className="text-white rounded-xl py-2 px-4 text-xs font-bold transition-colors shadow-sm cursor-pointer border-none select-none hover:opacity-90"
                      style={{ background: "var(--accent)" }}
                    >
                      로그인 화면으로 이동
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 맨 밑으로 이동 플로팅 버튼 (이모티콘 제거, SVG 적용) */}
      {showScrollBottom && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-3 border border-solid rounded-full py-2 px-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center cursor-pointer transition-all duration-150 z-10"
          style={{ background: "var(--bg-panel)", borderColor: "var(--border)", color: "var(--text-h)" }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </button>
      )}

      <form
        onSubmit={onSendMessage}
        className="p-2.5 px-5 bg-transparent border-t border-solid"
        style={{ borderTopColor: "var(--border)" }}
      >
        <div 
          className="flex items-center rounded-md px-3.5 gap-3 h-9 transition-colors duration-150 border border-solid"
          style={{ borderColor: "var(--border)" }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              companyName === "새 문서"
                ? "분석할 기업명을 입력하세요..."
                : "추가 질문을 입력하세요..."
            }
            className="flex-1 border-none bg-transparent outline-none text-sm font-sans"
            style={{ color: "var(--text-h)" }}
          />
          <button
            type="submit"
            title="전송"
            className="border-none bg-transparent cursor-pointer flex items-center justify-center h-7 w-7 rounded-full shrink-0"
            style={{ color: "var(--text-h)" }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-zinc-500 dark:text-white"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
};

export default ChatArea;
