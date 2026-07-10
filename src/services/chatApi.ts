import axios from "axios";
import { type ChatSession } from "../types/index";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 대화 세션 목록 조회 API
export const fetchChatSessions = async (): Promise<{ sessions: ChatSession[] }> => {
  const token = sessionStorage.getItem("accessToken");
  const response = await axios.get<{ sessions: ChatSession[] }>(
    `${BACKEND_URL}/api/chat/sessions`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
  return response.data;
};

// 특정 대화 세션 상세 조회 및 복원 API
export const fetchChatSessionDetail = async (sessionId: string) => {
  const token = sessionStorage.getItem("accessToken");
  const response = await axios.get(
    `${BACKEND_URL}/api/chat/sessions/${sessionId}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
  return response.data;
};

// 대화 세션 고정/해제 상태 업데이트 API
export const updateSessionPin = async (sessionId: string, action: "pin" | "unpin") => {
  const token = sessionStorage.getItem("accessToken");
  await axios.patch(
    `${BACKEND_URL}/api/chat/sessions/${sessionId}/${action}`,
    {},
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
};

// 대화 세션 삭제 API
export const deleteChatSession = async (sessionId: string) => {
  const token = sessionStorage.getItem("accessToken");
  await axios.delete(
    `${BACKEND_URL}/api/chat/sessions/${sessionId}`,
    {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    }
  );
};
