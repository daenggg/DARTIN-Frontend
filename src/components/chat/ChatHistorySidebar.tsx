import React, { useState, useEffect } from "react";
import axios from "axios";

interface ChatSession {
  sessionId: string;
  companyName: string;
  updatedAt: string;
  isPinned: boolean;
  pinnedAt?: string | null;
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
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    try {
      const res = await axios.get(`${BACKEND_URL}/api/chat/sessions`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setSessions(res.data.sessions || []);
    } catch (err: any) {
      console.error("fetchSessions failed:", err);
    }
  };

  const togglePin = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

    const session = sessions.find((s) => s.sessionId === sessionId);
    if (!session) return;

    const isCurrentlyPinned = session.isPinned;
    const endpoint = isCurrentlyPinned ? "unpin" : "pin";

    // UI 낙관적 업데이트 수행 (Optimistic Update)
    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === sessionId
          ? {
              ...s,
              isPinned: !isCurrentlyPinned,
              pinnedAt: !isCurrentlyPinned ? new Date().toISOString() : null,
            }
          : s
      )
    );

    try {
      await axios.patch(
        `${BACKEND_URL}/api/chat/sessions/${sessionId}/${endpoint}`,
        {},
        {
          headers: { Authorization: token ? `Bearer ${token}` : "" },
        }
      );
      console.log(`[Debug Frontend] ${endpoint} success for session:`, sessionId);
    } catch (err) {
      console.error(`Failed to ${endpoint} session:`, err);
      // 에러 발생 시 원래 상태로 복원
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId
            ? { ...s, isPinned: isCurrentlyPinned }
            : s
        )
      );
    }
  };

  const handleDeleteSession = async (
    sessionId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    if (!window.confirm("이 대화 내역을 삭제하시겠습니까?")) return;

    const token = sessionStorage.getItem("accessToken");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";
    try {
      await axios.delete(`${BACKEND_URL}/api/chat/sessions/${sessionId}`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      setSessions((prev) => prev.filter((s) => s.sessionId !== sessionId));
      if (activeSessionId === sessionId) {
        onSelectHistory("New", "새 문서");
      }
    } catch (err) {
      console.error("세션 삭제 실패:", err);
    }
  };

  const handleItemClick = (sessionId: string, companyName: string) => {
    onSelectHistory(sessionId, companyName);
    onClose();
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    const aPinned = a.isPinned ? 1 : 0;
    const bPinned = b.isPinned ? 1 : 0;
    if (aPinned !== bPinned) return bPinned - aPinned;

    // 만약 둘 다 핀 고정된 상태라면, 고정된 시간(pinnedAt) 기준 최신순 정렬
    if (a.isPinned && b.isPinned && a.pinnedAt && b.pinnedAt) {
      return new Date(b.pinnedAt).getTime() - new Date(a.pinnedAt).getTime();
    }

    // 그 외에는 마지막 수정 시간(updatedAt) 기준 최신순 정렬
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-[990] transition-opacity duration-200"
        />
      )}

      <aside
        style={{
          width: "260px",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          borderRight: isOpen ? "1px solid #cbd5e1" : "none",
          boxShadow: isOpen ? "4px 0 24px rgba(0, 0, 0, 0.08)" : "none",
        }}
        className="fixed top-0 left-0 h-screen bg-white dark:bg-[#121318] dark:border-r dark:border-zinc-800 transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-[1000] box-border font-sans overflow-hidden"
      >
        {/* 헤더 및 닫기 버튼 */}
        <div className="p-5 px-6 flex justify-between items-center whitespace-nowrap">
          <span 
            className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 select-none"
            style={{ fontFamily: '"Nunito", sans-serif' }}
          >
            DARTIN
          </span>
        </div>

        {/* 새 대화 버튼 */}
        <div className="p-4 pt-0 whitespace-nowrap">
          <button
            onClick={() => {
              onSelectHistory("New", "새 문서");
              onClose();
            }}
            className="flex items-center justify-center gap-1 w-full bg-[#f0f4f9] dark:bg-zinc-800 border border-solid border-[#cbd5e1] dark:border-zinc-700 rounded-full text-[#1f1f1f] dark:text-zinc-100 text-md cursor-pointer transition-all duration-200 hover:bg-[#e3e3e3] dark:hover:bg-zinc-700"
          >
            <span>+ 새 채팅</span>
          </button>
        </div>

        {/* 구분선 */}
        <div className="mx-4 mb-3 border-t border-solid border-[#e4e4e7] dark:border-zinc-800" />

        {/* 히스토리 목록 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-3 flex flex-col">
          {sortedSessions.length === 0 ? (
            <div className="text-xs text-[#a1a1aa] py-6 text-center">
              분석 이력이 존재하지 않습니다.
            </div>
          ) : (
            sortedSessions.map((item) => {
              const isPinned = item.isPinned;
              const isActive = activeSessionId === item.sessionId;
              const isHovered = hoveredId === item.sessionId;

              return (
                <div
                  key={item.sessionId}
                  onClick={() =>
                    handleItemClick(item.sessionId, item.companyName)
                  }
                  onMouseEnter={() => setHoveredId(item.sessionId)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`pl-3 mb-1.5 h-6 rounded-md cursor-pointer transition-all duration-150 flex items-center justify-between gap-1.5 relative border-l-[3px] border-solid box-border text-sm ${
                    isActive
                      ? "bg-[#f4f4f5] dark:bg-zinc-800 border-l-[#18181b] dark:border-l-zinc-100 text-[#18181b] dark:text-[#f4f4f5] font-semibold"
                      : "border-l-transparent text-[#71717a] dark:text-zinc-400 font-normal hover:bg-[#fafafa] dark:hover:bg-zinc-900/50 hover:text-[#18181b] dark:hover:text-zinc-50 hover:border-l-[#e4e4e7] dark:hover:border-l-zinc-700"
                  }`}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                    {item.companyName}
                  </span>

                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isHovered ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === item.sessionId
                              ? null
                              : item.sessionId,
                          );
                        }}
                        className="bg-transparent border-none cursor-pointer flex items-center justify-center h-6 w-6 rounded text-sm text-[#71717a] dark:text-zinc-400 transition-all duration-150 hover:bg-[#e4e4e7] dark:hover:bg-zinc-800 hover:text-[#18181b] dark:hover:text-zinc-50"
                      >
                        ⋮
                      </button>
                    ) : (
                      isPinned && (
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="#71717a"
                          className="shrink-0 mr-3"
                        >
                          <path d="M16 12V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v8l-2 2v2h5.2v6l1.3 1.3L13.8 18v-2H19v-2l-2-2z" />
                        </svg>
                      )
                    )}
                  </div>

                  {/* 드롭다운 메뉴 */}
                  {activeMenuId === item.sessionId && (
                    <div className="absolute right-3 top-7 bg-white dark:bg-zinc-900 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md p-1 z-[1010] w-[100px] border border-solid border-[#e4e4e7] dark:border-zinc-800 flex flex-col gap-0.5">
                      <button
                        onClick={(e) => {
                          togglePin(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-normal text-[#18181b] dark:text-zinc-200 cursor-pointer transition-colors duration-150 hover:bg-[#f4f4f5] dark:hover:bg-zinc-800"
                      >
                        {isPinned ? "고정 해제" : "고정"}
                      </button>
                      <button
                        onClick={(e) => {
                          handleDeleteSession(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-normal text-[#ef4444] cursor-pointer transition-colors duration-150 hover:bg-red-50 dark:hover:bg-red-950/30"
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
