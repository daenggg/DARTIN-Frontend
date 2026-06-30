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
          className="fixed top-0 left-0 w-screen h-screen bg-black/5 z-[999]"
        />
      )}

      <aside
        style={{
          width: isOpen ? "280px" : "0px",
          opacity: isOpen ? 1 : 0,
          borderRight: isOpen ? "1px solid #cbd5e1" : "none",
          boxShadow: isOpen ? "4px 0 24px rgba(0, 0, 0, 0.08)" : "none",
        }}
        className="fixed top-0 left-0 h-screen bg-white transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-[1000] box-border font-sans overflow-hidden"
      >
        {/* 헤더 및 닫기 버튼 */}
        <div className="p-5 px-6 flex justify-between items-center whitespace-nowrap">
          <span className="font-bold text-lg text-[#1f1f1f]">
            최근 분석 목록
          </span>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-[#5f6368] cursor-pointer text-xl font-bold p-1 px-2 rounded-full transition-colors duration-200 hover:bg-[#f0f4f9]"
          >
            ✕
          </button>
        </div>

        {/* 새 대화 버튼 */}
        <div className="p-4 pt-0 whitespace-nowrap">
          <button
            onClick={() => {
              onSelectHistory("New", "새 문서");
              onClose();
            }}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#f0f4f9] border border-solid border-[#cbd5e1] rounded-full text-[#1f1f1f] font-semibold text-md cursor-pointer transition-all duration-200 hover:bg-[#e3e3e3]"
          >
            <span>+</span> 새 분석 요청
          </button>
        </div>

        {/* 히스토리 목록 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 pb-4 flex flex-col gap-0.5">
          {sortedSessions.length === 0 ? (
            <div className="text-xs text-[#a1a1aa] py-6 text-center">
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
                  className={`p-2 px-3 rounded-md cursor-pointer transition-all duration-150 flex items-center justify-between gap-1.5 relative border-l-[3px] border-solid ${
                    isActive
                      ? "bg-[#f4f4f5] border-l-[#18181b] text-[#18181b] font-semibold pl-2.5"
                      : "border-l-transparent text-[#71717a] font-normal hover:bg-[#fafafa] hover:text-[#18181b] hover:border-l-[#e4e4e7]"
                  }`}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                    {item.companyName}
                  </span>

                  <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                    {isHovered ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(activeMenuId === item.sessionId ? null : item.sessionId);
                        }}
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center py-0.5 px-1.5 rounded text-sm text-[#71717a] transition-all duration-150 hover:bg-[#e4e4e7] hover:text-[#18181b]"
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
                          className="shrink-0"
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
                    <div className="absolute right-3 top-7 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md p-1 z-[1010] w-[100px] border border-solid border-[#e4e4e7] flex flex-col gap-0.5">
                      <button
                        onClick={(e) => {
                          togglePin(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-normal text-[#18181b] cursor-pointer transition-colors duration-150 hover:bg-[#f4f4f5]"
                      >
                        {isPinned ? "고정 해제" : "고정"}
                      </button>
                      <button
                        onClick={(e) => {
                          handleDeleteSession(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-normal text-[#ef4444] cursor-pointer transition-colors duration-150 hover:bg-red-50"
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
