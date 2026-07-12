import React, { useState, useEffect } from "react";
import ConfirmModal from "../common/ConfirmModal";
import {
  fetchChatSessions,
  updateSessionPin,
  deleteChatSession,
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
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null,
  );
  const [menuDirections, setMenuDirections] = useState<
    Record<string, "up" | "down">
  >({});

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
          : s,
      ),
    );

    try {
      await updateSessionPin(sessionId, endpoint);
      console.log(
        `[Debug Frontend] ${endpoint} success for session:`,
        sessionId,
      );
    } catch (err) {
      console.error(`Failed to ${endpoint} session:`, err);
      // 에러 발생 시 원래 상태로 복원
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === sessionId ? { ...s, isPinned: isCurrentlyPinned } : s,
        ),
      );
    }
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingSessionId(sessionId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingSessionId) return;

    setSessions((prev) =>
      prev.map((s) =>
        s.sessionId === deletingSessionId ? { ...s, isDeleting: true } : s,
      ),
    );
    setIsDeleteModalOpen(false);

    try {
      await deleteChatSession(deletingSessionId);
      setTimeout(() => {
        setSessions((prev) =>
          prev.filter((s) => s.sessionId !== deletingSessionId),
        );
        if (activeSessionId === deletingSessionId) {
          onSelectHistory("New", "새 문서");
        }
        setDeletingSessionId(null);
      }, 300);
    } catch (err) {
      console.error("세션 삭제 실패:", err);
      setSessions((prev) =>
        prev.map((s) =>
          s.sessionId === deletingSessionId ? { ...s, isDeleting: false } : s,
        ),
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
          background: "linear-gradient(to bottom, var(--bg-panel) 0%, var(--bg) 220px)",
        }}
        className="fixed top-0 left-0 h-screen transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col z-[1000] box-border font-sans overflow-hidden"
      >
        {/* 헤더 및 닫기 버튼 (구분선을 완전히 지우고 투명화) */}
        <div
          className="pt-4 px-4 pb-1 flex justify-between items-center whitespace-nowrap"
          style={{
            background: "transparent",
          }}
        >
          <div className="flex items-center">
            <span
              className="text-md font-black tracking-tight select-none"
              style={{
                color: "var(--text-h)",
                fontFamily: '"Outfit", "Nunito", sans-serif',
              }}
            >
              DARTIN
            </span>
          </div>
          {/* 모바일 환경 대응 닫기 버튼 */}
          <button
            onClick={onClose}
            className="md:hidden border-none bg-transparent cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 text-lg flex items-center justify-center p-1"
          >
            &times;
          </button>
        </div>

        {/* 새 대화 버튼 */}
        <div className="pb-3.5 px-3.5 pt-1.5 whitespace-nowrap">
          <button
            onClick={() => {
              onSelectHistory("New", "새 문서");
              onClose();
            }}
            className="flex items-center justify-center gap-1.5 w-full border-none rounded-xl text-xs py-1.5 cursor-pointer transition-all duration-200 font-extrabold shadow-[0_4px_12px_rgba(212,84,61,0.15)] active:scale-[0.98] text-white hover:brightness-105 hover:shadow-[0_6px_16px_rgba(212,84,61,0.22)]"
            style={{
              background: "var(--accent)",
            }}
          >
            <span>+ 새 채팅 시작</span>
          </button>
        </div>

        {/* 히스토리 목록 */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-2 pb-4 flex flex-col">
          {sortedSessions.length === 0 ? (
            <div
              className="text-xs py-8 text-center"
              style={{ color: "var(--text)" }}
            >
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
                  className="pl-3.5 pr-1 mb-1.5 rounded-lg cursor-pointer transition-all duration-200 ease-in-out flex items-center justify-between gap-2 relative border-l-[3px] border-solid box-border text-xs"
                  style={{
                    backgroundColor: isActive
                      ? "var(--bg-hover)"
                      : isHovered
                        ? "var(--bg-hover)"
                        : "transparent",
                    borderLeftColor: isActive
                      ? "var(--accent)"
                      : isHovered
                        ? "var(--border)"
                        : "transparent",
                    color: isActive ? "var(--text-h)" : "var(--text)",
                    fontWeight: isActive ? "700" : "500",
                    opacity: item.isDeleting ? 0 : 1,
                    transform: item.isDeleting
                      ? "translateX(-20px)"
                      : "translateX(0)",
                    height: item.isDeleting ? "0px" : "34px",
                    marginBottom: item.isDeleting ? "0px" : "6px",
                    overflow: item.isDeleting ? "hidden" : "visible",
                    zIndex: activeMenuId === item.sessionId ? 50 : 1,
                  }}
                >
                  {/* 빌딩 형태의 기업 메타 아이콘 추가 */}
                  <svg
                    viewBox="0 0 24 24"
                    width="13"
                    height="13"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0 transition-opacity duration-150"
                    style={{ opacity: isActive || isHovered ? 0.9 : 0.45 }}
                  >
                    <rect
                      x="4"
                      y="2"
                      width="16"
                      height="20"
                      rx="2"
                      ry="2"
                    ></rect>
                    <line x1="9" y1="22" x2="9" y2="16"></line>
                    <line x1="15" y1="22" x2="15" y2="16"></line>
                    <line x1="9" y1="16" x2="15" y2="16"></line>
                    <path d="M9 6h.01"></path>
                    <path d="M15 6h.01"></path>
                    <path d="M9 10h.01"></path>
                    <path d="M15 10h.01"></path>
                  </svg>

                  <span className="overflow-hidden text-ellipsis whitespace-nowrap flex-1 text-left">
                    {item.companyName}
                  </span>

                  <div
                    className="flex items-center justify-center w-8 h-8 shrink-0 mr-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {isHovered || activeMenuId === item.sessionId ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();

                          // 클릭 버튼의 화면 y좌표를 계산하여 아래쪽 여유 공간 판단 (메뉴가 잘리는 현상 방지)
                          const rect = e.currentTarget.getBoundingClientRect();
                          const spaceBelow = window.innerHeight - rect.bottom;
                          const direction = spaceBelow < 120 ? "up" : "down";

                          setMenuDirections((prev) => ({
                            ...prev,
                            [item.sessionId]: direction,
                          }));

                          setActiveMenuId(
                            activeMenuId === item.sessionId
                              ? null
                              : item.sessionId,
                          );
                        }}
                        className="border-none cursor-pointer flex items-center justify-center h-[22px] w-[22px] rounded-md text-sm transition-all duration-150 hover:bg-[var(--bg-hover)]"
                        style={{
                          color:
                            activeMenuId === item.sessionId
                              ? "var(--text-h)"
                              : "var(--text)",
                          backgroundColor:
                            activeMenuId === item.sessionId
                              ? "var(--bg-hover)"
                              : "transparent",
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
                          className="shrink-0 opacity-60"
                        >
                          <path d="M16 12V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v8l-2 2v2h5.2v6l1.3 1.3L13.8 18v-2H19v-2l-2-2z" />
                        </svg>
                      )
                    )}
                  </div>

                  {/* 드롭다운 메뉴 (남은 영역 판단에 따라 위/아래 동적 팝업) */}
                  {activeMenuId === item.sessionId && (
                    <div
                      className="absolute right-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] rounded-md p-1 z-[1010] w-[100px] border border-solid flex flex-col gap-0.5"
                      style={{
                        background: "var(--bg-panel)",
                        borderColor: "var(--border)",
                        ...(menuDirections[item.sessionId] === "up"
                          ? { bottom: "30px" }
                          : { top: "28px" }),
                      }}
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
