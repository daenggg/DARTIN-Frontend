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
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

  // 외부 클릭 시 드롭다운 닫기 처리
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".custom-select-container")) {
        setOpenDropdownIndex(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
    <section className="w-full bg-white dark:bg-[#121318] flex flex-col h-full box-border font-sans relative">
      {/* 챗 상단 간결한 토글 트리거 영역 */}
      <div className="h-11 px-5 border-b border-solid border-[#e2e8f0] dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#121318] shrink-0 box-border relative">
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
        className="custom-scrollbar flex-1 p-6 px-5 overflow-y-auto flex flex-col gap-6 bg-white dark:bg-[#121318]"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "user" ? (
              <div className="max-w-[85%] py-2.5 px-4 rounded-xl bg-[#f4f4f5] dark:bg-zinc-800 text-[#18181b] dark:text-[#f4f4f5] text-md leading-relaxed text-left">
                {msg.text}
              </div>
            ) : (
              <div className="flex gap-3 max-w-[90%] flex-col">
                <div className="flex gap-3">
                  <div className="w-6 h-6 rounded-3xl bg-[#777777] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    AI
                  </div>
                  <div className="text-[#18181b] dark:text-[#f4f4f5] text-md leading-relaxed pt-1 whitespace-pre-wrap text-left flex-1">
                    <style>{`
                      @keyframes wordWave {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                      }
                    `}</style>
                    {msg.isStatus ? (
                      <div className="inline-flex flex-wrap text-[#71717a] dark:text-zinc-400 font-medium">
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

                {/* 기업 후보군 커스텀 드롭다운 렌더링 (세로 공간 최소화 및 고급스러운 팝업 리스트) */}
                {msg.candidates && msg.candidates.length > 0 && (
                  <div className="custom-select-container relative ml-9 mt-2.5 max-w-[200px] w-full box-border">
                    {/* 드롭다운 트리거 버튼 */}
                    <button
                      onClick={() =>
                        setOpenDropdownIndex(
                          openDropdownIndex === index ? null : index,
                        )
                      }
                      className="w-full flex items-center justify-between bg-white dark:bg-zinc-900 border border-solid border-[#cbd5e1] dark:border-zinc-800 rounded-xl p-2.5 px-4 text-xs font-bold text-[#18181b] dark:text-[#f4f4f5] cursor-pointer hover:border-[#4f46e5] dark:hover:border-indigo-500 hover:shadow-[0_2px_8px_rgba(79,70,229,0.04)] dark:hover:shadow-[0_2px_8px_rgba(99,102,241,0.08)] transition-all duration-150 relative box-border select-none"
                    >
                      <span>분석할 기업 선택하기...</span>
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`text-zinc-400 dark:text-zinc-500 transition-transform duration-200 shrink-0 ${openDropdownIndex === index ? "transform rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </button>

                    {/* 커스텀 플로팅 팝오버 리스트 */}
                    {openDropdownIndex === index && (
                      <>
                        <style>{`
                          .custom-dropdown-scrollbar::-webkit-scrollbar {
                            width: 5px;
                          }
                          .custom-dropdown-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                          }
                          .custom-dropdown-scrollbar::-webkit-scrollbar-thumb {
                            background: #cbd5e1;
                            border-radius: 4px;
                          }
                          .custom-dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: #94a3b8;
                          }
                          .dark .custom-dropdown-scrollbar::-webkit-scrollbar-thumb {
                            background: #3f3f46;
                          }
                          .dark .custom-dropdown-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: #52525b;
                          }
                        `}</style>
                        <div
                          className="custom-dropdown-scrollbar absolute left-0 right-0 top-[115%] bg-white/95 dark:bg-[#181920]/95 border border-solid border-[#e2e8f0] dark:border-zinc-800 rounded-xl shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06),0_8px_16px_-6px_rgba(0,0,0,0.03)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.4)] backdrop-blur-md overflow-y-auto flex flex-col p-1.5 gap-0.5 z-50 box-border"
                          style={{
                            scrollbarWidth: "thin",
                            maxHeight: "150px",
                          }}
                        >
                          {msg.candidates.map((cand, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                onSelectCandidate(
                                  cand.corp_code,
                                  cand.corp_name,
                                );
                                setOpenDropdownIndex(null);
                              }}
                              className="w-full text-left p-1.5 px-3 rounded-lg text-xs font-bold text-[#18181b] dark:text-[#f4f4f5] hover:bg-[#f5f3ff] dark:hover:bg-indigo-950/40 hover:text-[#4f46e5] dark:hover:text-indigo-400 transition-colors duration-150 cursor-pointer border-none bg-transparent select-none box-border"
                            >
                              {cand.corp_name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
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
                      className="bg-[#4f46e5] dark:bg-indigo-600 text-white rounded-xl py-2 px-4 text-xs font-bold hover:bg-[#4338ca] dark:hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer border-none select-none"
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
          className="absolute bottom-20 right-3 bg-white dark:bg-zinc-800 text-[#18181b] dark:text-zinc-200 border border-solid border-[#cbd5e1] dark:border-zinc-700 rounded-full py-2 px-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-center cursor-pointer transition-all duration-150 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:-translate-y-0.5 z-10"
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

      {/* 입력창 */}
      <form
        onSubmit={onSendMessage}
        className="p-2.5 px-5 bg-transparent dark:bg-transparent border-t border-solid border-[#f4f4f5] dark:border-zinc-800"
      >
        <div className="flex items-center bg-transparent dark:bg-transparent rounded-md px-3.5 gap-3 h-9 transition-colors duration-150 border border-solid border-[#cbd5e1] dark:border-zinc-800 focus-within:border-black dark:focus-within:border-zinc-500">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={
              companyName === "새 문서"
                ? "분석할 기업명을 입력하세요..."
                : "추가 질문을 입력하세요..."
            }
            className="flex-1 border-none bg-transparent outline-none text-sm text-[#18181b] dark:text-[#f4f4f5] font-sans"
          />
          <button
            type="submit"
            title="전송"
            className="border-none bg-transparent text-[#18181b] dark:text-[#f4f4f5] cursor-pointer flex items-center justify-center h-7 w-7 rounded-full bg-[#f4f4f5] dark:bg-transparent transition-colors duration-150 hover:bg-[#e4e4e7] dark:hover:bg-transparent shrink-0"
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
