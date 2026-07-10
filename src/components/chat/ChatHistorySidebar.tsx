import React, { useState, useEffect } from "react";
import ConfirmModal from "../common/ConfirmModal";
import {
  fetchChatSessions,
  updateSessionPin,
  deleteChatSession
} from "../../services/chatApi";

import { type ChatSession } from "../../types/index";

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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSessions();
    } else {
      setActiveMenuId(null);
    }
  }, [isOpen]);

  const fetchSessions = async () => {
    try {
      const data = await fetchChatSessions();
      setSessions(data.sessions || []);
    } catch (err: any) {
      console.error("fetchSessions failed:", err);
    }
  };

  const togglePin = async (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();

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
      await updateSessionPin(sessionId, endpoint);
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

  const handleDeleteSession = (
    sessionId: string,
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setDeletingSessionId(sessionId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSessionId) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === deletingSessionId ? { ...s, isDeleting: true } : s
      )
    );
    setIsDeleteModalOpen(false);

    try {
      await deleteChatSession(deletingSessionId);
      setTimeout(() => {
        setSessions((prev) => prev.filter((s) => s.sessionId !== deletingSessionId));
        if (activeSessionId === deletingSessionId) {
          onSelectHistory("New", "새 문서");
        }
        setDeletingSessionId(null);
      }, 300);
    } catch (err) {
      console.error("세션 삭제 실패:", err);
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === deletingSessionId ? { ...s, isDeleting: false } : s
        )
      );
      setDeletingSessionId(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setDeletingSessionId(null);
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
          borderRight: isOpen ? "1px solid var(--border)" : "none",
          boxShadow: isOpen ? "4px 0 24px rgba(0, 0, 0, 0.08)" : "none",
          background: "var(--bg)"
        }}
        className="fixed top-0 left-0 h-screen transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-[1000] box-border font-sans overflow-hidden"
      >
        {/* 헤더 및 닫기 버튼 */}
        <div className="p-3.5 px-4 flex justify-between items-center whitespace-nowrap">
          <span 
            className="text-lg font-black tracking-tight select-none"
            style={{ color: "var(--text-h)", fontFamily: '"Nunito", sans-serif' }}
          >
            DARTIN
          </span>
        </div>

        {/* 새 대화 버튼 */}
        <div className="p-3 pt-0 whitespace-nowrap">
          <button
            onClick={() => {
              onSelectHistory("New", "새 문서");
              onClose();
            }}
            className="flex items-center justify-center gap-1 w-full border border-solid rounded-full text-xs py-1.5 cursor-pointer transition-all duration-200 font-bold"
            style={{
              background: "var(--bg-panel)",
              borderColor: "var(--border)",
              color: "var(--text-h)"
            }}
          >
            <span>+ 새 채팅</span>
          </button>
        </div>

        {/* 구분선 */}
        <div 
          className="mx-3 mb-2.5 border-t border-solid" 
          style={{ borderTopColor: "var(--border)" }}
        />

        {/* 히스토리 목록 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-2 flex flex-col">
          {sortedSessions.length === 0 ? (
            <div className="text-xs py-4 text-center" style={{ color: "var(--text)" }}>
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
                  className="pl-3 mb-1.5 h-8 rounded-md cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex items-center justify-between gap-1.5 relative border-l-[3px] border-solid box-border text-sm"
                  style={{
                    backgroundColor: isActive ? "var(--bg-hover)" : isHovered ? "var(--bg-hover)" : "transparent",
                    borderLeftColor: isActive ? "var(--text-h)" : isHovered ? "var(--border)" : "transparent",
                    color: isActive ? "var(--text-h)" : "var(--text)",
                    fontWeight: isActive ? "600" : "400",
                    opacity: item.isDeleting ? 0 : 1,
                    transform: item.isDeleting ? "translateX(-20px)" : "translateX(0)",
                    height: item.isDeleting ? "0px" : "32px",
                    marginBottom: item.isDeleting ? "0px" : "6px",
                    overflow: item.isDeleting ? "hidden" : "visible",
                    zIndex: activeMenuId === item.sessionId ? 50 : 1
                  }}
                >
                  <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                    {item.companyName}
                  </span>

                  <div
                    className="flex items-center gap-1.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isHovered || activeMenuId === item.sessionId ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === item.sessionId
                              ? null
                              : item.sessionId,
                          );
                        }}
                        className="border-none cursor-pointer flex items-center justify-center h-6 w-6 rounded-md text-sm transition-all duration-150 hover:bg-[var(--bg-hover)]"
                        style={{ 
                          color: activeMenuId === item.sessionId ? "var(--text-h)" : "var(--text)", 
                          backgroundColor: activeMenuId === item.sessionId ? "var(--bg-hover)" : "transparent" 
                        }}
                      >
                        ⋮
                      </button>
                    ) : (
                      isPinned && (
                        <svg
                          viewBox="0 0 24 24"
                          width="12"
                          height="12"
                          fill="var(--text)"
                          className="shrink-0 mr-3"
                        >
                          <path d="M16 12V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v8l-2 2v2h5.2v6l1.3 1.3L13.8 18v-2H19v-2l-2-2z" />
                        </svg>
                      )
                    )}
                  </div>

                  {/* 드롭다운 메뉴 */}
                  {activeMenuId === item.sessionId && (
                    <div 
                      className="absolute right-3 top-7 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md p-1 z-[1010] w-[100px] border border-solid flex flex-col gap-0.5"
                      style={{ background: "var(--bg-panel)", borderColor: "var(--border)" }}
                    >
                      <button
                        onClick={(e) => {
                          togglePin(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-semibold cursor-pointer transition-colors duration-150 hover:bg-[var(--bg-hover)]"
                        style={{ color: "var(--text-h)" }}
                      >
                        {isPinned ? "고정 해제" : "고정"}
                      </button>
                      <button
                        onClick={(e) => {
                          handleDeleteSession(item.sessionId, e);
                          setActiveMenuId(null);
                        }}
                        className="w-full text-left py-1.5 px-2 bg-transparent border-none rounded text-xs font-semibold text-[#ef4444] cursor-pointer transition-colors duration-150 hover:bg-red-500/10"
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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="대화 삭제"
        message="이 대화 내역을 정말 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default ChatHistorySidebar;
