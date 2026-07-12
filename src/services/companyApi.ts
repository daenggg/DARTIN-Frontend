import { apiClient } from "./authApi";
import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "";

// 특정 기업 실시간 상세 수집 및 분석 요청 API (SSE 스트리밍 방식)
export const fetchCompanyAnalysisStream = async (
  corpCode: string,
  onEvent: (type: string, data: any) => void
): Promise<void> => {
  const token = sessionStorage.getItem("accessToken");
  const response = await fetch(
    `${BACKEND_URL}/api/company?corp_code=${corpCode}`,
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
        Accept: "text/event-stream",
      },
    }
  );

  // SSE 연결 중 401 Unauthorized 감지 시 수동 토큰 리프레시 및 재시도
  if (response.status === 401) {
    try {
      const refreshResponse = await axios.post(
        `${BACKEND_URL}/api/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newAccessToken = refreshResponse.data.accessToken;
      if (newAccessToken) {
        sessionStorage.setItem("accessToken", newAccessToken);
        // 새 토큰으로 스트림 연결 재시도
        return fetchCompanyAnalysisStream(corpCode, onEvent);
      }
    } catch (refreshError) {
      console.error("Session expired during stream connection. Redirecting to login...", refreshError);
      sessionStorage.clear();
      window.location.href = "/";
      throw refreshError;
    }
  }

  if (!response.body) throw new Error("No response body");

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      if (trimmed.startsWith("data:")) {
        const rawData = trimmed.substring(5).trim();
        try {
          const parsed = JSON.parse(rawData);
          onEvent(parsed.type, parsed.data);
        } catch (e) {
          console.error("Failed to parse SSE line", trimmed, e);
        }
      }
    }
  }
};

// 입력하신 키워드에 상응하는 상장 기업 후보군 검색 API
export const searchCompanies = async (searchQuery: string) => {
  const response = await apiClient.get(
    "/api/company/search",
    {
      params: { search_query: searchQuery },
    }
  );
  return response.data;
};
