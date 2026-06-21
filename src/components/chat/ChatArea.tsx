import React, { useState, useRef, useEffect } from "react";

interface Message {
  sender: "user" | "ai";
  text: string;
}

interface ChatAreaProps {
  messages: Message[];
  inputValue: string;
  onInputChange: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  companyName: string;
}

const ChatArea: React.FC<ChatAreaProps> = ({
  messages,
  inputValue,
  onInputChange,
  onSendMessage,
  isSidebarOpen,
  onToggleSidebar,
  companyName,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

        {/* 우측 3점 메뉴 */}
        <div ref={menuRef} style={{ position: "relative", display: "inline-block" }}>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              background: "none",
              border: "none",
              fontSize: "18px",
              color: "#71717a",
              cursor: "pointer",
              padding: "0 8px",
              borderRadius: "6px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "28px",
              transition: "background-color 0.15s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ⋮
          </button>

          {isMenuOpen && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "32px",
                backgroundColor: "#ffffff",
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                borderRadius: "8px",
                padding: "6px",
                zIndex: 100,
                width: "140px",
                border: "1px solid #e4e4e7",
                display: "flex",
                flexDirection: "column",
                gap: "2px",
              }}
            >
              {[
                { label: "대화 공유", action: () => alert("대화가 공유되었습니다.") },
                { label: "고정", action: () => alert(`${companyName} 대화가 고정되었습니다.`) },
                { label: "이름 변경", action: () => alert("이름 변경 창이 열립니다.") },
                { label: "노트북에 추가", action: () => alert("노트북에 추가되었습니다.") },
                { label: "삭제", action: () => alert("삭제되었습니다."), color: "#ef4444" },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    item.action();
                    setIsMenuOpen(false);
                  }}
                  style={{
                    padding: "8px 12px",
                    border: "none",
                    backgroundColor: "transparent",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: "400",
                    color: item.color || "#18181b",
                    textAlign: "left",
                    transition: "background-color 0.15s",
                    width: "100%",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
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
                }}
              >
                {msg.text}
              </div>
            ) : (
              <div style={{ display: "flex", gap: "12px", maxWidth: "90%" }}>
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
                  }}
                >
                  {msg.text}
                </div>
              </div>
            )}
          </div>
        ))}
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
            placeholder="질문을 입력하세요..."
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
