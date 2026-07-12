import { apiClient } from "./authApi";
import { type ChatSession } from "../types/index";

// 대화 세션 목록 조회 API
export const fetchChatSessions = async (): Promise<{ sessions: ChatSession[] }> => {
  const response = await apiClient.get<{ sessions: ChatSession[] }>(
    "/api/chat/sessions"
  );
  return response.data;
};

// 특정 대화 세션 상세 조회 및 복원 API
export const fetchChatSessionDetail = async (sessionId: string) => {
  const response = await apiClient.get(
    `/api/chat/sessions/${sessionId}`
  );
  return response.data;
};

// 대화 세션 고정/해제 상태 업데이트 API
export const updateSessionPin = async (sessionId: string, action: "pin" | "unpin") => {
  await apiClient.patch(
    `/api/chat/sessions/${sessionId}/${action}`,
    {}
  );
};

// 대화 세션 삭제 API
export const deleteChatSession = async (sessionId: string) => {
  await apiClient.delete(
    `/api/chat/sessions/${sessionId}`
  );
};
