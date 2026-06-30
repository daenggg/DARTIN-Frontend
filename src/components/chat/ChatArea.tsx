import React, { useState, useRef, useEffect } from "react";
import { MarkdownRenderer } from "../common/MarkdownRenderer";

interface Message {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
  isStatus?: boolean;
  candidates?: Array<{ corp_name: string; corp_code: string }>;
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="w-full bg-white flex flex-col h-full box-border font-sans">
      {/* 챗 상단 간결한 토글 트리거 영역 */}
      <div className="h-14 px-5 border-b border-solid border-[#e2e8f0] flex items-center justify-between bg-white shrink-0 box-border">
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "최근 대화 닫기" : "최근 대화 열기"}
          className="border border-solid border-[#e4e4e7] rounded-md p-1.5 px-2 cursor-pointer bg-white text-[#71717a] transition-all duration-150 flex items-center justify-center h-8 hover:bg-[#f4f4f5] hover:text-[#18181b]"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
        </button>
      </div>

      {/* 대화 피드 */}
      <div className="custom-scrollbar flex-1 p-6 px-5 overflow-y-auto flex flex-col gap-6 bg-white">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "user" ? (
              <div className="max-w-[85%] py-2.5 px-4 rounded-xl bg-[#f4f4f5] text-[#18181b] text-md leading-relaxed text-left">
                {msg.text}
              </div>
            ) : (
              <div className="flex gap-3 max-w-[90%] flex-col">
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded bg-[#18181b] flex items-center justify-center text-white text-xs font-semibold shrink-0">
                    AI
                  </div>
                  <div className="text-[#18181b] text-md leading-relaxed pt-1 whitespace-pre-wrap text-left flex-1">
                    <style>{`
                      @keyframes wordWave {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                      }
                    `}</style>
                    {msg.isStatus ? (
                      <div className="inline-flex flex-wrap text-[#71717a] font-medium">
                        {msg.text.split("").map((char, index) => (
                          <span
                            key={index}
                            style={{
                              display: "inline-block",
                              animation: "wordWave 1.4s infinite ease-in-out",
                              animationDelay: `${index * 0.06}s`,
                              whiteSpace: char === " " ? "pre" : "normal"
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

                {/* 기업 후보군 카드식 알약 버튼 렌더링 */}
                {msg.candidates && msg.candidates.length > 0 && (
                  <div className="flex flex-wrap gap-2 ml-10 mt-1">
                    {msg.candidates.map((cand, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCandidate(cand.corp_code, cand.corp_name)}
                        className="flex items-center gap-1.5 bg-white border border-solid border-[#cbd5e1] rounded-full py-1.5 px-3.5 text-sm text-[#4f46e5] font-semibold cursor-pointer transition-all duration-150 shadow-[0_1px_2px_rgba(0,0,0,0.02)] hover:bg-[#f5f3ff] hover:border-[#818cf8]"
                      >
                        🏢 {cand.corp_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* 입력창 */}
      <form
        onSubmit={onSendMessage}
        className="p-4 px-5 bg-white border-t border-solid border-[#f4f4f5]"
      >
        <div className="flex items-center bg-white rounded-md p-2 px-3.5 gap-3 transition-colors duration-150 border border-solid border-[#cbd5e1] focus-within:border-black">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={companyName === "새 문서" ? "분석할 기업명을 입력하세요..." : "추가 질문을 입력하세요..."}
            className="flex-1 border-none bg-transparent outline-none text-md text-[#18181b] font-sans"
          />
          <button
            type="submit"
            title="전송"
            className="border-none bg-transparent text-[#18181b] cursor-pointer flex items-center justify-center p-1.5 rounded bg-[#f4f4f5] transition-colors duration-150 hover:bg-[#e4e4e7]"
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
