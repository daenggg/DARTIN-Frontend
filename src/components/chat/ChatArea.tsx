import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
  isStreaming?: boolean;
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

  // 대화 추가 시 자동 스크롤 하단 고정
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section
      style={{
        width: "100%",
        backgroundColor: "#ffffff",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* 챗 상단 간결한 토글 트리거 영역 */}
      <div
        style={{
          height: "56px",
          padding: "0 20px",
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "#ffffff",
          boxSizing: "border-box",
          flexShrink: 0,
        }}
      >
        <button
          onClick={onToggleSidebar}
          title={isSidebarOpen ? "최근 대화 닫기" : "최근 대화 열기"}
          style={{
            border: "1px solid #e4e4e7",
            borderRadius: "6px",
            padding: "6px 8px",
            cursor: "pointer",
            backgroundColor: "#ffffff",
            color: "#71717a",
            transition: "all 0.15s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "32px",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "#f4f4f5";
            e.currentTarget.style.color = "#18181b";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "#ffffff";
            e.currentTarget.style.color = "#71717a";
          }}
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
      <div
        className="custom-scrollbar"
        style={{
          flex: 1,
          padding: "24px 20px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          backgroundColor: "#ffffff",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
              width: "100%",
            }}
          >
            {msg.sender === "user" ? (
              <div
                style={{
                  maxWidth: "85%",
                  padding: "10px 16px",
                  borderRadius: "12px",
                  backgroundColor: "#f4f4f5",
                  color: "#18181b",
                  fontSize: "13px",
                  lineHeight: "1.6",
                  textAlign: "left",
                }}
              >
                {msg.text}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px", maxWidth: "90%", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "12px" }}>
                  <div
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      backgroundColor: "#18181b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: "600",
                      flexShrink: 0,
                    }}
                  >
                    AI
                  </div>
                  <div
                    style={{
                      color: "#18181b",
                      fontSize: "13px",
                      lineHeight: "1.6",
                      paddingTop: "4px",
                      whiteSpace: "pre-wrap",
                      textAlign: "left",
                    }}
                  >
                    <style>{`
                      @keyframes wordWave {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-4px); }
                      }
                    `}</style>
                    {msg.isStatus ? (
                      <div style={{ display: "inline-flex", flexWrap: "wrap", color: "#71717a", fontWeight: "500" }}>
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
                      msg.text
                    )}
                  </div>
                </div>

                {/* 기업 후보군 카드식 알약 버튼 렌더링 */}
                {msg.candidates && msg.candidates.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "8px",
                      marginLeft: "40px",
                      marginTop: "4px",
                    }}
                  >
                    {msg.candidates.map((cand, idx) => (
                      <button
                        key={idx}
                        onClick={() => onSelectCandidate(cand.corp_code, cand.corp_name)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          backgroundColor: "#ffffff",
                          border: "1px solid #cbd5e1",
                          borderRadius: "100px",
                          padding: "6px 14px",
                          fontSize: "12px",
                          color: "#4f46e5",
                          fontWeight: "600",
                          cursor: "pointer",
                          transition: "all 0.15s ease",
                          boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.backgroundColor = "#f5f3ff";
                          e.currentTarget.style.borderColor = "#818cf8";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.borderColor = "#cbd5e1";
                        }}
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
        style={{
          padding: "16px 20px",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #f4f4f5",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            backgroundColor: "#ffffff",
            borderRadius: "6px",
            padding: "8px 14px",
            gap: "12px",
            transition: "all 0.15s ease",
            border: "1px solid #cbd5e1",
          }}
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            placeholder={companyName === "새 문서" ? "분석할 기업명을 입력하세요..." : "추가 질문을 입력하세요..."}
            style={{
              flex: 1,
              border: "none",
              backgroundColor: "transparent",
              outline: "none",
              fontSize: "13px",
              color: "#18181b",
              fontFamily: "'Inter', sans-serif",
            }}
          />
          <button
            type="submit"
            title="전송"
            style={{
              border: "none",
              background: "none",
              color: "#18181b",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              borderRadius: "4px",
              backgroundColor: "#f4f4f5",
              transition: "all 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e4e4e7")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
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
