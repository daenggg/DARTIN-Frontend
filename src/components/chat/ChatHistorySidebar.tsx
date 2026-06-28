import React, { useState, useEffect } from "react";
import axios from "axios";

interface SessionSummary {
  sessionId: string;
  companyName: string;
  updatedAt: string;
}

interface ChatHistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectHistory: (sessionId: string, companyName: string) => void;
  activeSessionId?: string;
}

const ChatHistorySidebar: React.FC<ChatHistorySidebarProps> = ({
  isOpen,
  onClose,
  onSelectHistory,
  activeSessionId,
}) => {
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const fetchSessions = async () => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/sessions`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      if (res.data?.sessions) {
        setSessions(res.data.sessions);
      }
    } catch (err) {
      console.error("Failed to load sessions:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleCloseMenu = () => setActiveMenuId(null);
    document.addEventListener("click", handleCloseMenu);
    return () => document.removeEventListener("click", handleCloseMenu);
  }, []);

  const togglePin = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPinnedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/sessions/${id}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" }
      });
      // 리스트 갱신
      setSessions(prev => prev.filter(s => s.sessionId !== id));
      if (activeSessionId === id) {
        onSelectHistory("New", "새 문서");
      }
      alert("분석 세션이 삭제되었습니다.");
    } catch (err) {
      console.error("Failed to delete session:", err);
      alert("세션 삭제 도중 에러가 발생했습니다.");
    }
  };

  const handleItemClick = (id: string, companyName: string) => {
    onSelectHistory(id, companyName);
    onClose();
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

  const sortedSessions = [...sessions].sort((a, b) => {
    const aPinned = pinnedIds.includes(a.sessionId);
    const bPinned = pinnedIds.includes(b.sessionId);

    if (aPinned && !bPinned) return -1;
    if (!aPinned && bPinned) return 1;

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      {/* 백드롭 레이어 */}
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
          zIndex: 1000,
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

        {/* 새 대화 버튼 */}
        <div style={{ padding: "0 16px 16px 16px", whiteSpace: "nowrap" }}>
          <button
            onClick={() => {
              onSelectHistory("New", "새 문서");
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
          {sortedSessions.length === 0 ? (
            <div style={{ fontSize: "11px", color: "#a1a1aa", padding: "24px 0", textAlign: "center" }}>
              분석 이력이 존재하지 않습니다.
            </div>
          ) : (
            sortedSessions.map((item) => {
              const isPinned = pinnedIds.includes(item.sessionId);
              const isActive = activeSessionId === item.sessionId;
              const isHovered = hoveredId === item.sessionId;

              return (
                <div
                  key={item.sessionId}
                  onClick={() => handleItemClick(item.sessionId, item.companyName)}
                  onMouseEnter={() => setHoveredId(item.sessionId)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "6px",
                    backgroundColor: isActive ? "#f4f4f5" : "transparent",
                    borderLeft: isActive ? "3px solid #18181b" : "3px solid transparent",
                    paddingLeft: isActive ? "9px" : "12px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
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
                      e.currentTarget.style.borderLeftColor = "#e4e4e7";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#71717a";
                      e.currentTarget.style.borderLeftColor = "transparent";
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
                    {item.companyName}
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }} onClick={(e) => e.stopPropagation()}>
                    {isHovered ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === item.sessionId ? null : item.sessionId);
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

                  {/* 드롭다운 메뉴 */}
                  {activeMenuId === item.sessionId && (
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
                          togglePin(item.sessionId, e);
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
                          handleDeleteSession(item.sessionId, e);
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
            })
          )}
        </div>
      </aside>
    </>
  );
};

export default ChatHistorySidebar;
