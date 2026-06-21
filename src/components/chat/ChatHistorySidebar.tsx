import React, { useState, useEffect } from "react";

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (company: string) => void;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onClose,
  onSelectHistory,
}) => {
  const [pinnedIds, setPinnedIds] = useState<number[]>([1, 2]); // SK하이닉스, 삼성전자 고정 예시
  const [activeItem, setActiveItem] = useState<string>("SK하이닉스");
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const histories = [
    { id: 1, company: "SK하이닉스", isPinned: true },
    { id: 2, company: "삼성전자", isPinned: true },
    { id: 3, company: "현대자동차", isPinned: false },
    { id: 4, company: "네이버 주식회사", isPinned: false },
    { id: 5, company: "카카오 공동체 채용공고 분석", isPinned: false },
  ];

  useEffect(() => {
    const handleCloseMenu = () => setActiveMenuId(null);
    document.addEventListener("click", handleCloseMenu);
    return () => document.removeEventListener("click", handleCloseMenu);
  }, []);

  const togglePin = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleItemClick = (company: string) => {
    setActiveItem(company);
    onSelectHistory(company);
    onClose(); // 오버레이 레이아웃이므로 선택 시 사이드바 닫아주기
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: "6px 8px",
    border: "none",
    backgroundColor: "transparent",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "11px",
    fontWeight: "400",
    color: "#18181b",
    textAlign: "left",
    width: "100%",
    transition: "background-color 0.15s",
  };

  return (
    <>
      {/* 백드롭 레이어: 전체화면을 다 덮음 */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.05)",
            zIndex: 999,
          }}
        />
      )}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isOpen ? "280px" : "0px",
          opacity: isOpen ? 1 : 0,
          overflow: "hidden",
          height: "100vh",
          backgroundColor: "#ffffff",
          borderRight: isOpen ? "1px solid #cbd5e1" : "none",
          transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          zIndex: 1000, // 가장 우선 순위가 높은 레이어 설정
          boxSizing: "border-box",
          fontFamily: "'Inter', sans-serif",
          boxShadow: isOpen ? "4px 0 24px rgba(0, 0, 0, 0.08)" : "none",
        }}
      >
        {/* 헤더 및 닫기 버튼 */}
        <div
          style={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontWeight: "700", fontSize: "15px", color: "#1f1f1f" }}>
            최근 분석 목록
          </span>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: "#5f6368",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
              padding: "4px 8px",
              borderRadius: "50%",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f0f4f9")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            ✕
          </button>
        </div>

        {/* 새 대화 버튼 (깔끔한 그레이 아웃라인 알약형 버튼) */}
        <div style={{ padding: "0 16px 16px 16px", whiteSpace: "nowrap" }}>
          <button
            onClick={() => {
              onSelectHistory("New");
              onClose();
            }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              width: "100%",
              padding: "10px 0",
              backgroundColor: "#f0f4f9",
              border: "1px solid #cbd5e1",
              borderRadius: "100px",
              color: "#1f1f1f",
              fontWeight: "600",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#e3e3e3")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#f0f4f9")}
          >
            <span>+</span> 새 분석 요청
          </button>
        </div>

        {/* 히스토리 목록 */}
        <div
          className="custom-scrollbar"
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "0 12px 16px 12px",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {histories.map((item) => {
            const isPinned = pinnedIds.includes(item.id);
            const isActive = activeItem === item.company;
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.company)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  padding: "6px 12px",
                  borderRadius: "6px",
                  backgroundColor: isActive ? "#f4f4f5" : "transparent",
                  cursor: "pointer",
                  transition: "all 0.1s ease",
                  whiteSpace: "nowrap",
                  fontSize: "12px",
                  fontWeight: isActive ? "600" : "400",
                  color: isActive ? "#18181b" : "#71717a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "6px",
                  position: "relative",
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#fafafa";
                    e.currentTarget.style.color = "#18181b";
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent";
                    e.currentTarget.style.color = "#71717a";
                  }
                }}
              >
                <span
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    flex: 1,
                    textAlign: "left"
                  }}
                >
                  {item.company}
                </span>

                <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                  {isHovered ? (
                    /* 호버 시 나타나는 점 세개 버튼 */
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === item.id ? null : item.id);
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "2px 4px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "#71717a",
                        transition: "all 0.15s ease",
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = "#e4e4e7";
                        e.currentTarget.style.color = "#18181b";
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#71717a";
                      }}
                    >
                      ⋮
                    </button>
                  ) : (
                    /* 고정 핀 표시 (고정 상태이면서 호버되지 않았을 때만 노출) */
                    isPinned && (
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="#18181b"
                        stroke="#71717a"
                        strokeWidth="2"
                        style={{ flexShrink: 0 }}
                      >
                        <line x1="18" y1="8" x2="22" y2="12"></line>
                        <line x1="12" y1="2" x2="22" y2="12"></line>
                        <path d="M12 2L2 12h5l9 9v-5z"></path>
                      </svg>
                    )
                  )}
                </div>

                {/* 드롭다운 메뉴 (Dropbox) */}
                {activeMenuId === item.id && (
                  <div
                    style={{
                      position: "absolute",
                      right: "12px",
                      top: "28px",
                      backgroundColor: "#ffffff",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
                      borderRadius: "6px",
                      padding: "4px",
                      zIndex: 1010,
                      width: "100px",
                      border: "1px solid #e4e4e7",
                      display: "flex",
                      flexDirection: "column",
                      gap: "2px",
                    }}
                  >
                    <button
                      onClick={(e) => {
                        togglePin(item.id, e);
                        setActiveMenuId(null);
                      }}
                      style={dropdownItemStyle}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      {isPinned ? "고정 해제" : "고정"}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("이름 변경 창이 열립니다.");
                        setActiveMenuId(null);
                      }}
                      style={dropdownItemStyle}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f4f4f5")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      이름 변경
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("삭제되었습니다.");
                        setActiveMenuId(null);
                      }}
                      style={{ ...dropdownItemStyle, color: "#ef4444" }}
                      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#fee2e2")}
                      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
